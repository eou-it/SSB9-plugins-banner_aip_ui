/**
 * Created by jshin on 12/22/15.
 */
package net.hedtech.banner.csr

import grails.converters.JSON
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.csr.ActionItem
import java.security.InvalidParameterException
import net.hedtech.banner.general.person.PersonUtility
import net.hedtech.banner.security.BannerUser
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.context.i18n.LocaleContextHolder
import javax.persistence.*

class CsrController {

    static defaultAction = "listItems"
    def model=[:]
    def actionItemService
    def userActionItemReadOnlyService

    // Entry point. Load front-end resources & layout template
    def listItems() {
        render(model: model, view: "index")
    }


    // Check if user has pending action items or not.
    def checkActionItem() {
        def model=[:]
        //TODO: get user's pending action items (service call), if exist, then return true
        model.isActionItem = true;
        render model as JSON;
    }

    // Return all action items for admin
    // this is totally wrong. this method created only for demo purpose. wrong column name, data, structure
    def adminActionItems() {
        def jsonTestHeaderData = '[' +
                '{name: "id", title: "ID", options:{visible:false, isSortable: false}},' +
                '{name: "name", title: "Name", options:{visible:true, isSortable: false}},' +
                '{name: "type", title: "Type", options:{visible:true, isSortable: false}},' +
                '{name: "description", title: "Description", options:{visible:true, isSortable: false}},' +
                '{name: "lastModifiedDate", title: "Last Modified Date", options:{visible:true, isSortable: false}},' +
                '{name: "lastModifiedBy", title: "Last Modified By", options:{visible:true, isSortable: false}}' +
                ']'

        def jsonTestItemData = '[' +
                '{id: 0, name: "Visa_status", type:0, description:"Visa documents upload", lastModifiedDate: new Date(1452207955638), lastModifiedBy: "userId"},' +
                '{id: 1, name: "Medical_Record", type:0, description: "Medical record documents upload", lastModifiedDate: new Date(1452207955638), lastModifiedBy: "another userId"},' +
                '{id: 2, name: "Permanent_Address", type:3, description: "Permanent residential address", lastModifiedDate: new Date(1452207955638), lastModifiedBy: "same user Id"}' +
                ']'
        def model = [:]
        model.header = JSON.parse(jsonTestHeaderData)
        model.result = JSON.parse(jsonTestItemData)

        render model as JSON
    }

    def codeTypes() {
        def model = ["Student", "Person", "General", "All"]
        render model as JSON
    }

    // Return user's action items
    public def actionItems( ) {
        def itemsList = []
        if(!userPidm) {
            response.sendError(403)
            return
        }
        try {
//            def actionItems = actionItemService.listActionItems()
            def actionItems = userActionItemReadOnlyService.listActionItemByPidm(userPidm)
            def myItems = [
                    name  : "registration",
                    info  : getActionGroupDescription("registration"),
                    header: ["title", "state", "description"]
            ]
            def items = []
            if (actionItems.size() > 0) {
                actionItems?.each { item ->
                    def actionItem = [
                            id         : item.id,
                            name       : item.title,
                            state      : "csr.user.list.item.state.pending",
                            title      : item.title,
                            description: item.description
                    ]
                    items << actionItem
                }
                myItems.items = items
                itemsList << myItems
            }
            render itemsList as JSON
        } catch(Exception e) {
            org.codehaus.groovy.runtime.StackTraceUtils.sanitize(e).printStackTrace()
        }
    }

    // Return login user's information
    def userInfo() {
        if(!userPidm) {
            response.sendError(403)
            return
        }
        def personForCSR = CsrControllerUtils.getPersonForCSR(params, userPidm)
        render personForCSR as JSON
    }

    // It might be better in service in banner_csr.git, not in controller since this shouldn't be able to access from front-end
    // It might not be needed depends on query style on user items
    def getItemInfo(type) {
        //TODO: change whatever it needed
        Map item = [:]
        switch(type) {
            case "drugAndAlcohol":
                item.put("description", "You must review and confirm the Ellucian University Campus Drug and Alcohol Policy prior to registering for classes.")
                item.put("title", "Drug and Alcohol Policy")
                break
            case "registrationTraining":
                item.put("description", "It is takes 10 minutes, review the training video provided to help expedite your registration experience.")
                item.put("title", "Registration Process Training")
                break;
            case "personalInfo":
                item.put("description", "It is important that we have you current information such as your name, and contact information therefore it is required that you review, update and confirm your personal information.")
                item.put("title", "Personal Information")
                break;
            case "meetAdvisor":
                item.put("description", "You must meet with you Advisor or ensure you are on target to meet your educational goals for graduation.")
                item.put("title", "Meet with Advisor")
                break;
            case "residenceProof":
                item.put("description", "")
                item.put("title", "Proof of Residence")
                break;
            default:
                throw new InvalidParameterException("Invalid action item type")
                break;
        }
        return item
    }





    // It might be better in service banner_csr.git, not in controller since this shouldn't be able to access from front-end
    // It might not be needed depends on query style on user items
    def getActionGroupDescription(type) {
        //TODO: change whatever it needed
        Map item = [:]
        switch (type) {
            case "registration":
                item.put("title", "csr.user.list.header.title.registration")
                item.put("description", "csr.user.list.header.description.registration")
                break;
            case "graduation":
                item.put("title", "csr.user.list.header.title.graduation")
                item.put("description", "csr.user.list.header.description.graduation")
                break;
            default:
                item.put("title", "")
                item.put("description", "")
        }
        return item
    }

    private def getUserPidm( ) {
        def user = SecurityContextHolder?.context?.authentication?.principal
        if (user instanceof BannerUser) {
            return user.pidm
        }
        return null
    }

}
