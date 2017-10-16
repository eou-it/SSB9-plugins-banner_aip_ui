/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.exceptions.ApplicationException
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib

/**
 * Controller class for AIP Action Item Posting
 */
class AipActionItemPostingController {
    private static final def LOGGER = Logger.getLogger( this.class )
    def actionItemPostingCompositeService
    def actionItemGroupAssignReadOnlyService
    def actionItemProcessingCommonService
    /**
     * Add Action Item Post
     * @return
     */
    def addActionItemPosting() {
        def map = [:]
        map = request.JSON
        def model
        try {
            model = actionItemPostingCompositeService.addActionItemPosting( map )
        } catch (ApplicationException e) {
            model = [fail: true]
            LOGGER.error( e.getMessage() )
            model.message = e.returnMap( {mapToLocalize -> new ValidationTagLib().message( mapToLocalize )} ).message
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

        def paginationParam = [max   : params.max.toInteger(),
                               offset: params.offset ? params.offset.toInteger() : 0]
        def map = actionItemGroupAssignReadOnlyService.fetchGroupLookup( params.searchParam, paginationParam )
        render map as JSON
    }

    /**
     * Get active group action item LOV
     * @return
     */
    def getActionGroupActionItemLov() {
        def paginationParam = [max   : params.max.toInteger(),
                               offset: params.offset ? params.offset.toInteger() : 0]
        def map = actionItemGroupAssignReadOnlyService.fetchActiveActionItemByGroupId( (params.searchParam ?: 0) as long, paginationParam )
        render map as JSON
    }
}
