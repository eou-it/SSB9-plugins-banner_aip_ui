package net.hedtech.banner.csr

import grails.converters.JSON
import net.hedtech.banner.i18n.DateAndDecimalUtils
import org.springframework.web.servlet.support.RequestContextUtils
import org.springframework.context.i18n.LocaleContextHolder

class CsrTagLib {
    static LOCALE_KEYS_ATTRIBUTE = "localeKeys"

    def resourceService


    def encodeHTML( msg ) {
        msg.replace( "\"", "&quot;" ).replace( "<", "&lt;" ).replace( ">", "&gt;" )
    }


    private def resourceModuleNames( request ) {
        def names = []

        if (request.resourceDependencyTracker != null) {
            // resources plugin <= 1.0.2
            request.resourceDependencyTracker.each {
                addDependendNames( it, names )
            }
        } else if (request.resourceModuleTracker != null) {
            // resources plugin >= 1.0.3
            request.resourceModuleTracker.each {
                if (it.value) { // todo what does 'false' for this property mean? validate usage
                    addDependendNames( it.key, names )
                }
            }
        }

        names
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

    def i18n_aip_setup = { attrs ->
        def names = resourceModuleNames( request )
        Set keys = []

        if (names.size() > 0) {
            // Search for any place where we are referencing message codes
            def regex = ~/\(*\.i18n.prop\(.*?[\'\"](.*?)[\'\"].*?\)/
            names.each { name ->
                if (name.equals( "bannerAIPApp" )) {
                    resourceService.getModule( name )?.resources?.findAll { it.sourceUrlExtension == "js" }?.each {
                        if (!it.attributes.containsKey( LOCALE_KEYS_ATTRIBUTE )) {
                            it.attributes[LOCALE_KEYS_ATTRIBUTE] = new HashSet()
                            if (it.processedFile) {
                                def fileText
                                // Check to see if the file has been zipped.  This only occurs in the Environment.DEVELOPMENT
                                // If it occurs, we'll create a reference to the original file and parse it instead.
                                if (it.processedFile.path.endsWith( ".gz" )) {
                                    def originalFile = new File( "${it.workDir}${it.sourceUrl}" )
                                    if (originalFile.exists()) {
                                        fileText = originalFile.text
                                    } else {
                                        fileText = ""
                                    }
                                } else {
                                    fileText = it.processedFile.text
                                }
                                def matcher = regex.matcher( fileText )
                                while (matcher.find()) {
                                    it.attributes[LOCALE_KEYS_ATTRIBUTE] << matcher.group( 1 )
                                }
                            }
                        }
                        keys.addAll( it.attributes[LOCALE_KEYS_ATTRIBUTE] )
                    }
                }
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
                }
                if (msg && it != msg) {
                    msg = encodeHTML( msg )
                    javaScriptProperties << "\"$it\": \"$msg\""
                }
            }
            out << javaScriptProperties.join( "," )
        }
        out << '};\n'

        /*
        out << '$.i18n.prop('
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
                }
                if (msg && it != msg) {
                    msg = encodeHTML( msg )
                    javaScriptProperties << "\"$it\": \"$msg\""
                }
            }
            out << javaScriptProperties.join( "," )
        }
        out << ');\n'
        */




        ///////////////////
        //TODO:: delete below test code

        def source = grailsApplication.mainContext.getBean('messageSource')
        def plugin = grailsApplication.mainContext.pluginManager.getGrailsPlugin("banner-csr-ui")
        def locale = LocaleContextHolder.getLocale()
        def map = [:]

        out << 'window.i18n_aip_bundle = "'
        out << source.getPluginBundles(plugin).toString()
        out << '"\n'
        out << 'window.i18n_aip_bundle_plugins = "'
        out << source.getPluginBaseNames().toString()
        out << '"\n'

        source.getMergedProperties(locale).properties.each { key ->
            if (key.key.startsWith("aip.")) {
                map.put key.key, key.value
            }
        }
        out << "window.i18n_temp = ${map as JSON};\n"
        //////////////
    }

    def aipVersion = { attrs ->
        def plugin = grailsApplication.mainContext.pluginManager.getGrailsPlugin("banner-csr-ui")
        def map = [
                name: plugin.getName(),
                version: plugin.getVersion(),
                fileSystemName: plugin.getFileSystemName()
                ]
        out << "window.aipApp = ${map as JSON};\n"
    }
}