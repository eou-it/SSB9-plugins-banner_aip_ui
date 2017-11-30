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
 * AipTagLibIntegrationTests.
 */
class AipPageBuilderControllerIntegrationTests extends BaseIntegrationTestCase {


    @Before
    void setUp() {
        formContext = ['GUAGMNU']
        controller = new AipPageBuilderController()
        super.setUp()
    }


    @After
    void tearDown() {
        super.tearDown()
        logout()
    }


    @Test
    void pageScript() {
        controller.request.contentType = "text/json"
        controller.params.id = "AIPMasterTemplateSystemRequired"
        controller.pageScript()
        assertEquals 200, controller.response.status
    }


    @Test
    void page() {
        controller.request.contentType = "text/json"
        controller.params.id = "AIPMasterTemplateSystemRequired"
        controller.page()
        assertEquals 200, controller.response.status
        String actualJSON = controller.response.contentAsString
        def data = JSON.parse( actualJSON )
        assertNotNull data
    }
}
