/**
 * Created by jshin on 12/22/15.
 */
package net.hedtech.banner.csr

import grails.converters.JSON
import net.hedtech.banner.csr.ActionItemList
import java.security.InvalidParameterException
import org.springframework.context.i18n.LocaleContextHolder
import javax.persistence.*

class CsrController {

    static defaultAction = "listItems"
    def model=[:]
    def actionItemListService

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
    def actionItems() {
        //TODO: get user's assigned action item group  (service call)
        //TODO: get all action items in group (service call)
        //TODO: create return json structure
        def actionItems = [
                [
                        name: "registration",
                        info: getActionGroupDescription("registration"),
                        header: ["title", "state", "description"],
                        items: [
                                [id: 1, name: "drugAndAlcohol", state: "csr.user.list.item.state.pending", title: getItemInfo("drugAndAlcohol").title, description: getItemInfo("drugAndAlcohol").description],
                                [id: 2, name: "registrationTraining", state: "csr.user.list.item.state.pending", title: getItemInfo("registrationTraining").title, description: getItemInfo("registrationTraining").description],
                                [id: 3, name: "personalInfo", state: "csr.user.list.item.state.pending", title: getItemInfo("personalInfo").title, description: getItemInfo("personalInfo").description],
                                [id: 4, name: "meetAdvisor", state: "csr.user.list.item.state.pending", title: getItemInfo("meetAdvisor").title, description: getItemInfo("meetAdvisor").description],
                                [id: 5, name: "residenceProof", state: "csr.user.list.item.state.pending", title: getItemInfo("residenceProof").title, description: getItemInfo("residenceProof").description]
                        ]
                ], [
                        name: "graduation",
                        info: getActionGroupDescription("graduation"),
                        header: ["title", "state", "description"],
                        items: [
                                [id: 4, name: "meetAdvisor", state: "csr.user.list.item.state.pending", title: getItemInfo("meetAdvisor").title, description: getItemInfo("meetAdvisor").description],
                        ]
                ]
        ]
        render actionItems as JSON
    }


    def actionItemsNew() {
        
        def getItems = ActionItemList.fetchActionItems()
        def itemsList = []
        getItems?.each {
            itemsList.add(it.title)
        }

        def model = [title: itemsList]

        return model

    }



    // Return login user's information
    def userInfo() {
        //TODO: get login user's info(whatever id) from session
        //TODO: get necessary user info from DB (service call)
        //TODO: create return json structure as needed
        def userInfo = [
                firstName: "First",
                lastName: "Last",
                preferredName: "Test User",
                graduateCredit: 121
        ]
        render userInfo as JSON
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

}