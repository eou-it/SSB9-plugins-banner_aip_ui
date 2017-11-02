/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.MessageUtility

/**
 * AIP Controller class to have all API endpoints
 */
class AipController {

    static defaultAction = "list"

    def userActionItemReadOnlyCompositeService

    def actionItemContentService

    def actionItemReadOnlyService

    def groupFolderReadOnlyService

    def springSecurityService

    def list() {
        def model = [fragment: "/list"]
        render( model: model, view: "index" )
    }

    def informedList() {
        def model = [fragment: "/informedList"]
        render( model: model, view: "index" )
    }

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

    /**
     * List action items
     * @return
     */
    def actionItems() {
        def model = userActionItemReadOnlyCompositeService.listActionItemByPidmWithinDate()
        render model as JSON
    }

    /**
     * Get User Info
     * @return
     */
    def userInfo() {
        def personForAIP = AipControllerUtils.getPersonForAip( params, springSecurityService.getAuthentication()?.user.pidm )
        render personForAIP as JSON
    }

    /**
     * Get Detail information
     * @return
     */
    def detailInfo() {
        //TODO:: tie in groups and user in db and create an associated service
        def itemDetailInfo
        def groupDesc
        try {
            if (params.searchType == "group") {
                //itemDetailInfo = actionItemDetailService.getGroupDetailById(jsonObj.groupId)

                def actionItemGroups = groupFolderReadOnlyService.getActionItemGroupById( Long.parseLong( params.groupId ) )
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
                                version : group.groupVersion
                        ]
                        itemDetailInfo << groupItem
                    }
                }
            } else if (params.searchType == "actionItem") {
                def itemDetail = actionItemContentService.listActionItemContentById( Long.parseLong( params.actionItemId ) )
                def templateInfo = actionItemReadOnlyService.getActionItemROById( Long.parseLong( params.actionItemId ) )
                itemDetailInfo = []

                if (itemDetail) {
                    itemDetailInfo << itemDetail
                }
                if (templateInfo) {
                    itemDetailInfo << templateInfo
                }

            }
        } catch (Exception e) {
            org.codehaus.groovy.runtime.StackTraceUtils.sanitize( e ).printStackTrace()
            throw e
        } finally {
            render itemDetailInfo as JSON
        }
    }


}
