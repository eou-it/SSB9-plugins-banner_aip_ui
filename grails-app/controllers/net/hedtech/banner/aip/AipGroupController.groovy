package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.MessageUtility
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.general.communication.folder.CommunicationFolder

class AipGroupController {

    static defaultAction = "folders"
    def communicationFolderService
    def groupFolderReadOnlyService
    def actionItemGroupService


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


    def createGroup() {

        /* //TODO: determine access in later US
        if (!hasAccess( 'save' )) {
            response.sendError( 403 )
            return
        }
        */

        if (! params.groupTitle || ! params.folderId || ! params.groupStatus || ! params.userId )
        {
            response.sendError( 403 )
            return
        }

        def group = new ActionItemGroup(
                title: params.groupTitle,
                folderId: params.folderId,
                description: params.groupDesc,
                status: params.groupStatus,
                version: params.version,
                userId: params.userId,
                activityDate: new Date(),
                dataOrigin: "GRAILS"
        )

        def map = actionItemGroupService.create([domainModel: group])
        // def groupId = actionItemGroupService.create( map ).id

        // FIXME: tests for properly handling failed saves

        def readOnlyGroup = groupFolderReadOnlyService.listActionItemGroupById( map.id )

        response.status = 200
        def model = [
                success: true,
                newGroup: readOnlyGroup
        ]

        render model as JSON

    }

}
