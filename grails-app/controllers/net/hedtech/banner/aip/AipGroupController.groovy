package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.general.communication.folder.CommunicationFolder

class AipGroupController {

    static defaultAction = "folders"
    def communicationFolderService


    def folders() {
        def results = CommunicationFolder.list( sort: "name", order: "asc" )
        render results as JSON
    }


    def addFolder(name, description) {
        CommunicationFolder aFolder
        def map
        map = [id         : null,
               name       : name,
               description: description,
               internal   : false
        ]
        aFolder = communicationFolderService.create( map )
        render aFolder as JSON
    }
}
