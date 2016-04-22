/** *****************************************************************************
 © 2016 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
package net.hedtech.banner.csr

import grails.converters.JSON
import net.hedtech.banner.general.person.PersonUtility
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder

/**
 * CsrControllerIntegrationTests.
 *
 * Date: 2/11/2016
 * Time: 9:18 AM
 */
class CsrControllerIntegrationTests extends BaseIntegrationTestCase {
    def selfServiceBannerAuthenticationProvider
    def actionItemService


    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        controller = new CsrController()
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }


    // using student. Fail on security?
    @Test
    void testAdminEntryPoint() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def result = controller.admin()
        assertEquals 200, controller.response.status

        assertEquals( "admin-landing", result.model.state)
        assertEquals( "index", result.view)
    }


    @Test
    void testListEntryPoint() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def result = controller.list()
        assertEquals 200, controller.response.status
        assertEquals( "list", result.model.state )
        assertEquals( "index", result.view )
    }


    @Test
    void testFetchActionItems() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.actionItems()
        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( 1, answer.items.size() )
    }


    @Test
    void testFetchActionItemsUserHasNone() {
        def person = PersonUtility.getPerson( "CSRSTU022" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.actionItems()
        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( 0, answer.items.size() )
    }


    @Test
    void testFetchActionItemsNotLoggedIn() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        controller.actionItems()
        assertEquals 403, controller.response.status
    }

    @Test
    void testFetchAdminGroups() {
        def person = PersonUtility.getPerson( "CSRSTU001" )
        assertNotNull person

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.adminGroupList()
        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assert 1 < answer.data.size()
        println answer
    }
}
