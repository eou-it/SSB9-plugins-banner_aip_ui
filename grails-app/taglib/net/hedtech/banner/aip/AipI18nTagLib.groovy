package net.hedtech.banner.aip

import grails.converters.JSON
import org.springframework.context.i18n.LocaleContextHolder


class AipI18nTagLib {

    def i18n_setup = {attrs ->
        def map = [:]


        //Loads i18n messages from the Binaries
        grailsApplication.mainContext.getBean( 'messageSource' ).getMergedBinaryPluginProperties( LocaleContextHolder.getLocale() ).properties.each {key ->
          print"AIP"
            map.put key.key, key.value
        }
        grailsApplication.mainContext.getBean( 'messageSource' ).getMergedProperties( LocaleContextHolder.getLocale() ).properties.each {key ->
            print"AIddP"
            map.put key.key, key.value
        }
        out << "window.i18n = ${map as JSON};\n"
    }
  }

