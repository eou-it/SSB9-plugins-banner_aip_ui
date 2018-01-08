/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
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
        def model = []
        render( model: model, view: "index" )
    }

    /**
     * Informed list
     * @return
     */
    def informedList() {
        def model = []
        render( model: model, view: "index" )
    }

    /**
     * Admin landing page
     * @return
     */
//    def admin() {
//        def model = [fragment: "/landing"]
//        render( model: model, view: "index" )
//    }

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
