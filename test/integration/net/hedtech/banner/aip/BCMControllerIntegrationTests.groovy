/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test

/**
 * BCMControllerIntegrationTests.
 */
class BCMControllerIntegrationTests extends BaseIntegrationTestCase {
    @Before
    void setUp() {
        formContext = ['GUAGMNU']
        controller = new BCMController()
        super.setUp()
    }


    @After
    void tearDown() {
        super.tearDown()
        logout()
    }


    @Test
    void testBCMLocation() {
        controller.request.contentType = "text/json"
        controller.BCMLocation
        assertEquals 200, controller.response.status
        String actualJSON = controller.response.contentAsString
        def data = JSON.parse( actualJSON )
        assertNotNull data
    }


    @Test
    void testBCMLocationNoSessionValue() {
        controller.request.contentType = "text/json"
        controller.session['BCM_LOCATION'] = 'http:/test'
        controller.BCMLocation
        assertEquals 200, controller.response.status
        String actualJSON = controller.response.contentAsString
        def data = JSON.parse( actualJSON )
        assertNotNull data
    }

}
