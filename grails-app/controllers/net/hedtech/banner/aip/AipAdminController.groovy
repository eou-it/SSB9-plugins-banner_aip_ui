/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON
import groovy.json.JsonSlurper
import net.hedtech.banner.MessageUtility
import net.hedtech.banner.aip.common.AIPConstants
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.general.communication.folder.CommunicationFolder
import net.hedtech.banner.i18n.MessageHelper
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib
import org.springframework.security.core.context.SecurityContextHolder

import java.text.MessageFormat

/**
 * Controller class for AIP Admin
 */
class AipAdminController {
    private static final def LOGGER = Logger.getLogger( this.class )
    static defaultAction = "folders"

    def communicationFolderService

    def groupFolderReadOnlyService

    def actionItemGroupService

    def actionItemReadOnlyService

    def actionItemTemplateService

    def actionItemContentService

    def actionItemCompositeService

    def actionItemStatusCompositeService

    def actionItemStatusService

    def actionItemStatusRuleService

    def actionItemStatusRuleReadOnlyService

    def actionItemBlockedProcessService


    def folders() {
        def results = CommunicationFolder.list( sort: "name", order: "asc" )
        response.status = 200
        render results as JSON
    }


    def addFolder( name, description ) {

        CommunicationFolder aFolder
        def map
        def success = false
        def message
        map = [id         : null,
               name       : name,
               description: description,
               internal   : false
        ]
        try {
            aFolder = communicationFolderService.create( map )
            response.status = 200
            success = true
        } catch (ApplicationException e) {
            log.error( e )
            if ("@@r1:operation.not.authorized@@".equals( e.getMessage() )) {
                message = MessageUtility.message( "aip.operation.not.permitted" )
            }
        }
        def result = [
                success  : success,
                message  : message,
                newFolder: aFolder
        ]
        render result as JSON
    }

    /**
     * Add Action Item
     * @return
     */
    def addActionItem() {
        def map = [:]
        map = request.JSON
        map.studentId = params.studentId
        def result = actionItemCompositeService.addActionItem( map )
        render result as JSON
    }


    def openGroup() {
        /* //TODO: determine access in later US
        if (!hasAccess( 'read' )) {
            response.sendError( 403 )
            return
        }
        */
        def jsonObj = request.JSON;
        def groupId = jsonObj.groupId;
        def groupDesc;

        if (!groupId) {
            response.sendError( 403 )
            return
        }

        def success = false
        def errors = []

        //def group = actionItemGroupService.getActionItemGroupById( groupId )
        def groupRO = groupFolderReadOnlyService.getActionItemGroupById( groupId )


        if (groupRO) {
            response.status = 200
            success = true
        }

        if (!groupRO) {
            groupDesc = MessageUtility.message( "aip.placeholder.nogroups" )
        } else {
            groupDesc = groupRO.groupDesc[0]
        }

        def groupItem = [
                groupId          : groupRO.groupId[0],
                groupTitle       : groupRO.groupTitle[0],
                groupName        : groupRO.groupName[0],
                groupStatus      : MessageHelper.message( "aip.status.${groupRO.groupStatus[0]}" ),
                folderId         : groupRO.folderId[0],
                folderName       : groupRO.folderName[0],
                folderDesc       : groupRO.folderDesc[0],
                groupUserId      : groupRO.groupUserId[0],
                groupDesc        : groupDesc,
                groupActivityDate: groupRO.groupActivityDate[0],
                groupVersion     : groupRO.groupVersion[0]
                //dataOrigin     : groupRO?.groupDataOrigin
        ]



        def model = [
                success: success,
                errors : errors,
                group  : groupItem
                //folder : groupRO
        ]

        render model as JSON
    }


