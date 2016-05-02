package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.MessageUtility
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.general.communication.folder.CommunicationFolder
import org.springframework.security.core.context.SecurityContextHolder

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
        def user = SecurityContextHolder?.context?.authentication?.principal
        def aipUser = AipControllerUtils.getPersonForAip(params, user.pidm)
        def jsonObj = request.JSON
        def errorFlag  = false
        def invalidField = []

        if (! jsonObj.groupTitle || ! jsonObj.folderId || ! jsonObj.groupStatus || ! aipUser.bannerId ) {
            errorFlag = true
        }

        if ( errorFlag )

        {
            if (! jsonObj.groupStatus ) {
                invalidField.add("group status")
            }
            if (! jsonObj.folderId ) {
                invalidField.add("folder")
            }
            if (! jsonObj.groupTitle) {
                invalidField.add("group title")
            }

            def model = [
                    success: false,
                    errorCode: 403,
                    invalidField: invalidField,
                    message: MessageUtility.message( "aip.admin.group.add.error.blank" )
            ]


            response.status = 403
            response.sendError( 403 )
            render model as JSON

            return

            //TODO: add handling for 500 error response here or elsewhere?
        }

        def group = new ActionItemGroup(
                title: jsonObj.groupTitle,
                folderId: jsonObj.folderId,
                description: jsonObj.groupDesc,
                status: jsonObj.groupStatus,
                version: jsonObj.version,
                userId: aipUser.bannerId,
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
