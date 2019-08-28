/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON
import groovy.util.logging.Slf4j
import net.hedtech.banner.exceptions.ApplicationException
import org.grails.plugins.web.taglib.ValidationTagLib

/**
 * Controller class for AIP Action Item Posting
 */
@Slf4j
class AipActionItemPostingController {

    def actionItemPostCompositeService

    def actionItemGroupAssignReadOnlyService

    def actionItemProcessingCommonService

    def actionItemPostReadOnlyService

    def actionItemPostDetailService

    /**
     * Add recurring action Item Post
     * @return
     */

    def addRecurringActionItemPosting(){
        def map = [:]
        map = request.JSON
        log.trace "Recurring post add - {$request.JSON.toString()}";
        def model
        try{
        model = actionItemPostCompositeService.addRecurringActionItemPosting(map)
        }catch(ApplicationException e){
            model = [fail: true]
            log.error( e.getMessage() )
            model.message = e.returnMap( { mapToLocalize -> new ValidationTagLib().message( mapToLocalize ) } ).message
        }
        render model as JSON;
    }

    /**
     * Update recurring action Item Post
     * @return
     */
    def updateRecurringActionItemPosting(){
        def map = [:]
        map = request.JSON
        log.trace "Recurring post update - {$request.JSON.toString()}";
        def model
        try{
            model = actionItemPostCompositeService.updateRecurringActionItemPosting(map)
        }catch(ApplicationException e){
            model = [fail: true]
            log.error( e.getMessage() )
            model.message = e.returnMap( { mapToLocalize -> new ValidationTagLib().message( mapToLocalize ) } ).message
        }
        render model as JSON;
    }


    /**
     * Add Action Item Post
     * @return
     */
    def addActionItemPosting() {
        def map = [:]
        map = request.JSON
        map.postNow = 'true' == map.postNow
        map.scheduled = 'true' == map.scheduled
        def model
        try {
            model = actionItemPostCompositeService.sendAsynchronousPostItem( map )
        } catch (ApplicationException e) {
            model = [fail: true]
            log.error( e.getMessage() )
            model.message = e.returnMap( { mapToLocalize -> new ValidationTagLib().message( mapToLocalize ) } ).message
        }
        render model as JSON
    }

    

    /**
     * update Action Item Post
     * @return
     */
    def updateActionItemPosting() {
        def map = [:]
        map = request.JSON
        map.postNow = 'true' == map.postNow
        map.scheduled = 'true' == map.scheduled
        def model
        try {
            model = actionItemPostCompositeService.updateAsynchronousPostItem( map )
        } catch (ApplicationException e) {
            model = [fail: true]
            log.error( e.getMessage() )
            model.message = e.returnMap( { mapToLocalize -> new ValidationTagLib().message( mapToLocalize ) } ).message
        }
        render model as JSON
    }

    /**
     * API for folders LOV
     * @return
     */
    def populationListForSendLov() {
        def paginationParam = [max   : params.max,
                               offset: params.offset]
        def results = actionItemProcessingCommonService.fetchPopulationListForSend( params.searchParam, paginationParam )
        render results as JSON
    }

    /**
     * Get group LOV
     * @return
     */
    def getGroupLov() {
        def map = actionItemGroupAssignReadOnlyService.fetchGroupLookup()
        render map as JSON
    }

    /**
     * Get active group action item LOV
     * @return
     */
    def getActionGroupActionItemLov() {
        def map = actionItemGroupAssignReadOnlyService.fetchActiveActionItemByGroupId( (params.searchParam ?: 0) as long )
        render map as JSON
    }

    /**
     * List action item post jobs
     * @return
     */
    def actionItemPostJobList() {

        def paramObj = [recurringPostId: params.recurringPostId ?:"",
                        searchParam  : params.searchParam ?:"%",
                        sortColumn   : params.sortColumnName ?: "id",
                        sortAscending: params.ascending ? params.ascending.toBoolean() : false,
                        max          : params.max.toInteger(),
                        offset       : params.offset ? params.offset.toInteger() : 0]

        def results = actionItemPostReadOnlyService.listActionItemPostJobList(paramObj )
        render results as JSON

    }

    /**
     *  Recurring action item post jobs meta data
     * @return
     */
    def recurringActionItemPostMetaData() {

        def results = actionItemPostReadOnlyService.recurringJobMetaData(params.recurringPostId )
        render results as JSON

    }


    def getStatusValue() {
        def value = actionItemPostReadOnlyService.statusPosted( (params.postID ?: 0) as long )
        render value as String
    }


    def getJobDetailsByPostId() {
        def result = actionItemPostReadOnlyService.JobDetailsByPostId( (params.postID ?: 0) as long )
        render result as JSON
    }


    def getActionItemByPostId() {
        def result = actionItemPostDetailService.fetchByActionItemPostId( (params.postID ?: 0) as long )
        render result as JSON
    }

    /* Fetch the Processed server date,time and timezone for user selected
    * */
    def getProcessedServerDateTimeAndTimezone() {
        def map = [:]
        map = request.JSON
        def result = actionItemProcessingCommonService.fetchProcessedServerDateTimeAndTimezone( map )
        render result as JSON
    }
}
