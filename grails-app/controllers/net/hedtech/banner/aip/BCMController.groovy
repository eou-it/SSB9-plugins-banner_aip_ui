/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.aip

import grails.converters.JSON
import grails.util.Holders

/**
 * Controller class to access BCM configuration
 */
class BCMController {
    def bannerCommManagementResourceAccessService
    private final static String BCM_LOCATION = 'BCM_LOCATION'

    /**
     * Provides BCM Location
     * @return
     */
    def getBCMLocation() {
        def bcmLocationURL
        if (session[BCM_LOCATION]) {
            bcmLocationURL = session[BCM_LOCATION]
        } else {
            bcmLocationURL = Holders.config.BCMLOCATION
            session[BCM_LOCATION] = bcmLocationURL
        }
        def map = [bcmURL: bcmLocationURL,mepCode:session.getAttribute('mep')]
        render map as JSON
    }
}
