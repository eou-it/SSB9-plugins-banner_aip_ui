/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
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
        if (!session[BCM_LOCATION]) {
            bcmLocationURL = bannerCommManagementResourceAccessService.getBCMLocation()
            session[BCM_LOCATION] = bcmLocationURL
        } else {
            bcmLocationURL = session[BCM_LOCATION]
        }
        def map = [bcmURL: bcmLocationURL]
        render map as JSON
    }
}
