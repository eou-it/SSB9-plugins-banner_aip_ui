package net.hedtech.banner.csr

import grails.converters.JSON
import grails.util.Holders
import org.springframework.context.i18n.LocaleContextHolder

class CsrTagLib {
    def i18n_setup = { attrs ->
        def map = [:]
        Holders.grailsApplication.mainContext.getBean('messageSource').getMergedProperties(LocaleContextHolder.getLocale()).properties.each { key ->
            map.put key.key, key.value
        }
        out << "window.i18n = ${map as JSON};\n"
    }
    def csrVersion = { attrs ->
        def plugin = Holders.applicationContext.getBean('pluginManager').allPlugins.find {
            it -> it.name == "bannerCsrUi"
        }
        def map = [
                name: plugin.name,
                version: plugin.version
        ]
        out << "window.csrApp = ${map as JSON};\n"
    }
}