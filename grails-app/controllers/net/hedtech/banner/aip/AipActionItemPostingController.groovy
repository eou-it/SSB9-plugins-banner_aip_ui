/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.exceptions.ApplicationException
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib

/**
 * Controller class for AIP Action Item Posting
 */
class AipActionItemPostingController {
    private static final def LOGGER = Logger.getLogger( this.class )
    def actionItemPostingCompositeService
    /**
     * Add Action Item Post
     * @return
     */
    def addActionItemPosting() {
        def map = [:]
        map = request.JSON
        def model
        try {
            model = actionItemPostingCompositeService.addActionItemPosting( map )
        } catch (ApplicationException e) {
            model = [fail: true]
            LOGGER.error( e.getMessage() )
            model.message = e.returnMap( {mapToLocalize -> new ValidationTagLib().message( mapToLocalize )} ).message
        }
        render model as JSON
    }
}
