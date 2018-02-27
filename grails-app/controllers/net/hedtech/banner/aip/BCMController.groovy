/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

package net.hedtech.banner.aip

import grails.converters.JSON

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
            bcmLocationURL = bannerCommManagementResourceAccessService.getBCMLocation()
            session[BCM_LOCATION] = bcmLocationURL
        }
        def map = [bcmURL: bcmLocationURL]
        render map as JSON
    }
}
