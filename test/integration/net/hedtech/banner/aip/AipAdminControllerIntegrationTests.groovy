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
 * AipAdminControllerIntegrationTests.
 *
 */
class AipAdminControllerIntegrationTests extends BaseIntegrationTestCase {
    def selfServiceBannerAuthenticationProvider
    def actionItemGroupService
    def actionItemReadOnlyService

    def VALID_FOLDER_NAME = "My Folder"
    def VALID_FOLDER_DESCRIPTION = "My Folder"

    def INVALID_FOLDER_NAME = "My Folder".padLeft( 1021 )
    def INVALID_FOLDER_DESCRIPTION = "My Folder".padLeft( 4001 )


    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        //formContext = ['SELFSERVICE']
        super.setUp()
        controller = new AipAdminController()
    }

    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    //TODO: using student. Fail on security?
    @Test
    void testFoldersEntryPointAsStudent() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.folders()
        def folder =  JSON.parse( controller.response.contentAsString )
        assertNotNull( folder )
        // TODO: get a better handle on testdata and exact test
        assertTrue( folder.size() > 15)
    }

    @Test
    void testFoldersEntryPointAsAdmin() {
        def person = PersonUtility.getPerson( "BCMADMIN" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.folders()
        def folder =  JSON.parse(controller.response.contentAsString )
        assertNotNull( folder )
        // TODO: get a better handle on testdata and exact test
        assertTrue( folder.size() > 15)
    }

    // using student. Fail on security?
    @Test
    void testAddFolderEntryPointAsStudent() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.addFolder( VALID_FOLDER_NAME, VALID_FOLDER_DESCRIPTION )
        def answer = JSON.parse( controller.response.contentAsString )

        assertFalse( answer.success )
        assertTrue( answer.newFolder.equals(null) )
        assertEquals( "Operation Not Permitted", answer.message )
    }

    @Test
    void testAddFolderEntryPointAsAdmin() {
        def person = PersonUtility.getPerson( "BCMADMIN" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.addFolder(VALID_FOLDER_NAME, VALID_FOLDER_DESCRIPTION)
        def answer = JSON.parse( controller.response.contentAsString )
        //println answer
        //TODO: fix BCMADMIN test in general app
        //assertTrue( answer.success )
        //assertNotNull( answer.newFolder )
        //assertTrue( answer.message.equals(null) )
    }


    @Test
    void testCreateActionItemGroup() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName('AIPGeneral').id

        def requestObj = [:]
        requestObj.groupTitle = "test1a2b" // Make sure title and folder create unique pair
        requestObj.folderId = folderId
        requestObj.groupStatus = "pending"
        requestObj.groupDesc = "<p><strong>This is a group description</p></strong>"
        //requestObj.userId = "CSRADM001"
        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
       // println answer

        assertTrue( answer.success )
        assertNotNull( answer.newGroup )
        assertTrue( answer.message.equals( null ) )
    }

    @Test
    void testCreateActionItemTitleFolderIdDuplicateConstraint() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.groupTitle = "International Students" // group in AIPGeneral Folder with this name already exists
        requestObj.folderId = folderId
        requestObj.groupStatus = "pending"
        requestObj.groupDesc = "<p><strong>This is a group description</p></strong>"
        //requestObj.userId = "CSRADM001"
        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse answer.success
        assertTrue( answer.group.equals( null ) )
        assertEquals( answer.errors[0], 'Save failed. The Group Title and Folder must be unique.')
    }


    @Test
    void testCreateActionItemGroupConstraintNull() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.groupTitle = null
        requestObj.folderId = folderId
        requestObj.groupStatus = null
        requestObj.groupDesc = "<p><strong>This is a group description</p></strong>"
        //requestObj.userId = ""
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( "Save failed. Title cannot be null.", answer.errors[0])
        assertEquals( "Save failed. Status cannot be null.", answer.errors[1])
        assertEquals( false, answer.success)
    }


    @Test
    void testCreateActionItemGroupConstraintEmpty() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.groupTitle = ""
        requestObj.folderId = folderId
        requestObj.groupStatus = "pending"
        requestObj.groupDesc = "<p><strong>This is a group description</p></strong>"
        //requestObj.userId = ""
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( "Save failed. Title cannot be null.", answer.errors[0])
        assertEquals( false, answer.success)
    }


    @Test
    void testCreateActionItemGroupConstraintMaxSize() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.groupTitle = "myTitle"
        requestObj.folderId = folderId
        requestObj.groupStatus = "pendingstatusoverthe30characterlimit"
        requestObj.groupDesc = "<p><strong>This is a group description</p></strong>"
        //requestObj.userId = "CSRADM001"
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( "status exceeded max size", answer.errors[0] )
        assertEquals( false, answer.success )
    }

    @Test
        void testAipGroupAsAdmin() {
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        List<ActionItemGroup> actionItemGroups = actionItemGroupService.listActionItemGroups()
        def actionItemGroupId = actionItemGroups[0].id
        def actionItemGroupTitle = actionItemGroups[0].title

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.groupId = actionItemGroupId
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.openGroup()
        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( true, answer.success )
        assertEquals( actionItemGroupTitle, answer.group?.title )
    }


    // FIXME: security. Is student Authorized?
    @Test
    void testAipGroupAsStudent() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        List<ActionItemGroup> actionItemGroups = actionItemGroupService.listActionItemGroups()
        def actionItemGroupId = actionItemGroups[0].id
        def actionItemGroupTitle = actionItemGroups[0].title

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.groupId = actionItemGroupId
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.openGroup()

        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( true, answer.success )
        assertEquals( actionItemGroupTitle, answer.group?.title )
    }

    // FIXME: security. should fail
    @Test
    void testAipGroupAsNobody() {
        List<ActionItemGroup> actionItemGroups = actionItemGroupService.listActionItemGroups()
        def actionItemGroupId = actionItemGroups[0].id
        def actionItemGroupTitle = actionItemGroups[0].title

        def requestObj = [:]
        requestObj.groupId = actionItemGroupId
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.openGroup()

        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( true, answer.success )
        assertEquals( actionItemGroupTitle, answer.group?.title )
    }


    @Test
    void testAipGroupBadParam() {
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.groupId = 1234567895
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.openGroup()

        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( false, answer.success )
        assertTrue( answer.group.id.equals( null ) )
    }


    @Test
    void testAipGroupNoParam() {
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        List<ActionItemGroup> actionItemGroups = actionItemGroupService.listActionItemGroups()

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.groupId = null
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.openGroup( )
        assertEquals 403, controller.response.status
    }

    @Test
    void testAipActionItemsAsStudent() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        List<ActionItemReadOnly> actionItemReadOnlyList = actionItemReadOnlyService.listActionItemRO()
        def actionItemId = actionItemReadOnlyList[0].id
        def actionItemName = actionItemReadOnlyList[0].name

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.actionItemList()

        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        println answer
        assertEquals( actionItemName, answer[0].name)
    }



}