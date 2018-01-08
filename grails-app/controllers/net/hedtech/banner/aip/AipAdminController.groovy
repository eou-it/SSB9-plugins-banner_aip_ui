/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.aip.common.AipTimezone
import net.hedtech.banner.exceptions.ApplicationException
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib

/**
 * Controller class for AIP Admin
 */
class AipAdminController {
    private static final def LOGGER = Logger.getLogger( this.class )
    static defaultAction = "landing"

    def groupFolderReadOnlyService

    def actionItemReadOnlyCompositeService

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

        GroupFolderReadOnly gfro = groupFolderReadOnlyService.getActionItemGroupById( Long.parseLong(params.groupId) )
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
        try {
            model = actionItemStatusCompositeService.statusSave( request.JSON.title );
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
        def actionItemStatusRuleReadOnlies = actionItemStatusRuleReadOnlyService.getActionItemStatusRulesROByActionItemId( actionItemId )
        render actionItemStatusRuleReadOnlies as JSON
    }


    def updateActionItemStatusRule() {
        def jsonObj = request.JSON
        def model = actionItemStatusCompositeService.updateActionItemStatusRule( jsonObj )
        render model as JSON
    }

    /*def blockedProcessList() {//TODO Enable this and impleted as per requirement

        def success = false
        def message = ""
        def blockedList = []
        def jsonSlurper = new JsonSlurper()
        if (!params.actionItemId) {
            //rerun all as list
            try {
                def tempBlockedList = actionItemBlockedProcessService.listBlockedProcessesByType()
                tempBlockedList.each {item ->
                    def value = jsonSlurper.parseText( item.value.replaceAll( "[\n\r]", "" ) )
                    def block = [
//                            id: item.id,
name : item.name,
value: value.aipBlock
                    ]
                    blockedList.push( block )
                }
                success = true
            } catch (Exception e) {
                LOGGER.error( e.getMessage() )
            }
        } else {
            def actionItemId = params.actionItemId
            try {
                def tempBlockedList = actionItemBlockedProcessService.listBlockedProcessByActionItemId( Long.parseLong( actionItemId ) )
                tempBlockedList.each {item ->
                    def configurationData = actionItemBlockedProcessService.listBlockedProcessesByNameAndType( item.blockConfigName )
//                    def value = jsonSlurper.parseText(item.value.replaceAll("[\n\r]",""))
                    def block = [
                            id   : item.blockId,
                            name : item.blockConfigName,
                            value: configurationData
                    ]
                    blockedList.push( block )
                }

                success = true
            } catch (Exception e) {
                LOGGER.error( e.getMessage() )
            }
        }
        def model = [
                success         : success,
                message         : message,
                blockedProcesses: blockedList
        ]
        render model as JSON
    }*/

    /*def updateBlockedProcessItems() {//TODO Enable this and impleted as per requirement
        def jsonObj = request.JSON

        def user = SecurityContextHolder?.context?.authentication?.principal
        if (!user.pidm) {
            response.sendError( 403 )
            return
        }
        def aipUser = AipControllerUtils.getPersonForAip( params, user.pidm )
        def actionItemId = new Long( jsonObj.actionItemId )
        def blockItems = jsonObj.blockItems

        def success = false
        def message
        def model
        try {
            def actionItemBlockedProcess = actionItemCompositeService.updateBlockedProcess( aipUser, actionItemId, blockItems )
            if (actionItemBlockedProcess) {
                success = true
            }
            model = [
                    success                 : success,
                    message                 : message,
                    actionItemBlockedProcess: actionItemBlockedProcess
            ]
        } catch (ApplicationException ae) {
            model = [
                    success                 : success,
                    message                 : MessageUtility.message( ae.getDefaultMessate() ),
                    actionItemBlockedProcess: ""
            ]
        } catch (Exception e) {
            model = [
                    success                 : success,
                    message                 : message,
                    actionItemBlockedProcess: ""
            ]
        }

        render model as JSON

    }*/

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
}
