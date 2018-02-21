/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

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
 */
class AipControllerIntegrationTests extends BaseIntegrationTestCase {
    def selfServiceBannerAuthenticationProvider

    def actionItemService


    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        controller = new AipController()
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
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
        //TODO:: for now, it return one hardcoded group. When group assign done, fix this
        assertTrue( answer.groups.items.size() > 0 )
    }


    @Test
    void testCheckActionItems() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        // endpoint was removed. We will re-enable for blocking User Story
        //controller.checkActionItems()
        //assertEquals 200, controller.response.status
        //def answer = JSON.parse( controller.response.contentAsString )
        //assertEquals( 1, answer.items.size() )
    }


    @Test
    void testCheckUserInfo() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.userInfo()
        assertEquals 200, controller.response.status

        def answer = JSON.parse( controller.response.contentAsString )
        // FIXME: test isn't really testing anything
        //assertEquals( 1, answer.items.size() )
    }


    @Test
    void testFetchActionItemsUserHasNone() {
        def person = PersonUtility.getPerson( "STUAFR301" ) // user from student tests
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.actionItems()
        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( 0, answer.groups.size() )
    }


    @Test
    void testFetchActionItemsNotLoggedIn() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        assertNotNull person
        controller.actionItems()
        assertEquals 200, controller.response.status
    }


    @Test
    void informedList() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def result = controller.informedList()
        assertEquals 200, controller.response.status
        assertEquals( "index", result.view )
    }


    @Test
    void testLogout() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.logout()
        assertEquals 200, controller.response.status
    }


    @Test
    void testDetailInfo() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def jsonObj = [:]
        jsonObj.type = "group"
        controller.request.method = "POST"
        controller.request.json = jsonObj
        controller.detailInfo()
        assertEquals 200, controller.response.status
    }


}
