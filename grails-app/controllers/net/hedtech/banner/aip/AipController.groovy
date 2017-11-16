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
        def itemDetailInfo = userActionItemReadOnlyCompositeService.actionItemOrGroupInfo( params )
        render itemDetailInfo as JSON
    }

}
