/**
 * Created by jshin on 12/22/15.
 */
package net.hedtech.banner.csr

import grails.converters.JSON

import java.security.InvalidParameterException
import org.springframework.context.i18n.LocaleContextHolder

class CsrController {

    static defaultAction = "listItems"
    def model=[:]
    def listItems() {
        render(model: model, view: "index")
    }

}