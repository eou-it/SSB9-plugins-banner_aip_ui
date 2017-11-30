/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON

class AipPageBuilderController {
    def aipPageBuilderCompositeService

    /**
     * Fetch Page Script
     * @return
     */
    def pageScript = {
        def compiledJSCode = aipPageBuilderCompositeService.pageScript( params.id )
        render( text: compiledJSCode, contentType: "text/javascript" )
    }

    /**
     * Fetch Page
     * @return
     */
    def page = {
        def model = aipPageBuilderCompositeService.page( params.id )
        render model as JSON
    }
}
