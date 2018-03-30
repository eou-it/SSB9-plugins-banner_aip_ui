/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON

class AipTagLib {
    def aipVersion = {attrs ->
        def plugin = grailsApplication.mainContext.pluginManager.getGrailsPlugin( "banner-aip-ui" )
        def map = [
                name          : plugin.getName(),
                version       : plugin.getVersion(),
                fileSystemName: plugin.getFileSystemName()
        ]
        out << "window.aipApp = ${map as JSON};\n"
    }
}
