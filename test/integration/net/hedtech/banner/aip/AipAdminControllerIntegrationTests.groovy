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
    def actionItemTemplateService

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
        // TODO: verify something
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
        requestObj.groupStatus = "Pending"
        requestObj.groupDesc = "<p><strong>This is a group description</p></strong>"

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )

        assertTrue( answer.success )
        assertNotNull( answer.newGroup )
        assertTrue( answer.message.equals( null ) )
    }

    @Test
    void testCreateActionGroupTitleFolderIdDuplicateConstraint() {

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

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse answer.success
        assertTrue( answer.group.equals( null ) )
        assertEquals( 'Save failed. The Group Title and Folder must be unique.', answer.message )
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

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( "Save failed. The Title can not be null or empty.", answer.message)
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

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( "Save failed. The Title can not be null or empty.", answer.message)
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

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( 'Save failed. Max size exceeded.', answer.message )
        assertEquals( false, answer.success )
    }


    @Test
    void testCreateActionItemGroupFolderValidationError() {
        def BAD_FOLDER_ID = 9842374
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.groupTitle = "myTitle"
        requestObj.folderId = BAD_FOLDER_ID
        requestObj.groupStatus = "pending"
        requestObj.groupDesc = "<p><strong>This is a group description</p></strong>"

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Folder with Id " + BAD_FOLDER_ID + " does not exist.", answer.message )
    }


    @Test
    void testCreateActionItem() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.status = "Pending"
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.description = "<p><strong>This is a group description</p></strong>"

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )

        assertTrue( answer.success )
        assertNotNull( answer.newActionItem )
        assertTrue( answer.message.equals( null ) )
        assertEquals( "BCMADMIN", answer.newActionItem.creatorId )
        assertEquals( "BCMADMIN", answer.newActionItem.userId )
    }


    @Test
    void testCreateActionItemMaxSizeError() {
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.status = "123456789012345678901234567890123"
        requestObj.folderId = folderId
        requestObj.title = "max size title 4tr0"
        requestObj.description = "<p><strong>This is a group description</p></strong>"

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. Max size exceeded.", answer.message )
    }


    @Test
    void testCreateActionItemNoDescription() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.status = "Pending"
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.description = null
        //requestObj.userId = "CSRADM001"
        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )

        assertTrue( answer.success )
        assertNotNull( answer.newActionItem )
        assertTrue( answer.message.equals( null ) )
        assertEquals( "BCMADMIN", answer.newActionItem.creatorId )
        assertEquals( "BCMADMIN", answer.newActionItem.userId )
    }


    @Test
    void testCreateActionItemNoSession() {
        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.status = "Pending"
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        assertEquals 403, controller.response.status
    }


    @Test
    void testCreateActionItemNoStatus() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.status = null
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.description = null
        //requestObj.userId = "CSRADM001"
        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Status can not be null or empty.", answer.message )
    }


    @Test
    void testCreateActionItemNoTitle() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName( 'AIPGeneral' ).id

        def requestObj = [:]
        requestObj.status = 'Pending'
        requestObj.folderId = folderId
        requestObj.title = ''
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Title can not be null or empty.", answer.message )
    }


    @Test
    void testCreateActionItemNoFolderId() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.status = 'Pending'
        requestObj.folderId = ''
        requestObj.title = 'title 4238j'
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Folder Id can not be null or empty.", answer.message )
    }


    @Test
    void testCreateActionItemTitleNotUniqueInFolder() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def ai = ActionItem.fetchActionItems(  )[7]

        def requestObj = [:]
        requestObj.status = 'Pending'
        requestObj.folderId = ai.folderId
        requestObj.title = ai.title
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Action Item Title and Folder must be unique.", answer.message )
    }


    @Test
    void testCreateActionItemFolderValidationError() {
        def BAD_FOLDER_ID = 9842374
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.status = 'Pending'
        requestObj.folderId = BAD_FOLDER_ID
        requestObj.title = 'a title 49rtu423'
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Folder with Id " + BAD_FOLDER_ID + " does not exist.", answer.message )
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
    void testSortAipActionItemsAsStudent() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.filterName="%"
        controller.params.sortColumn="actionItemName"
        controller.params.sortAscending=true
        controller.params.max=20
        controller.params.offset=0

        controller.actionItemList()
        def answer = JSON.parse( controller.response.contentAsString )

        assertEquals 200, controller.response.status
        // TODO: verify something
    }


    @Test
    void testSortAipGroupAsStudent() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.filterName="%"
        requestObj.sortColumn="groupTitle"
        requestObj.sortAscending=true
        requestObj.max=20
        requestObj.offset=0

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.groupList()
        def answer = JSON.parse( controller.response.contentAsString )
        // TODO: verify something
        assertEquals 200, controller.response.status
    }


    @Test
    void testOpenActionItem() {
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: admin
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        ActionItemReadOnly myActionItem = actionItemReadOnlyService.listActionItemRO(  )[6]

        controller.params.actionItemId = myActionItem.actionItemId

        controller.openActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( true, answer.success )
        assertEquals( myActionItem.actionItemId, answer.actionItem.actionItemId )
        assertEquals( myActionItem.folderDesc, answer.actionItem.folderDesc )
        assertEquals( myActionItem.folderId, answer.actionItem.folderId )
    }


    @Test
    void testOpenActionItemNoId() {
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: admin
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.actionItemId = null


        controller.openActionItem()
        assertEquals 403, controller.response.status
    }


    @Test
    void testOpenActionItemBadId() {
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: admin
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.actionItemId = 99995511

        controller.openActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( false, answer.success )
    }


    @Test
    void testActionItemTemplateList() {
        List<ActionItemTemplate> templates = actionItemTemplateService.listActionItemTemplates()
        controller.actionItemTemplateList()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( templates.size(), answer.size() )
        assertEquals( templates[0].id, answer[0].id )
    }

    @Test
    void testUpdateActionItemDetailWithTemplate() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.templateId=1
        controller.params.actionItemDetailId=116

        controller.updateActionItemDetailWithTemplate()
        def answer = JSON.parse( controller.response.contentAsString )

        assertEquals 200, controller.response.status
        assertEquals 1, answer.actionItem.templateReferenceId
    }
}