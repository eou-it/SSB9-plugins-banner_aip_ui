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
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback

/**
 * CsrControllerIntegrationTests.
 */
@Integration
@Rollback
class AipControllerIntegrationTests extends BaseIntegrationTestCase {
    @Autowired
    AipController controller
    def selfServiceBannerAuthenticationProvider

    def actionItemService


    @Before
    public void setUp() {
        formContext = ['SELFSERVICE']
       // controller = new AipController()

        //controller.actionItemService = actionItemService
       // loginSSB('CSRSTU002', '111111')

      /* def auth = selfServiceBannerAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken('CSRSTU002', '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertNotNull auth*/
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
        controller.list()
        assertEquals 200, controller.response.status
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
        assertTrue( answer.groups.items.size() > 0 )
    }


    @Test
    void testCheckActionItems() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
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
        assert answer.bannerId == 'CSRSTU002'
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
        controller.informedList()
        assertEquals 200, controller.response.status
    }


    @Test
    void testDetailInfo() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        List<ActionItemGroup> actionItemGroups = ActionItemGroup.fetchActionItemGroups()
        def actionItemGroupId = actionItemGroups[0].id
        controller.params.groupId = actionItemGroupId.toString()
        controller.params.searchType = 'group'
        controller.detailInfo()
        assertEquals 200, controller.response.status
    }

    @Test
    void testFetchActionItemsUserHasNone() {
        def person = PersonUtility.getPerson( "STUAFR301" ) // user from student tests
        assertNotNull person
        //loginSSB('STUAFR301', '111111')
       def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.actionItems()
        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( 0, answer.groups.size() )
    }



}
