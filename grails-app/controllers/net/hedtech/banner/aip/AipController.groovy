/*********************************************************************************
 Copyright 2016 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON
import org.springframework.security.access.annotation.Secured
import net.hedtech.banner.security.BannerUser
import org.springframework.security.core.context.SecurityContextHolder

import java.security.InvalidParameterException

class AipController {

    static defaultAction = "list"
    def userActionItemReadOnlyService
    def actionItemDetailService
    def groupFolderReadOnlyService

    @Secured (['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def list() {
        def model = [fragment: "/list"]
        render (model:model, view: "index")
    }

    @Secured (['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def admin() {
        def model = [fragment:"/landing"]
        render (model:model, view:"index")
    }

    def logout() {
        redirect (url: "/logout")
    }
    // Check if user has pending action items or not.
    def checkActionItem() {
        def model=[:]
        //TODO: get user's pending action items (service call), if exist, then return true
        model.isActionItem = true;
        render model as JSON;
    }

    @Secured (['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def adminGroupList() {
        def actionItemGroups = groupFolderReadOnlyService.listActionItemGroups()

        def groupList = []
        if (actionItemGroups.size() > 0) {
            actionItemGroups?.each { group ->
                def groupItem = [
                        id          : group.groupId,
                        title       : group.groupTitle,
                        status      : group.groupStatus,
                        user        : group.groupUserId,
                        description : group.groupDesc,
                        activity    : group.groupActivityDate,
                        folder      : group.folderName,
                        vpdiCode    : group.groupVpdiCode
                ]
                groupList << groupItem
            }
        }

        //TODO: header configuration should probably come from a config file - TBD
        def testDataHeader = [
                [name: "id", title: "id", options: [visible: false, isSortable: true]],
                [name: "title", title: "Title", options: [visible: true, isSortable: true]],
                [name: "status", title: "Status", options: [visible: true, isSortable: true]],
                [name: "folder", title: "Folder", options: [visible: true, isSortable: true]],
                [name: "activity", title: "Activity", options: [visible: true, isSortable: true]],
                [name: "user", title: "User", options: [visible: true, isSortable: true]]
            ]
        def model = [
                header: testDataHeader,
                data: groupList
        ]
        render model as JSON
    }

    // Return user's action items
    @Secured (['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def actionItems( ) {
        def itemsList = []
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
        def actionItems = userActionItemReadOnlyService.listActionItemByPidm( userPidm )
        //TODO: group is hardcoded. to be pulled from db in future US
        def myItems = [
                name   : "registration",
                groupId: 0,
                info   : getActionGroupDescription( "registration" ),
                header : ["title", "state", "description"]
        ]
        def items = []
        if (actionItems.size() > 0) {
            actionItems?.each { item ->
                def actionItem = [
                        id         : item.id,
                        name       : item.title,
                        state      : item.status,
                        title      : item.title,
                        description: item.description
                ]
                items << actionItem
            }
            myItems.items = items
            itemsList << myItems
        }
        render itemsList as JSON
    }

    // Return login user's information
    @Secured (['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def userInfo() {
        if(!userPidm) {
            response.sendError(403)
            return
        }
        def personForAIP = AipControllerUtils.getPersonForAip(params, userPidm)
        render personForAIP as JSON
    }

    @Secured (['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def detailInfo() {
        def jsonObj = request.JSON; //type, groupId, actionItemId
        def itemDetailInfo
        //TODO:: create service for retrieving detail information for group or actionItem from DB
        try {
            if(jsonObj.type == "group") {
//                itemDetailInfo = actionItemDetailService.getGroupDetailById(jsonObj.groupId)
                itemDetailInfo = [[
                        text: "Group detail information for group " + jsonObj.groupId.toString() + " goes here",   //require
                        id: jsonObj.groupId,
                        title: "Group",
                        groupId: jsonObj.groupId,
                        version: 0,
                        userId: "GRAIL",
                        dataOrigin: "GRAIL"
                ]]
            } else if(jsonObj.type == "actionItem") {
                itemDetailInfo = actionItemDetailService.listActionItemDetailById(jsonObj.actionItemId)
//                itemDetailInfo = [
//                        content: "Action item information for item " + jsonObj.actionItemId.toString() + " goes here",
//                        type: "doc",
//                        id: jsonObj.actionItemId, //remove or not
//                        title: "Action item information"
//                ]
            }
        }catch(Exception e) {
            org.codehaus.groovy.runtime.StackTraceUtils.sanitize(e).printStackTrace()
            throw e
        } finally {
            render itemDetailInfo as JSON
        }
    }

    def adminGroupStatus() {
        //TODO:: get group status from DB through service
        def model = [
                [
                    "id":1,
                    "value": "pending"
                ], [
                    "id":2,
                    "value":"active"
                ], [
                    "id":3,
                    "value": "inactive"
                ]
            ]
        render model as JSON
    }

    def adminGroupFolder() {
        //TODO:: get group folders from DB through service
        def model = [
                [
                    "id":1,
                    "value":"Folder 1"
                ], [
                    "id":2,
                    "value":"Folder 2"
                ]
        ]
        render model as JSON
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
                item.put("title", "aip.user.list.header.title.registration")
                item.put("description", "aip.user.list.header.description.registration")
                break;
            case "graduation":
                item.put("title", "aip.user.list.header.title.graduation")
                item.put("description", "aip.user.list.header.description.graduation")
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
            //TODO:: extract necessary user information and return. (ex: remove pidm, etc)
            return user.pidm
        }
        return null
    }

}
