/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON

class AipPageBuilderController {
    def aipPageBuilderCompositeService

    /**
     * Fetch Page Script
     * @return
     */
    def pageScript() {
        def compiledJSCode = aipPageBuilderCompositeService.pageScript( params.id )
        render( text: compiledJSCode, contentType: "text/javascript" )
    }

    /**
     * Fetch Page
     * @return
     */
    def page() {
        Map model=[:]
        model =  aipPageBuilderCompositeService.page( params.id )
        render model  as JSON
    }
}
