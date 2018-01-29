/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.aip.common.AipTimezone
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.i18n.MessageHelper
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib

/**
 * Controller class for AIP Admin
 */
class AipAdminController {
    private static final def LOGGER = Logger.getLogger( this.class )
    static defaultAction = "landing"

    def groupFolderReadOnlyService
    def blockingProcessCompositeService

    def actionItemReadOnlyCompositeService
    def actionItemBlockedProcessService

    def actionItemTemplateService

    def actionItemCompositeService

    def actionItemGroupCompositeService

    def actionItemStatusCompositeService

    def actionItemStatusService

    def actionItemStatusRuleReadOnlyService

    def actionItemProcessingCommonService
    def actionItemGroupAssignReadOnlyService
    def actionItemGroupService
    def actionItemService
    def actionItemBlockedProcessCompositeService


    def landing() {
        def model = []
        render( model: model, view: "../aip/index" )
    }


    def group() {
        def model = []
        render( model: model, view: "../aip/index" )
    }


    def action() {
        def model = []
        render( model: model, view: "../aip/index" )
    }


    def status() {
        def model = []
        render( model: model, view: "../aip/index" )
    }


    def post() {
        def model = []
        render( model: model, view: "../aip/index" )
    }

    /**
     * API for folders LOV
     * @return
     */
    def folders() {
        def results = actionItemProcessingCommonService.fetchCommunicationFolders()
        render results as JSON
    }

    /**
     * Add Action Item
     * @return
     */
    def addActionItem() {
        def map = request.JSON

        def result = actionItemCompositeService.addActionItem( map )
        render result as JSON
    }

    /**
     * Edit Action Item
     * @return
     */
    def editActionItem() {
        def map = request.JSON
        def result = actionItemCompositeService.editActionItem( map )
        render result as JSON
    }

    /**
     * Fetch Current Date In Locale format
     * @return
     */
    def fetchCurrentDateInLocaleFormat() {
        def map = actionItemProcessingCommonService.fetchCurrentDateInLocaleFormat()
        render map as JSON
    }

    /**
     *
     * @return
     */
    def is12HourClock() {
        def result = actionItemProcessingCommonService.is12HourClock()
        render result as JSON
    }

    /**
     *
     * @return
     */
    def listAvailableTimezones() {
        List<AipTimezone> timezoneList = actionItemProcessingCommonService.populateAvailableTimezones()
        def result = ['timezones': timezoneList.toArray()]
        render result as JSON
    }

    /**
     * Provides group information for specified id
     * @return
     */
    def openGroup() {
        def success = false

        if (!params.groupId) {
            response.sendError( 403 )
            return
        }

        GroupFolderReadOnly gfro = groupFolderReadOnlyService.getActionItemGroupById( Long.parseLong( params.groupId ) )
        if (gfro) {
            success = true
        }

        def model = [
                success: success,
                errors : [],
                group  : gfro
        ]
        render model as JSON
    }

    /**
     * Creates Group
     * @return
     */
    def createOrUpdateGroup() {
        def result = actionItemGroupCompositeService.createOrUpdateGroup( request.JSON )
        render result as JSON
    }

    /**
     *
     * @return
     */
    def actionItemList() {

        def paramObj = [filterName   : params.searchString ?: "%",
                        sortColumn   : params.sortColumnName ?: "id",
                        sortAscending: params.ascending ? params.ascending.toBoolean() : false,
                        max          : params.max.toInteger(),
                        offset       : params.offset ? params.offset.toInteger() : 0]
        def results = actionItemReadOnlyCompositeService.listActionItemsPageSort( paramObj )
        render results as JSON
    }

    /**
     * Delete a Group
     * @return
     */
    def deleteGroup() {
        def result = actionItemGroupCompositeService.deleteGroup( request.JSON )
        render result as JSON
    }

    /**
     * Delets action item
     * @return
     */
    def deleteActionItem() {
        def map = request.JSON
        def result = actionItemCompositeService.deleteActionItem( map.actionItemId )
        render result as JSON
    }

    /**
     * Open action Item
     * @return
     */
    def openActionItem() {
        def model = actionItemReadOnlyCompositeService.openActionItem( params.actionItemId )
        render model as JSON
    }

    /**
     * List the groups
     * @return
     */
    def groupList() {
        def requestParams = request.JSON
        def paginationParams = [sortColumn: requestParams.sortColumn, sortAscending: requestParams.sortAscending, max: requestParams.max, offset: requestParams.offset]
        def results = groupFolderReadOnlyService.listGroupFolderPageSort( [name: requestParams.filterName], paginationParams )
        render results as JSON
    }

    /**
     *
     * @return
     */
    def actionItemStatusGridList() {

        def paramObj = [filterName   : params.searchString ?: "%",
                        sortColumn   : params.sortColumnName ?: "id",
                        sortAscending: params.ascending ? params.ascending.toBoolean() : false,
                        max          : params.max.toInteger(),
                        offset       : params.offset ? params.offset.toInteger() : 0]

        def results = actionItemStatusCompositeService.listActionItemsPageSort( paramObj )
        render results as JSON
    }

