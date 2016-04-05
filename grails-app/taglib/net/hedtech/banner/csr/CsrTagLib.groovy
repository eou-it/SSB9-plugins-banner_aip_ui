package net.hedtech.banner.csr

import grails.converters.JSON
import net.hedtech.banner.i18n.DateAndDecimalUtils
import org.springframework.web.servlet.support.RequestContextUtils


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
                println "crr23 " + it + ": " + names
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
        "crr44 " + resourceService.getModule( name )
        if (resourceService.getModule( name )?.dependsOn) {
            resourceService.getModule( name )?.dependsOn.each {
                "crr48 " + it + ": " + list
                addDependendNames( it, list )
            }
        }
    }

    def i18n_setup = { attrs ->

        def names = resourceModuleNames( request )
        Set keys = []

        if (names.size() > 0) {

            // Search for any place where we are referencing message codes
            def regex = ~/\(*\.i18n.prop\(.*?[\'\"](.*?)[\'\"].*?\)/
            names.each { name ->
                if (name.equals( "bannerCSRApp" )) {
                    resourceService.getModule( name )?.resources?.findAll { it.sourceUrlExtension == "js" }?.each {
                        if (!it.attributes.containsKey( LOCALE_KEYS_ATTRIBUTE )) {
                            it.attributes[LOCALE_KEYS_ATTRIBUTE] = new HashSet()

                            if (it.processedFile) {
                                println "crr:70: " + it.processedFile
                                def fileText

                                // Check to see if the file has been zipped.  This only occurs in the Environment.DEVELOPMENT
                                // If it occurs, we'll create a reference to the original file and parse it instead.
                                if (it.processedFile.path.endsWith( ".gz" )) {
                                    def originalFile = new File( "${it.workDir}${it.sourceUrl}" )
                                    println "crr:77: " + originalFile
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
                                println "crr:91: " + it.attributes[LOCALE_KEYS_ATTRIBUTE]
                            }
                        }

                        keys.addAll( it.attributes[LOCALE_KEYS_ATTRIBUTE] )
                    }
                }
            }
        } else {
            keys = ["default.calendar", "default.calendar1", "default.calendar2", "default.calendar.gregorian.ulocale", "default.calendar.islamic.ulocale", "default.date.format", "default.gregorian.dayNames", "default.gregorian.dayNamesMin", "default.gregorian.dayNamesShort", "default.gregorian.monthNames", "default.gregorian.monthNamesShort", "default.gregorian.amPm", "default.islamic.dayNames", "default.islamic.dayNamesMin", "default.islamic.dayNamesShort", "default.islamic.monthNames", "default.islamic.monthNamesShort", "default.islamic.amPm", "default.language.direction", "js.datepicker.dateFormat", "default.century.pivot", "default.century.above.pivot", "default.century.below.pivot", "default.dateEntry.format", "js.datepicker.selectText", "js.datepicker.prevStatus", "js.datepicker.nextStatus", "js.datepicker.yearStatus", "js.datepicker.monthStatus", "default.calendar.islamic.translation", "default.calendar.gregorian.translation", "default.firstDayOfTheWeek", "js.datepicker.datetimeFormat", "js.input.datepicker.dateformatinfo", "js.input.datepicker.info", "js.datepicker.info"]
            keys.addAll( addTimeKeys() )
        }

        out << 'window.i18n_csr = {'
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
        out << '};'
    }
    def csrVersion = { attrs ->
        def plugin = applicationContext.getBean('pluginManager').allPlugins.find {
            it -> it.name == "bannerCsrUi"
        }
        def map = [
                name: plugin.name,
                version: plugin.version
        ]
        out << "window.csrApp = ${map as JSON};\n"
    }
}