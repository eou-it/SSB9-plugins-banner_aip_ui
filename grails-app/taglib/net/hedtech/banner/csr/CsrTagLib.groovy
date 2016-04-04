package net.hedtech.banner.csr

import grails.converters.JSON
import org.springframework.context.i18n.LocaleContextHolder
import grails.util.Environment

class CsrTagLib {
    def i18n_setup = { attrs ->
        def map = [:]
        def locale = LocaleContextHolder.getLocale()
        //dummy arabic test for chrome in dev
        if(Environment.current == Environment.DEVELOPMENT && locale.toString().equals("ar")) {
            locale = new Locale("ar_SA")
        }
        grailsApplication.mainContext.getBean('messageSource').getMergedProperties(locale).properties.each { key ->
            if (key.key.startsWith("csr.")) {
                map.put key.key, key.value
            }
        }
        out << "window.i18n_csr = ${map as JSON};\n"
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