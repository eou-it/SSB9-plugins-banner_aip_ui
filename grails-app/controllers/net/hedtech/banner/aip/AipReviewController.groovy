/*******************************************************************************
 Copyright 2019 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import grails.util.Holders
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.i18n.MessageHelper
import net.hedtech.banner.general.ConfigurationData
import org.grails.plugins.web.taglib.ValidationTagLib

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

        Map paramsMap = [searchString: params.searchString ? params.searchString : ""]
        def criteriaMap = [:]
        def filterData = [params: paramsMap, criteria: criteriaMap]

        def result = monitorActionItemCompositeService.searchMonitorActionItems(actionItemid, params?.personName, params?.personId?.trim(), filterData, pagingAndSortParams)
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
                userActionItemId : Long.parseLong(params.userActionItemId),
                responseId   : Long.parseLong(params.responseId),
                sortColumn   : params.sortColumnName ?: "id",
                sortAscending: params.ascending ? params.ascending.toBoolean() : false
        ]
        def results = uploadDocumentCompositeService.fetchDocuments( paramsObj )
        render results as JSON
    }

    /**
     * get list of review status
     */
    def getReviewStatusList() {
        def result = monitorActionItemCompositeService.getReviewStatusList()
        render result as JSON
    }


    /**
     * update action item review
     */
    def updateActionItemReview(){
        def result
        def map = request.JSON
        if(!(map?.reviewStateCode))   {
            result =[success:false,message:MessageHelper.message('aip.review.action.update.review.state.error')]
        }
        if(!result){
            try {
            result = monitorActionItemCompositeService.updateActionItemReview(map)
            } catch (ApplicationException e) {
                result = [ success: false,message : e.returnMap( { mapToLocalize -> new ValidationTagLib().message( mapToLocalize ) } ).message ]
            }
        }
        render result as JSON
    }

    /**
     * Gets the list of contact information values.
     * @return contact information list as JSON
     */
    def getContactInformation() {
        def configName = "BANNER_AIP_REVIEWER_CONTACT_INFORMATION"
        def configType = "arraylist"
        def configApplicationId = "GENERAL_SS"

        def configData = ConfigurationData.fetchByNameAndType(configName, configType, configApplicationId)

        def results = configData.value
        results = results.substring(1, results.length()-1)
        List<String> contactInformationList = new ArrayList<String>(Arrays.asList(results.split(",")));
        List<ConfigurationData> configDataList = new ArrayList<ConfigurationData>();
        contactInformationList.each {
            configDataList.add(new ConfigurationData(
                    name: it,
                    type: "string",
                    value: it,
                    version:  0.0,
                    lastModified: new Date(),
                    lastModifiedBy: "test",
                    dataOrigin: "Banner"
            ))
        }

        render configDataList as JSON

    }

}
