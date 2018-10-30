/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON

/** Controller for Review Action Items **/

class AipReviewController {
    static defaultAction = "monitor"
    def monitorActionItemCompositeService

    def monitor() {
        render(view: "aipReview")
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
        Long actionItemid = params?.actionId ? Long.valueOf(params?.actionId) : 0
        //TODO: hard coded values To be removed after creating implemeting the grid on ui side
		def pagingAndSortParams = [sortColumn: "actionItemName", sortDirection: "asc", max: 5, offset: 0]

        Map paramsMap = [:]
        def criteriaMap = [:]
        def filterData = [params: paramsMap, criteria: criteriaMap]

        def result = monitorActionItemCompositeService.searchMonitorActionItems(actionItemid, params?.personName?.trim(), params?.personId?.trim(),filterData,pagingAndSortParams)
        render result as JSON
    }
}
