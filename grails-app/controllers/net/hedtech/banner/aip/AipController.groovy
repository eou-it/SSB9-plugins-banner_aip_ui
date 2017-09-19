/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured
import net.hedtech.banner.MessageUtility
import net.hedtech.banner.security.BannerUser
import org.springframework.security.core.context.SecurityContextHolder

import java.security.InvalidParameterException

/**
 * AIP Controller class to have all API endpoints
 */
class AipController {

    static defaultAction = "list"

    def userActionItemReadOnlyService

    def actionItemDetailService

    def groupFolderReadOnlyService

    def actionItemReadOnlyService


    @Secured(['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def list() {
        def model = [fragment: "/list"]
        render( model: model, view: "index" )
    }


    @Secured(['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def informedList() {
        def model = [fragment: "/informedList"]
        render( model: model, view: "index" )
    }


    @Secured(['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def admin() {
        def model = [fragment: "/landing"]
        render( model: model, view: "index" )
    }


    def logout() {
        redirect( url: "/logout" )
    }
    // Check if user has pending action items or not.
    def checkActionItem() {
        def model = [:]
        //TODO: get user's pending action items (service call), if exist, then return true
        model.isActionItem = true;
        render model as JSON;
    }

    //todo: this is probably going to go away w/new method in admin controller
    @Secured(['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def adminGroupList() {
        def actionItemGroups = groupFolderReadOnlyService.listActionItemGroups()

        def groupList = []
        if (actionItemGroups.size() > 0) {
            actionItemGroups?.each {group ->
                def groupItem = [
                        id         : group.groupId,
                        title      : group.groupTitle,
                        status     : group.groupStatus,
                        user       : group.groupUserId,
                        description: group.groupDesc,
                        activity   : group.groupActivityDate,
                        folder     : group.folderName,
                        //dataOrigin : group.groupDataOrigin
                ]
                groupList << groupItem
            }
        }

        //TODO: header configuration should probably come from a config file - TBD
        def testDataHeader = [
                [name: "id", title: "id", options: [visible: false, isSortable: true]],
                [name: "title", title: MessageUtility.message( "aip.common.title" ), options: [visible: true, isSortable: true]],
                [name: "status", title: MessageUtility.message( "aip.common.status" ), options: [visible: true, isSortable: true]],
                [name: "folder", title: MessageUtility.message( "aip.common.folder" ), options: [visible: true, isSortable: true]],
                [name: "activity", title: MessageUtility.message( "aip.common.activity.date" ), options: [visible: true, isSortable: true]],
                [name: "user", title: MessageUtility.message( "aip.common.last.updated.by" ), options: [visible: true, isSortable: true]]
        ]
        def model = [
                header: testDataHeader,
                result: groupList,
                length: groupList.size()

        ]
        render model as JSON
    }

    // Return user's action items
    @Secured(['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def actionItems() {
        def itemsList = []
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
        def actionItems = userActionItemReadOnlyService.listActionItemsByPidm( userPidm )
        //TODO: group is hardcoded. to be pulled from db in future US

        def userGroupInfo = []
        def groupDesc
        def actionItemGroups = groupFolderReadOnlyService.listActionItemGroups()

        if (actionItemGroups.size() > 0) {
            actionItemGroups[0]?.each {group ->
                if (!group.groupDesc) {
                    groupDesc = MessageUtility.message( "aip.placeholder.nogroups" )
                } else {
                    groupDesc = group.groupDesc
                }
                def groupItem = [
                        id         : group.groupId,
                        title      : group.groupTitle,
                        description: groupDesc,
                        header     : ["title", "state", "completedDate", "description"]

                ]
                userGroupInfo << groupItem
            }
        }

        def myItems = [
                groups: userGroupInfo
        ]

        def items = []
//        if (actionItems.size() > 0) {
        actionItems?.each {item ->
            def actionItem = [
                    id           : item.id,
                    title        : item.title,
                    name         : item.name,
                    state        : item.status,
                    description  : item.description,
                    completedDate: item.completedDate
            ]
            items << actionItem
        }
        myItems.groups[0].items = items
//            itemsList << myItems
//        }
        render myItems as JSON
    }

    // Return login user's information
    @Secured(['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def userInfo() {
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
        def personForAIP = AipControllerUtils.getPersonForAip( params, userPidm )
        render personForAIP as JSON
    }


    @Secured(['ROLE_SELFSERVICE-FACULTY_BAN_DEFAULT_M', 'ROLE_SELFSERVICE-STUDENT_BAN_DEFAULT_M'])
    def detailInfo() {
        //TODO:: tie in groups and user in db and create an associated service
        def jsonObj = request.JSON; //type, groupId, actionItemId
        def itemDetailInfo
        def groupDesc

        try {
            if (jsonObj.type == "group") {
                //itemDetailInfo = actionItemDetailService.getGroupDetailById(jsonObj.groupId)

                def actionItemGroups = groupFolderReadOnlyService.listActionItemGroups()
                itemDetailInfo = []
                if (actionItemGroups.size() > 0) {
                    actionItemGroups[0]?.each {group ->
                        if (!group.groupDesc) {
                            groupDesc = MessageUtility.message( "aip.placeholder.nogroups" )
                        } else {
                            groupDesc = group.groupDesc
                        }
                        def groupItem = [
                                id      : group.groupId,
                                title   : group.groupTitle,
                                status  : group.groupStatus,
                                userId  : group.groupUserId,
                                text    : groupDesc,
                                activity: group.groupActivityDate,
                                //dataOrigin: group.groupDataOrigin,
                                version : group.groupVersion
                        ]
                        itemDetailInfo << groupItem
                    }
                }

                //TODO: Add data origin to action item group view

                /*
                if (groupList.description == null || groupList.description.length == 0) {
                    groupDesc =  MessageUtility.message( "aip.placeholder.nogroups" )
                } else {
                    groupDesc = groupList.description
                }
                itemDetailInfo = [[

                                          text      : groupDesc,   //require
                                          id        : groupList[0]id,
                                          title     : groupList.title,
                                          groupId   : groupList.status,
                                          version   : groupList.version,
                                          userId    : groupList.user,
                                          dataOrigin: "GRAILS"


                                  ]]
                                  */
            } else if (jsonObj.type == "actionItem") {
                itemDetailInfo = actionItemDetailService.listActionItemDetailById( jsonObj.actionItemId )
//                itemDetailInfo = [
//                        content: "Action item information for item " + jsonObj.actionItemId.toString() + " goes here",
//                        type: "doc",
//                        id: jsonObj.actionItemId, //remove or not
//                        title: "Action item information"
//                ]
            }
        } catch (Exception e) {
            org.codehaus.groovy.runtime.StackTraceUtils.sanitize( e ).printStackTrace()
            throw e
        } finally {
            render itemDetailInfo as JSON
        }
    }


    def adminGroupStatus() {
        //TODO:: get group status from DB through service
        def model = [
                [
                        "id"   : 1,
                        "value": "Draft"
                ], [
                        "id"   : 2,
                        "value": "Active"
                ], [
                        "id"   : 3,
                        "value": "Inactive"
                ]
        ]
        render model as JSON
    }

    // It might be better in service in banner_aip.git, not in controller since this shouldn't be able to access from front-end
    // It might not be needed depends on query style on user items
    def getItemInfo( type ) {
        //TODO: change whatever it needed
        Map item = [:]
        switch (type) {
            case "drugAndAlcohol":
                item.put( "description", "You must review and confirm the Ellucian University Campus Drug and Alcohol Policy prior to registering for classes." )
                item.put( "title", "Drug and Alcohol Policy" )
                break
            case "registrationTraining":
                item.put( "description", "It is takes 10 minutes, review the training video provided to help expedite your registration experience." )
                item.put( "title", "Registration Process Training" )
                break;
            case "personalInfo":
                item.put( "description", "It is important that we have you current information such as your name, and contact information therefore it is required that you review, update and confirm your personal information." )
                item.put( "title", "Personal Information" )
                break;
            case "meetAdvisor":
                item.put( "description", "You must meet with you Advisor or ensure you are on target to meet your educational goals for graduation." )
                item.put( "title", "Meet with Advisor" )
                break;
            case "residenceProof":
                item.put( "description", "" )
                item.put( "title", "Proof of Residence" )
                break;
            default:
                throw new InvalidParameterException( "Invalid action item type" )
                break;
        }
        return item
    }

    // It might be better in service banner_aip.git, not in controller since this shouldn't be able to access from front-end
    // It might not be needed depends on query style on user items
    def getActionGroupDescription( type ) {
        //TODO: change whatever it needed
        Map item = [:]
        switch (type) {
            case "registration":
                item.put( "title", "aip.user.list.header.title.registration" )
                item.put( "description", "aip.user.list.header.description.registration" )
                break;
            case "graduation":
                item.put( "title", "aip.user.list.header.title.graduation" )
                item.put( "description", "aip.user.list.header.description.graduation" )
                break;
            default:
                item.put( "title", "" )
                item.put( "description", "" )
        }
        return item
    }


    private def getUserPidm() {
        def user = SecurityContextHolder?.context?.authentication?.principal
        if (user instanceof BannerUser) {
            //TODO:: extract necessary user information and return. (ex: remove pidm, etc)
            return user.pidm
        }
        return null
    }

}
