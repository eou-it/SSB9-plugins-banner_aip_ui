/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON

/**
 * AIP Controller class to have all API endpoints
 */
class AipController {

    static defaultAction = "list"
    def userActionItemReadOnlyCompositeService
    def springSecurityService

    def list() {
        render(view: "aip" )
    }

    /**
     * Informed list
     * @return
     */
    def informedList() {
        def reUrl = params.reUrl?params.reUrl : ""
        render(view: "aip",model: [reUrl:reUrl] )
    }

    /**
     * Logs out
     * @return
     */
    def logout() {
        redirect( url: "/logout" )
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
        def itemDetailInfo = userActionItemReadOnlyCompositeService.actionItemOrGroupInfo( params )
        render itemDetailInfo as JSON
    }
}
