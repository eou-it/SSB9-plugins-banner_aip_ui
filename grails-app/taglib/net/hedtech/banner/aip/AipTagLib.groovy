/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import org.springframework.context.i18n.LocaleContextHolder

class AipTagLib {

    def resourceService


    def encodeHTML( msg ) {
        msg.replace( "\"", "&quot;" ).replace( "<", "&lt;" ).replace( ">", "&gt;" )
    }


    void addDependendNames( name, list ) {
        // After moving to submodule, the dependent resources where not picked for bundling the message properties
        // We are explicitly adding all the dependend modules to the list so that all the properties defined in the
        // JS file gets picked.
        list << name
        if (resourceService.getModule( name )?.dependsOn) {
            resourceService.getModule( name )?.dependsOn.each {
                addDependendNames( it, list )
            }
        }
    }

    def i18n_aip_setup = {attrs ->
        def map = [:]
        grailsApplication.mainContext.getBean( 'messageSource' ).getMergedProperties( LocaleContextHolder.getLocale() ).properties.each {key ->
            map.put key.key, key.value
        }
        out << "window.i18n_aip = ${map as JSON};\n"
    }

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