    def createGroup() {
        def success = false
        def message
        /* //TODO: determine access in later US
        if (!hasAccess( 'save' )) {
            response.sendError( 403 )
            return
        }
        */
        def user = SecurityContextHolder?.context?.authentication?.principal
        def aipUser = AipControllerUtils.getPersonForAip( params, user.pidm )
        def jsonObj = request.JSON

        def group = new ActionItemGroup(
                title: jsonObj.groupTitle ?: null,
                name: jsonObj.groupName ?: null,
                folderId: jsonObj.folderId ?: null,
                description: jsonObj.groupDesc ?: null,
                postingInd:'N',
                status: AIPConstants.STATUS_MAP.get( jsonObj.groupStatus) ?: null,
                version: jsonObj.version ?: null,
                userId: aipUser.bannerId ?: null,
                activityDate: new Date(),
                dataOrigin: "GRAILS"
        )

        def groupNew
        def groupRO
        def groupItem
        def groupDesc
        try {
            groupNew = actionItemGroupService.create( group )

            response.status = 200
            success = true
            groupRO = groupFolderReadOnlyService.getActionItemGroupById( groupNew.id.toInteger() )


            if (!groupRO) {
                groupDesc = MessageUtility.message( "aip.placeholder.nogroups" )
            } else {
                groupDesc = groupRO.groupDesc[0]
            }

            groupItem = [
                    groupId          : groupRO.groupId[0],
                    groupTitle       : groupRO.groupTitle[0],
                    groupName        : groupRO.groupName[0],
                    groupStatus      : MessageHelper.message( "aip.status.${groupRO.groupStatus[0]}" ),
                    folderId         : groupRO.folderId[0],
                    folderName       : groupRO.folderName[0],
                    folderDesc       : groupRO.folderDesc[0],
                    groupUserId      : groupRO.groupUserId[0],
                    groupDesc        : groupDesc,
                    groupActivityDate: groupRO.groupActivityDate[0],
                    groupVersion     : groupRO.groupVersion[0]
            ]


        } catch (ApplicationException e) {
            if (ActionItemGroupService.FOLDER_VALIDATION_ERROR.equals( e.getMessage() )) {
                message = MessageUtility.message( e.getDefaultMessage(), MessageFormat.format( "{0,number,#}", jsonObj.folderId ) )
            } else {
                message = MessageUtility.message( e.getDefaultMessage() )
            }
        }

        // response.status = 200

        def model = [
                success: success,
                message: message,
                group  : groupItem
        ]

        render model as JSON
    }


    def actionItemList() {

        def paramObj = [filterName   : params.searchString ?: "%",
                        sortColumn   : params.sortColumnName ?: "id",
                        sortAscending: params.ascending ? params.ascending.toBoolean() : false,
                        max          : params.max.toInteger(),
                        offset       : params.offset ? params.offset.toInteger() : 0]
        def results = actionItemReadOnlyService.listActionItemsPageSort( paramObj )
        render results as JSON
    }


