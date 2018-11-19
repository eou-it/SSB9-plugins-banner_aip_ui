/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON

/** Controller for Review Action Items **/

class AipReviewController {
    static defaultAction = "monitor"
    def monitorActionItemCompositeService
    def uploadDocumentCompositeService


    def monitor() {
        render( view: "aipReview" )
    }

    /**
     * Fetch Action Item Names
     * @return
     */
    def fetchActionItemNames() {
        def result = monitorActionItemCompositeService.getActionItemNames()
        render result as JSON
    }

    /**
     * fetch action item based on the serch parameter
     * @return List of action items matching the search criteria
     */
    def searchActionItems() {
        Long actionItemid = params?.actionItemId ? Long.valueOf( params?.actionItemId ) : null

        def pagingAndSortParams = [sortColumn   : params.sortColumnName,
                                   sortAscending: params.ascending ? params.ascending.toBoolean() : false,
                                   max          : params.max,
                                   offset       : params.offset]

        Map paramsMap = [:]
        def criteriaMap = [:]
        def filterData = [params: paramsMap, criteria: criteriaMap]

        def result = monitorActionItemCompositeService.searchMonitorActionItems( actionItemid, params?.personName?.trim(), params?.personId?.trim(), filterData, pagingAndSortParams )
        render result as JSON
    }

    /**
     * get action item based on the surrogate id
     */
    def getActionItem() {
        Long userActionItemID = params?.userActionItemID ? Long.valueOf( params?.userActionItemID ) : null

        def result = monitorActionItemCompositeService.getActionItem( userActionItemID )

        render result as JSON
    }

    /**
     * Gets list of attached documents for a response.
     * @return documents list as JSON
     */
    def listDocuments() {
        def paramsObj = [
                actionItemId : params.actionItemId,
                responseId   : params.responseId,
                personId     : params.personId,
                sortColumn   : params.sortColumnName ?: "id",
                sortAscending: params.ascending ? params.ascending.toBoolean() : false
        ]
        def results = uploadDocumentCompositeService.fetchDocuments( paramsObj )
        render results as JSON
    }
}
