/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback

/**
 * AipPageBuilderControllerIntegrationTests.
 */
@Integration
@Rollback
class AipPageBuilderControllerIntegrationTests extends BaseIntegrationTestCase {

    @Autowired
    AipPageBuilderController controller


    @Before
    void setUp() {
        formContext = ['SELFSERVICE']
        //controller = new AipPageBuilderController()
       /* def auth = selfServiceBannerAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken('CSRSTU004', '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertNotNull auth*/
        super.setUp()
    }


    @After
    void tearDown() {
        super.tearDown()
        logout()
    }


    @Test
    void pageScript() {
        def auth = selfServiceBannerAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken('CSRSTU004', '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        String query = """ INSERT INTO PAGE ( CONSTANT_NAME, VERSION, ID, MODEL_VIEW ) VALUES ('TestAIPMasterTemplateSystemRequired', 0, -9999, '{"name": "TestAIPMasterTemplateSystemRequired", "type" : "page"}') """
        println query
        sessionFactory.currentSession.createSQLQuery( query ).executeUpdate()
        controller.request.contentType = "text/json"
        controller.params.id = "TestAIPMasterTemplateSystemRequired"
        controller.pageScript()
        assertEquals 200, controller.response.status
    }


    @Test
    void page() {
        def auth = selfServiceBannerAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken('CSRSTU004', '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        String query = """ INSERT INTO PAGE ( CONSTANT_NAME, VERSION, ID, MODEL_VIEW ) VALUES ('TestAIPMasterTemplateSystemRequired', 0, -9999, :clob) """
        println query
        sessionFactory.currentSession.createSQLQuery( query ).setString( 'clob', '{ "name":"TestAIPMasterTemplateSystemRequired","type":"page" }' ).executeUpdate()
        controller.request.contentType = "text/json"
        controller.params.id = "TestAIPMasterTemplateSystemRequired"
        controller.page()
        assertEquals 200, controller.response.status
        String actualJSON = controller.response.contentAsString
        def data = JSON.parse( actualJSON )
        assertNotNull data
    }
}
