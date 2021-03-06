/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.general.person.PersonUtility
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder

/**
 * BCMControllerIntegrationTests.
 */
@Integration
@Rollback
class BCMControllerIntegrationTests extends BaseIntegrationTestCase {

    @Autowired
    BCMController controller
    def selfServiceBannerAuthenticationProvider

    @Before
    void setUp() {
        formContext = ['SELFSERVICE']
        //controller = new BCMController()
       /* def auth = selfServiceBannerAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken('AIPADM001', '111111'))
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
    void testBCMLocation() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.request.contentType = "text/json"
        controller.getBCMLocation()
        assertEquals 200, controller.response.status
        String actualJSON = controller.response.contentAsString
        def data = JSON.parse( actualJSON )
        assertNotNull data
    }


    @Test
    void testBCMLocationNoSessionValue() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.request.contentType = "text/json"
        controller.session['BCM_LOCATION'] = 'http:/test'
        controller.getBCMLocation()
        assertEquals 200, controller.response.status
        String actualJSON = controller.response.contentAsString
        def data = JSON.parse( actualJSON )
        assertNotNull data
    }

}
