/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.MessageUtility
import net.hedtech.banner.security.BannerUser
import org.apache.tools.ant.taskdefs.Get
import org.springframework.security.core.context.SecurityContextHolder

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
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
        def model = [fragment: "/list"]
        render( model: model, view: "index" )
    }


    def informedList() {
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
        def model = [fragment: "/informedList"]
        render( model: model, view: "index" )
    }


    def admin() {
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
        def model = [fragment: "/landing"]
        render( model: model, view: "index" )
    }


    def logout() {
        redirect( url: "/logout" )
    }
    // Check if user has pending action items or not.
    def checkActionItem() {
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
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
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
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

    // FIXME: refactor to service
    def detailInfo() {
        if (!userPidm) {
            response.sendError( 403 )
            return
        }
        //TODO:: tie in groups and user in db and create an associated service
        def itemDetailInfo = []
        try {
            if (params.searchType == "group") {
                //itemDetailInfo = actionItemDetailService.getGroupDetailById(jsonObj.groupId)

                def group = groupFolderReadOnlyService.getActionItemGroupById( Long.parseLong( params.groupId ) )
                if (group.size() > 0) {
                    def groupDesc
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
            } else if (params.searchType == "actionItem") {
                def itemDetail = actionItemContentService.listActionItemContentById( Long.parseLong( params.actionItemId ) )
                def templateInfo = actionItemReadOnlyService.getActionItemROById( Long.parseLong( params.actionItemId ) )

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


    private def getUserPidm() {
        def user = SecurityContextHolder?.context?.authentication?.principal
        if (user instanceof BannerUser) {
            return user.pidm
        }
        return null
    }

}