    /**
     *
     * @return
     */
    def actionItemStatusList() {
        def statuses = actionItemStatusService.listActionItemStatuses()
        render statuses as JSON
    }

    /**
     *
     * @return
     */
    def actionItemTemplateList() {
        def templates = actionItemTemplateService.listActionItemTemplates()
        render templates as JSON
    }

    /**
     *
     * @return
     */
    def updateActionItemDetailWithTemplate() {
        def jsonObj = request.JSON
        def actionItemId = jsonObj.actionItemId
        if (!actionItemId) {
            response.sendError( 403 )
            return
        }
        def model = actionItemCompositeService.updateActionItemDetailWithTemplate( jsonObj )
        render model as JSON
    }

    /**
     * Save Action Item Status
     * @return
     */
    def statusSave() {
        def model
        def map = request.JSON
        try {
            model = actionItemStatusCompositeService.statusSave( map );
        } catch (ApplicationException e) {
            model = [fail: true]
            LOGGER.error( e.getMessage() )
            model.success = false
            model.message = e.returnMap( {mapToLocalize -> new ValidationTagLib().message( mapToLocalize )} ).message
        }
        render model as JSON
    }

    /**
     * Delete Action Item Status
     * @return
     */
    def removeStatus() {
        def model
        try {
            model = actionItemStatusCompositeService.removeStatus( request.JSON.id );
        } catch (ApplicationException e) {
            model = [fail: true]
            LOGGER.error( e.getMessage() )
            model.message = e.returnMap( {mapToLocalize -> new ValidationTagLib().message( mapToLocalize )} ).message
        }
        render model as JSON
    }


    def actionItemStatusRule() {
        def actionItemStatusRules = actionItemStatusRuleReadOnlyService.listActionItemStatusRulesRO()
        render actionItemStatusRules as JSON
    }


    def actionItemStatusRuleById() {
        def id = params.id
        def actionItemStatusRuleRO = actionItemStatusRuleReadOnlyService.getActionItemStatusRuleROById( id )
        render actionItemStatusRuleRO as JSON
    }


    def actionItemStatusRulesByActionItemId() {
        def actionItemId = params.long( 'actionItemId' )
        def actionItemStatusRulesReadOnly = actionItemStatusRuleReadOnlyService.getActionItemStatusRulesROByActionItemId( actionItemId )
        render actionItemStatusRulesReadOnly as JSON
    }


    def updateActionItemStatusRule() {
        def jsonObj = request.JSON
        def model = actionItemStatusCompositeService.updateActionItemStatusRule( jsonObj )
        render model as JSON
    }


    def blockedProcessList() {
        def actionItemId = params.long( 'actionItemId' )
        def model = actionItemBlockedProcessCompositeService.getBlockedProcessForSpecifiedActionItem( actionItemId)
        render model as JSON
    }

    /**
     * AIP to assocate action item to process
     * @return
     */
    def updateBlockedProcessItems() {
        def model
        try {
            def paramMap = request.JSON
            model = actionItemBlockedProcessCompositeService.updateBlockedProcessItems( paramMap )
        } catch (ApplicationException ae) {
            ae.printStackTrace(  )
            model = [
                    success: false,
                    message: MessageHelper.message( ae.defaultMessage ),
            ]
        } catch (Exception e) {
            e.printStackTrace(  )
            model = [
                    success                 : false,
                    message                 : e.message,
                    actionItemBlockedProcess: ""
            ]
        }
        render model as JSON
    }

    /**
     * Gets Assigned Action Items In the Group
     * @param groupId
     * @return
     */
    def getAssignedActionItemInGroup() {
        def resultMap = actionItemGroupAssignReadOnlyService.getAssignedActionItemsInGroup( Long.parseLong( params.groupId ) )
        render resultMap as JSON
    }

    /**
     * get Action Items List for LOV
     * @return
     */
    def getActionItemsListForSelect() {
        def results = actionItemCompositeService.getActionItemsListForSelect()
        render results as JSON
    }

    /**
     * Update Action item Group Assignment
     * @return
     */
    def updateActionItemGroupAssignment() {
        def model = actionItemGroupCompositeService.updateActionItemGroupAssignment( request.JSON )
        render model as JSON
    }

    /**
     * Check If Action Item is Posted
     * @return
     */
    def checkActionItemPosted() {
        def model = [posted: actionItemService.checkActionItemPosted( Long.parseLong( params.actionItemId ) )]
        render model as JSON
    }

    /**
     * List Admin Group/Action Item Status
     * @return
     */
    def adminGroupStatus() {
        def model = actionItemProcessingCommonService.listStatus()
        render model as JSON
    }

    /**
     * Check actionItem Group already posted
     * @return
     */
    def groupPosted() {
        def model = [posted: actionItemGroupService.checkGroupPosted( Long.parseLong( params.groupId ) )]
        render model as JSON
    }

    /**
     * LOV information process , URL and Persona
     * @return
     */
    def loadBlockingProcessLov() {
        def result = blockingProcessCompositeService.loadBlockingProcessLov()
        render result as JSON
    }

}
