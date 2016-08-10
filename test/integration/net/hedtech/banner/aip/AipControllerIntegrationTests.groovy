/** *****************************************************************************
 © 2016 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.general.communication.folder.CommunicationFolder
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

        assertEquals( "/landing", result.model.fragment )
        assertEquals( "index", result.view )
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
        assertEquals( "/list", result.model.fragment )
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
    void testCheckActionItems() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.checkActionItem()
        assertEquals 200, controller.response.status

        def answer = JSON.parse( controller.response.contentAsString )
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
        //assertEquals( 1, answer.items.size() )
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
        assert 1 < answer.result.size()
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
    void testGetItemInfo() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.getItemInfo( "drugAndAlcohol" )
        controller.getItemInfo( "registrationTraining" )
        controller.getItemInfo( "personalInfo" )
        controller.getItemInfo( "meetAdvisor" )
        controller.getItemInfo( "residenceProof" )
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
