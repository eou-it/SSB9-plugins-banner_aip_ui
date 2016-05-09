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
        def success = false
        def errors = []
        /* //TODO: determine access in later US
        if (!hasAccess( 'save' )) {
            response.sendError( 403 )
            return
        }
        */
        def user = SecurityContextHolder?.context?.authentication?.principal
        def aipUser = AipControllerUtils.getPersonForAip(params, user.pidm)
        def jsonObj = request.JSON

        def group = new ActionItemGroup(
                title: jsonObj.groupTitle ? jsonObj.groupTitle : null,
                folderId: jsonObj.folderId ? jsonObj.folderId : null,
                description: jsonObj.groupDesc ? jsonObj.groupDesc: null,
                status: jsonObj.groupStatus ? jsonObj.groupStatus : null,
                version: jsonObj.version ? jsonObj.version : null,
                userId: aipUser.bannerId ? aipUser.bannerId : null,
                activityDate: new Date(),
                dataOrigin: "GRAILS"
        )

        def map
        def readOnlyGroup
        try {
            map = actionItemGroupService.create( [domainModel: group] )
            readOnlyGroup = groupFolderReadOnlyService.listActionItemGroupById( map.id )
            success = true
        } catch (ApplicationException ae) {
            // hasErrors()
            if (!group.validate()) {
                group.errors.allErrors.each {
                    errors.add( message( error: it ) )
                }
            }
        }
        // def groupId = actionItemGroupService.create( map ).id

        response.status = 200
        def model = [
                success : success,
                errors : errors,
                newGroup: readOnlyGroup
        ]

        render model as JSON

    }

}
