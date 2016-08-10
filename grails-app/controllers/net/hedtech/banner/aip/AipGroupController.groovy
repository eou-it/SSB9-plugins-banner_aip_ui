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
    def actionItemReadOnlyService
    def gridNavigationService


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

        def group = actionItemGroupService.getActionItemGroupById( groupId )
        def groupRO = groupFolderReadOnlyService.getActionItemGroupById( groupId)


        if (group) {
            response.status = 200
            success = true
        }

        if (!group) {
            groupDesc = MessageUtility.message( "aip.placeholder.nogroups" )
        } else {
            groupDesc = group.description
        }

        def groupItem = [
                id             : group?.id,
                title          : group?.title,
                status         : group?.status,
                folder         : group?.folderId,
                userId         : group?.userId,
                description    : groupDesc,
                activity       : group?.activityDate,
                version        : group?.version,
                dataOrigin     : group?.dataOrigin
        ]



        def model = [
                success: success,
                errors : errors,
                group  : groupItem,
                folder : groupRO
        ]

        render model as JSON
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
            // flush=false. This is expected to fail and rollback under certain conditions
            map = actionItemGroupService.create( [domainModel: group], false )
            readOnlyGroup = groupFolderReadOnlyService.getActionItemGroupById( map.id )
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

    def actionItemList() {
        def results = actionItemReadOnlyService.listActionItemRO( )
        response.status = 200
        render results as JSON
    }


    def getGridData(){

        def offset = params.offset ? params.int('offset'): 0;
        //def offset = params.int('offset');
        def max = params.int('max');
        def searchString = params.searchString;
        def sortColumnName = params.sortColumnName

        def rows = actionItemList();

        if(params.searchString) {
            rows = rows.findAll { it.crn.toString().contains(searchString) }
        }

        if(params.sortColumnName != ""){
            if(params.ascending == "true") {
                rows = gridNavigationService.ascSort(rows, params);
            }
            else if(params.ascending == "false"){
                rows = gridNavigationService.descSort(rows, params);
            }
        }

        def length = rows.size();

        if(max > length){
            max = length-1;
        }

        if(offset >= 0 &&  max >0 ){
            rows = rows[offset..max-1];
        }

        def returnMap = [
                result: rows,
                length: length
        ]

        render returnMap as JSON

    }

}
