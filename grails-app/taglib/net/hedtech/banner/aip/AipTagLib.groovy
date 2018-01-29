/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.i18n.DateAndDecimalUtils
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.web.servlet.support.RequestContextUtils


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

        Set keys = []
        grailsApplication.mainContext.getBean( 'messageSource' ).getMergedPluginProperties( LocaleContextHolder.getLocale() ).properties.each {key ->
            if (key.key.startsWith( "aip." )) {
                keys.add( key.key )
            }
        }

        out << 'window.i18n_aip = {'
        if (keys) {
            def javaScriptProperties = []
            keys.sort().each {
                String msg = "${g.message( code: it )}"
                // Assume the key was not found.  Look to see if it exists in the bundle
                if (msg == it) {
                    def value = DateAndDecimalUtils.properties( RequestContextUtils.getLocale( request ) )[it]
                    if (value) {
                        msg = value
                    }
                    println "missing property: " + it + ': ' + msg
                }
                if (msg && it != msg) {
                    msg = encodeHTML( msg )
                    javaScriptProperties << "\"$it\": \"$msg\""
                }
            }
            out << javaScriptProperties.join( "," )
        }
        out << '};\n'

        ///////////////////
        //TODO:: delete below test code
        /*
        def plugin = grailsApplication.mainContext.pluginManager.getGrailsPlugin( "banner-aip-ui" )
        def source = grailsApplication.mainContext.getBean('messageSource')

        out << 'window.i18n_aip_bundle = "'
        out << source.getPluginBundles(plugin).toString()
        out << '"\n'
        out << 'window.i18n_aip_bundle_plugins = "'
        out << source.getPluginBaseNames().toString()
        out << '"\n'

        out << "window.i18n_temp = ${map as JSON};\n"
        //////////////
        */
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