    def openActionItem() {
        /* //TODO: determine access in later US
        if (!hasAccess( 'read' )) {
            response.sendError( 403 )
            return
        }
        */
        def actionItemId = params.actionItemId;

        if (!actionItemId) {
            response.sendError( 403 )
            return
        }

        def success = false
        def errors = []

        ActionItemReadOnly actionItem = actionItemReadOnlyService.getActionItemROById( actionItemId.toInteger() )

        if (actionItem) {
            response.status = 200
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
                        actionItemPostedStatus : actionItem?.actionItemPostedStatus,
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


    def groupList() {

        def jsonObj = request.JSON
        def params = [filterName   : jsonObj.filterName,
                      sortColumn   : jsonObj.sortColumn,
                      sortAscending: jsonObj.sortAscending,
                      max          : jsonObj.max,
                      offset       : jsonObj.offset]

        def results = groupFolderReadOnlyService.listGroupFolderPageSort( params )
        response.status = 200

        def groupHeadings = [
                [name: "groupId", title: "id", options: [visible: false, isSortable: true]],
                [name: "groupName", title: MessageUtility.message( "aip.common.group.name" ), options: [visible: true, isSortable: true, ascending: jsonObj.sortAscending], width: 0],
                [name: "groupTitle", title: MessageUtility.message( "aip.common.group.title" ), options: [visible: true, isSortable: true, ascending: jsonObj.sortAscending], width: 0],
                [name: "groupStatus", title: MessageUtility.message( "aip.common.status" ), options: [visible: true, isSortable: true, ascending: jsonObj.sortAscending], width: 0],
                [name: "folderName", title: MessageUtility.message( "aip.common.folder" ), options: [visible: true, isSortable: true, ascending: jsonObj.sortAscending], width: 0],
                [name: "groupActivityDate", title: MessageUtility.message( "aip.common.activity.date" ), options: [visible: true, isSortable: true, ascending: jsonObj.sortAscending], width: 0],
                [name: "groupUserId", title: MessageUtility.message( "aip.common.last.updated.by" ), options: [visible: true, isSortable: true, ascending: jsonObj.sortAscending], width: 0]
        ]

        results.header = groupHeadings

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
            response.status = 200

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

        def aipUser = AipControllerUtils.getPersonForAip( params, user.pidm )
        ActionItemContent aic = actionItemContentService.listActionItemContentById( actionItemId )
        aic.actionItemId = actionItemId
        aic.actionItemTemplateId = templateId
        aic.lastModifiedby = aipUser.bannerId
        aic.lastModified = new Date()
        aic.text = actionItemDetailText

        ActionItemContent newAic = actionItemContentService.createOrUpdate( aic )

        def success = false
        def errors = []
//        ActionItemContent newActionItemDetail = actionItemDetailService.listActionItemContentById(actionItemId)

        //todo: add new method to service for action item detail to retreive an action item by detail id and action item id
        ActionItemReadOnly actionItemRO = actionItemReadOnlyService.getActionItemROById( newAic.actionItemId )
        if (newAic) {
            response.status = 200
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
        List<Long> tempRuleIdList = inputRules.statusRuleId.toList()
        def aipUser = AipControllerUtils.getPersonForAip( params, user.pidm )
        List<ActionItemStatusRule> actionItemStatusRules = actionItemStatusRuleService.getActionItemStatusRuleByActionItemId( jsonObj.actionItemId )
        def existingRuleId = actionItemStatusRules.id
        def deleteRules = existingRuleId - tempRuleIdList

        try {
            //update&create
            List<ActionItemStatusRule> ruleList = []
            inputRules.each {rule ->
                def statusRule
                if (rule.statusRuleId) {
                    statusRule = ActionItemStatusRule.get( rule.statusRuleId )
                    statusRule.seqOrder = rule.statusRuleSeqOrder
                    statusRule.labelText = rule.statusRuleLabelText
                    statusRule.actionItemStatusId = rule.statusId
                    statusRule.actionItemId = jsonObj.actionItemId
                    statusRule.userId = aipUser.bannerId
                    statusRule.activityDate = new Date()
                } else {
                    statusRule = new ActionItemStatusRule(
                            seqOrder: rule.statusRuleSeqOrder,
                            labelText: rule.statusRuleLabelText,
                            actionItemId: jsonObj.actionItemId,
                            actionItemStatusId: rule.statusId,
                            userId: aipUser.bannerId,
                            activityDate: new Date()
                    )
                }
                ruleList.push( statusRule )
            }
            //delete
            actionItemStatusRuleService.delete( deleteRules ) //list of ids to be deleted

            actionItemStatusRuleService.createOrUpdate( ruleList ) //list of domain objects to be updated or created

            response.status = 200
            success = true

        } catch (ApplicationException e) {
            println e.defaultMessage
            //fixme: add more detailed exception catch and handle correctly
            message = "Something happened"
        }

        List<ActionItemStatusRule> updatedActionItemStatusRules = actionItemStatusRuleService.getActionItemStatusRuleByActionItemId( jsonObj.actionItemId )
        def model = [
                success: success,
                message: message,
                rules  : updatedActionItemStatusRules
        ]

        render model as JSON

    }


    def updateActionItemDetailsAndStatusRules() {
        def jsonObj = request.JSON

        def user = SecurityContextHolder?.context?.authentication?.principal
        if (!user.pidm) {
            response.sendError( 403 )
            return
        }
        def aipUser = AipControllerUtils.getPersonForAip( params, user.pidm )
        def inputRules = jsonObj.rules
        def templateId = jsonObj.templateId.toInteger()
        def actionItemId = jsonObj.actionItemId.toInteger()
        def actionItemDetailText = jsonObj.actionItemContent

        def message
        def success = false
        def model
        try {
            Map actionItemInfo = actionItemCompositeService.updateDetailsAndStatusRules( aipUser, inputRules, templateId, actionItemId,
                                                                                         actionItemDetailText )

            if (actionItemInfo['actionItemRO'] && actionItemInfo['statusRules']) {
                success = true
            }
            model = [
                    success   : success,
                    message   : message,
                    actionItem: actionItemInfo['actionItemRO'],
                    rules     : actionItemInfo['statusRules']
            ]
        } catch (ApplicationException ae) {
            model = [
                    success   : success,
                    message   : MessageUtility.message( ae.getDefaultMessage() ),
                    actionItem: "",
                    rules     : ""
            ]
        } catch (Exception e) {
            model = [
                    success   : success,
                    message   : message,
                    actionItem: "",
                    rules     : ""
            ]
        }
        render model as JSON
    }


    def blockedProcessList() {

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
                response.status = 200
                success = true
            } catch (Exception e) {
                println e.defaultMessage
                //fixme: this needs to be set to point to default message. wasn't finding it so used status unique until we have time to debug.
                message = MessageUtility.message( "Something happened" )
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

                response.status = 200
                success = true
            } catch (Exception e) {
                println e.defaultMessage
                //fixme: this needs to be set to point to default message. wasn't finding it so used status unique until we have time to debug.
                message = MessageUtility.message( "Something happened" )
            }
        }
        def model = [
                success         : success,
                message         : message,
                blockedProcesses: blockedList
        ]
        render model as JSON
    }


    def updateBlockedProcessItems() {
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
            Map actionItemBlockedProcess = actionItemCompositeService.updateBlockedProcess( aipUser, actionItemId, blockItems )
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

    }
}
