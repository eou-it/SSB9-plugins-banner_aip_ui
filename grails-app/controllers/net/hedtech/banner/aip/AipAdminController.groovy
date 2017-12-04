/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.MessageUtility
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.i18n.MessageHelper
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib
import org.springframework.security.core.context.SecurityContextHolder

/**
 * Controller class for AIP Admin
 */
class AipAdminController {
    private static final def LOGGER = Logger.getLogger( this.class )
    static defaultAction = "folders"

    def groupFolderReadOnlyService

    def actionItemReadOnlyService

    def actionItemReadOnlyCompositeService

    def actionItemTemplateService

    def actionItemContentService

    def actionItemCompositeService

    def actionItemGroupCompositeService

    def actionItemStatusCompositeService

    def actionItemStatusService

    def actionItemStatusRuleService

    def actionItemStatusRuleReadOnlyService

    //def actionItemBlockedProcessService
    def actionItemProcessingCommonService
    def actionItemGroupAssignReadOnlyService

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
     * Provides group information for specified id
     * @return
     */
    def openGroup() {
        def success = false

        if (!request.JSON.groupId) {
            response.sendError( 403 )
            return
        }

        GroupFolderReadOnly gfro = groupFolderReadOnlyService.getActionItemGroupById( request.JSON.groupId )
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
    def createGroup() {
        def result = actionItemGroupCompositeService.createGroup( request.JSON )
        render result as JSON
    }


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


    def deleteActionItem() {
        def map = request.JSON
        def result = actionItemCompositeService.deleteActionItem( map.actionItemId )
        render result as JSON
    }


    def openActionItem() {
        def actionItemId = params.actionItemId
        if (!actionItemId) {
            response.sendError( 403 )
            return
        }
        def success = false
        def errors = []
        ActionItemReadOnly actionItem = actionItemReadOnlyService.getActionItemROById( actionItemId.toInteger() )
        if (actionItem) {
            success = true
        }
        def model = [
                success   : success,
                errors    : errors,
                actionItem: [
                        actionItemId           : actionItem?.actionItemId,
                        actionItemName         : actionItem?.actionItemName,
                        actionItemTitle        : actionItem?.actionItemTitle,
                        actionItemDesc         : actionItem?.actionItemDesc,
                        folderId               : actionItem?.folderId,
                        folderName             : actionItem?.folderName,
                        folderDesc             : actionItem?.folderDesc,
                        actionItemStatus       : actionItem ? MessageHelper.message( "aip.status.${actionItem.actionItemStatus}" ) : null,
                        actionItemActivityDate : actionItem?.actionItemActivityDate,
                        actionItemUserId       : actionItem?.actionItemUserId,
                        actionItemContentUserId: actionItem?.actionItemContentUserId,
                        actionItemCreatorId    : actionItem?.actionItemCreatorId,
                        actionItemCreateDate   : actionItem?.actionItemCreateDate,
                        actionItemCompositeDate: actionItem?.actionItemCompositeDate,
                        actionItemLastUserId   : actionItem?.actionItemLastUserId,
                        actionItemVersion      : actionItem?.actionItemVersion,
                        actionItemTemplateId   : actionItem?.actionItemTemplateId,
                        actionItemTemplateName : actionItem?.actionItemTemplateName,
                        actionItemPageName     : actionItem?.actionItemPageName,
                        actionItemContentId    : actionItem?.actionItemContentId,
                        actionItemContentDate  : actionItem?.actionItemContentDate,
                        actionItemContent      : actionItem?.actionItemContent
                ]
        ]
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


    def actionItemStatusGridList() {

        def paramObj = [filterName   : params.searchString ?: "%",
                        sortColumn   : params.sortColumnName ?: "id",
                        sortAscending: params.ascending ? params.ascending.toBoolean() : false,
                        max          : params.max.toInteger(),
                        offset       : params.offset ? params.offset.toInteger() : 0]

        def results = actionItemStatusCompositeService.listActionItemsPageSort( paramObj )
        render results as JSON
    }


    def actionItemStatusList() {
        def statuses = actionItemStatusService.listActionItemStatuses()
        render statuses as JSON
    }


    def actionItemTemplateList() {
        def templates = actionItemTemplateService.listActionItemTemplates()
        render templates as JSON
    }


    def editActionItemContent() {
        if (!params.actionItemId) {
            response.sendError( 403 )
            return
        }
        def actionItemContentId
        try {
            actionItemContentId = new Long( params.actionItemContentId )
        } catch (NumberFormatException e) {
            response.sendError( 403 )
            return
        }

        try {

            def actionItemText = params.actionItemContent?.toString()

            actionItemContentService.updateTemplateContent( actionItemContentId, actionItemText )

            def model = [
                    success: true
            ]
            render model as JSON
        } catch (ApplicationException ae) {
            // UI doesn't do anything with error messages from here, just 403 it
            response.sendError( 403 )
            return
        }
    }


    def updateActionItemDetailWithTemplate() {
        def jsonObj = request.JSON
        def templateId = jsonObj.templateId.toInteger()
        def actionItemId = jsonObj.actionItemId.toInteger()
        def actionItemDetailText = jsonObj.actionItemContent
        def user = SecurityContextHolder?.context?.authentication?.principal
        if (!user.pidm) {
            response.sendError( 403 )
            return
        }
        if (!actionItemId) {
            response.sendError( 403 )
            return
        }

        ActionItemContent aic = actionItemContentService.listActionItemContentById( actionItemId )
        if (!aic) {
            aic = new ActionItemContent()
        }
        aic.actionItemId = actionItemId
        aic.actionItemTemplateId = templateId
        aic.text = actionItemDetailText

        ActionItemContent newAic = actionItemContentService.createOrUpdate( aic )

        def success = false
        def errors = []
//        ActionItemContent newActionItemDetail = actionItemDetailService.listActionItemContentById(actionItemId)

        //todo: add new method to service for action item detail to retreive an action item by detail id and action item id
        ActionItemReadOnly actionItemRO = actionItemReadOnlyService.getActionItemROById( newAic.actionItemId )
        if (newAic) {
            success = true
        }

        def model = [
                success   : success,
                errors    : errors,
                actionItem: actionItemRO,
        ]

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

        def user = SecurityContextHolder?.context?.authentication?.principal
        if (!user.pidm) {
            response.sendError( 403 )
            return
        }
        def success = false
        def message

        def inputRules = jsonObj.rules

        List<ActionItemStatusRule> currentRules = actionItemStatusRuleService.getActionItemStatusRuleByActionItemId( jsonObj.actionItemId )

        List<Long> newRuleIdList = inputRules.statusRuleId.toList()
        List<Long> existingRuleIdList = currentRules.id.toList()

        def deleteRules = existingRuleIdList.minus( newRuleIdList )

        //delete those that have been removed
        actionItemStatusRuleService.delete( deleteRules )

        //create or update rules
        try {
            List<ActionItemStatusRule> ruleList = []
            inputRules.each {rule ->
                def statusRule
                def statusId

                if (rule.status.id) {
                    statusId = rule.status.id

                } else if (rule.status.actionItemStatusId) {
                    statusId = rule.status.actionItemStatusId
                } else {
                    message = MessageUtility.message( "actionItemStatusRule.statusId.nullable.error" )
                    throw new ApplicationException( message )
                }

                if (rule.statusRuleId) {
                    statusRule = ActionItemStatusRule.get( rule.statusRuleId )
                    statusRule.seqOrder = rule.statusRuleSeqOrder.toInteger()
                    statusRule.labelText = rule.statusRuleLabelText
                    statusRule.actionItemStatusId = statusId
                    statusRule.actionItemId = jsonObj.actionItemId
                    //TODO: future user story
                    //statusRule.resbumitInd =  rule.resubmitInd
                    //statusRule.userId = aipUser.bannerId
                    // statusRule.activityDate = new Date()
                    statusRule.version = rule.status.version
                } else {
                    statusRule = new ActionItemStatusRule(
                            seqOrder: rule.statusRuleSeqOrder,
                            labelText: rule.statusRuleLabelText,
                            actionItemId: jsonObj.actionItemId,
                            actionItemStatusId: statusId
                            /*
                            resubmitInd: 'N',
                            userId: aipUser.bannerId,
                            activityDate: new Date(),
                            version: 0,
                            dataOrigin: 'GRAILS'
                            */
                    )
                }
                ruleList.push( statusRule )
            }

            ruleList.each {rule ->
                actionItemStatusRuleService.createOrUpdate( rule ) //list of domain objects to be updated or created
            }

            success = true

        } catch (ApplicationException e) {
            LOGGER.error( e.getMessage() )
        }

        List<ActionItemStatusRule> updatedActionItemStatusRules =
                actionItemStatusRuleService.getActionItemStatusRuleByActionItemId( jsonObj.actionItemId )


        def model = [
                success: success,
                message: message,
                rules  : updatedActionItemStatusRules
        ]

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


    def getAssignedActionItemInGroup() {
        Long groupId = Long.parseLong( params.groupId )
        def assignedActionItems = actionItemGroupAssignReadOnlyService.getAssignedActionItemsInGroup( groupId )
        def resultMap = assignedActionItems?.collect {it ->
            [
                    id                   : it.id,
                    actionItemId         : it.actionItemId,
                    sequenceNumber       : it.sequenceNumber,
                    actionItemName       : it.actionItemName,
                    actionItemStatus     : it.actionItemStatus ? MessageHelper.message( "aip.status.${it.actionItemStatus.trim()}" ) : null,
                    actionItemFolderName : it.actionItemFolderName,
                    actionItemTitle      : it.actionItemTitle,
                    actionItemDescription: it.actionItemDescription,
                    actionItemFolderId   : it.actionItemFolderId
            ]
        }
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
     * List Admin Group/Action Item Status
     * @return
     */
    def adminGroupStatus() {
        def model = actionItemProcessingCommonService.listStatus()
        render model as JSON
    }
}
