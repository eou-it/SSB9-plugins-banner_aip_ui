package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.MessageUtility
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.general.communication.folder.CommunicationFolder
import org.springframework.security.core.context.SecurityContextHolder

import java.text.MessageFormat


class AipAdminController {

    static defaultAction = "folders"

    def communicationFolderService

    def groupFolderReadOnlyService

    def actionItemGroupService

    def actionItemReadOnlyService

    def actionItemService

    def actionItemTemplateService

    def actionItemDetailService

    def actionItemCompositeService

    def actionItemStatusService

    def actionItemStatusRuleService

    def actionItemStatusRuleReadOnlyService


    def folders() {
        def results = CommunicationFolder.list( sort: "name", order: "asc" )
        response.status = 200
        render results as JSON
    }


    def adminActionItemStatus() {
        //TODO:: get action item status from DB through service
        def model = [
                [
                        "id"   : 0,
                        "value": "Pending"
                ], [
                        "id"   : 1,
                        "value": "Active"
                ], [
                        "id"   : 2,
                        "value": "Inactive"
                ]
        ]
        render model as JSON
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


    def addActionItem() {
        def user = SecurityContextHolder?.context?.authentication?.principal
        if (!user.pidm) {
            response.sendError( 403 )
            return
        }
        /* TODO: determine access in later US
        if (!hasAccess( 'save' )) {
            response.sendError( 403 )
            return
        }
        */
        ActionItem aActionItem
        def success = false
        def message


        def aipUser = AipControllerUtils.getPersonForAip( params, user.pidm )
        def jsonObj = request.JSON

        ActionItem ai = new ActionItem()
        ai.folderId = jsonObj.folderId ? jsonObj.folderId : null
        ai.status = jsonObj.status ? jsonObj.status : null
        ai.title = jsonObj.title ? jsonObj.title : null
        ai.creatorId = aipUser.bannerId ? aipUser.bannerId : null
        ai.userId = aipUser.bannerId ? aipUser.bannerId : null
        ai.description = jsonObj.description ? jsonObj.description : null
        ai.activityDate = new Date()

        try {
            aActionItem = actionItemService.create( ai )
            response.status = 200
            success = true
        } catch (ApplicationException e) {
            if (ActionItemService.FOLDER_VALIDATION_ERROR.equals( e.getMessage() )) {
                message = MessageUtility.message( e.getDefaultMessage(), MessageFormat.format( "{0,number,#}", ai.folderId ) )
            } else {
                message = MessageUtility.message( e.getDefaultMessage() )
            }
        }
        def result = [
                success      : success,
                message      : message,
                newActionItem: aActionItem
        ]
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
                groupId          : groupRO?.groupId[0],
                groupTitle       : groupRO?.groupTitle[0],
                groupStatus      : groupRO?.groupStatus[0],
                folderId         : groupRO?.folderId[0],
                folderName       : groupRO?.folderName[0],
                folderDesc       : groupRO?.folderDesc[0],
                groupUserId      : groupRO?.groupUserId[0],
                groupDesc        : groupDesc,
                groupActivityDate: groupRO?.groupActivityDate[0],
                groupVersion     : groupRO?.groupVersion[0]
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
                title: jsonObj.groupTitle ? jsonObj.groupTitle : null,
                folderId: jsonObj.folderId ? jsonObj.folderId : null,
                description: jsonObj.groupDesc ? jsonObj.groupDesc : null,
                status: jsonObj.groupStatus ? jsonObj.groupStatus : null,
                version: jsonObj.version ? jsonObj.version : null,
                userId: aipUser.bannerId ? aipUser.bannerId : null,
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
                    groupId          : groupRO?.groupId[0],
                    groupTitle       : groupRO?.groupTitle[0],
                    groupStatus      : groupRO?.groupStatus[0],
                    folderId         : groupRO?.folderId[0],
                    folderName       : groupRO?.folderName[0],
                    folderDesc       : groupRO?.folderDesc[0],
                    groupUserId      : groupRO?.groupUserId[0],
                    groupDesc        : groupDesc,
                    groupActivityDate: groupRO?.groupActivityDate[0],
                    groupVersion     : groupRO?.groupVersion[0]
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
        response.status = 200

        def actionItemHeadings = [
                [name: "actionItemId", title: "id", options: [visible: false, isSortable: true]],
                [name: "actionItemName", title: MessageUtility.message( "aip.common.title" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0],
                [name: "actionItemStatus", title: MessageUtility.message( "aip.common.status" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0],
                [name: "folderName", title: MessageUtility.message( "aip.common.folder" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0],
                [name: "actionItemActivityDate", title: MessageUtility.message( "aip.common.activity.date" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0],
                [name: "actionItemLastUserId", title: MessageUtility.message( "aip.common.last.updated.by" ), options: [visible: true, isSortable:
                        true, ascending                                                                                        : paramObj.sortAscending], width: 0]
        ]

        results.header = actionItemHeadings

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

        def actionItem = actionItemReadOnlyService.getActionItemROById( actionItemId.toInteger() )

        if (actionItem) {
            response.status = 200
            success = true
        }

        def model = [
                success   : success,
                errors    : errors,
                actionItem: actionItem
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
                [name: "groupTitle", title: MessageUtility.message( "aip.common.title" ), options: [visible: true, isSortable: true, ascending: jsonObj.sortAscending], width: 0],
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

        def results = actionItemStatusService.listActionItemsPageSort( paramObj )
        response.status = 200

        def actionItemStatusHeadings = [
                [name: "actionItemStatusId", title: "id", options: [visible: false, isSortable: true]],
                [name: "actionItemStatus", title: MessageUtility.message( "aip.common.status" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0],
                [name: "actionItemBlockedProcess", title: MessageUtility.message( "aip.common.block.process" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0],
                [name: "actionItemSystemRequired", title: MessageUtility.message( "aip.common.system.required" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0],
                [name: "actionItemStatusUserId", title: MessageUtility.message( "aip.common.last.updated.by" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0],
                [name: "actionItemStatusActivityDate", title: MessageUtility.message( "aip.common.activity.date" ), options: [visible: true, isSortable: true, ascending: paramObj.sortAscending], width: 0]
        ]

        results.header = actionItemStatusHeadings

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

            actionItemDetailService.updateTemplateContent( actionItemContentId, actionItemText )
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
        ActionItemDetail aid = actionItemDetailService.listActionItemDetailById( actionItemId )
        aid.actionItemId = actionItemId
        aid.actionItemTemplateId = templateId
        aid.lastModifiedby = aipUser.bannerId
        aid.lastModified = new Date()
        aid.text = actionItemDetailText

        ActionItemDetail newAid = actionItemDetailService.createOrUpdate( aid )

        def success = false
        def errors = []
//        ActionItemDetail newActionItemDetail = actionItemDetailService.listActionItemDetailById(actionItemId)

        //todo: add new method to service for action item detail to retreive an action item by detail id and action item id
        ActionItemReadOnly actionItemRO = actionItemReadOnlyService.getActionItemROById( newAid.actionItemId )
        if (newAid) {
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


    def statusSave() {
        def jsonObj = request.JSON
        def statusTitle = jsonObj.title
        def isBlock = jsonObj.block
        def user = SecurityContextHolder?.context?.authentication?.principal
        if (!user.pidm) {
            response.sendError( 403 )
            return
        }
        def aipUser = AipControllerUtils.getPersonForAip( params, user.pidm )

        ActionItemStatus status = new ActionItemStatus()

        status.actionItemStatus = statusTitle
        status.actionItemStatusActive = "Y"
        status.actionItemStatusBlockedProcess = isBlock ? "Y" : "N"
        status.actionItemStatusActivityDate = new Date()
        status.actionItemStatusUserId = aipUser.bannerId
        status.actionItemStatusSystemRequired = "N"
        status.actionItemStatusVersion = null
        status.actionItemStatusDataOrigin = null

        ActionItemStatus newStatus
        def success = false
        def message

        try {
            newStatus = actionItemStatusService.create( status );
            response.status = 200
            success = true
        } catch (ApplicationException e) {
            println e.defaultMessage
            //fixme: this needs to be set to point to default message. wasn't finding it so used status unique until we have time to debug.
            message = MessageUtility.message( "actionItemStatus.status.unique" )
        }


        def model = [
                success: success,
                message: message,
                status : newStatus
        ]
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
        def actionItemId = params.long('actionItemId')
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
            inputRules.each { rule ->
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
}