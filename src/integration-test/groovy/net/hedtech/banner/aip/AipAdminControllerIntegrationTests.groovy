/*********************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import grails.util.Holders
import net.hedtech.banner.aip.block.process.BlockingProcess
import net.hedtech.banner.general.communication.folder.CommunicationFolder
import net.hedtech.banner.general.person.PersonUtility
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import net.hedtech.banner.general.configuration.ConfigProperties
import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback

/**
 * AipAdminControllerIntegrationTests.
 *
 */
@Integration
@Rollback
class AipAdminControllerIntegrationTests extends BaseIntegrationTestCase {

    @Autowired
    AipAdminController controller

    def selfServiceBannerAuthenticationProvider

    def actionItemStatusCompositeService

    def actionItemGroupService

    def communicationFolderService

    def actionItemReadOnlyService

    def actionItemTemplateService

    def actionItemStatusService

    def actionItemService

    def preferredNameService

    def actionItemStatusRuleReadOnlyService

    def VALID_FOLDER_NAME = "My Folder"

    def VALID_FOLDER_DESCRIPTION = "My Folder"


    @Before
    void setUp() {
        formContext = ['SELFSERVICE']
        super.setUp()
        // controller = new AipAdminController()
        Holders.config.BANNER_AIP_BLOCK_PROCESS_PERSONA = ['EVERYONE', 'STUDENT', 'REGISTRAR', 'FACULTYINSTRUCTOR', 'FACULTYADVISOR', 'FACULTYBOTH']
    }


    @After
    void tearDown() {
        super.tearDown()
        logout()
    }


    @Test
    void testFoldersEntryPointAsStudent() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.folders()
        def folder = JSON.parse( controller.response.contentAsString )
        assertNotNull( folder )
        assertTrue( folder.size() > 0 )
    }


    @Test
    void testFoldersEntryPointAsAdmin() {
        def person = PersonUtility.getPerson( "AIPADM001" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        communicationFolderService.create( new CommunicationFolder( name: 'Test',
                description: 'Description',
                systemIndicator: false,
                internal: false ) )
        controller.folders()
        def folder = JSON.parse( controller.response.contentAsString )
        assertNotNull( folder )
        folder.find { it.get( "name" ) == 'Test' }.name == 'Test'
        folder.find { it.get( "name" ) == 'Test' }.description == 'Description'
    }


    @Test
    void testCreateActionItemGroup() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [group: [:], edit: [], duplicate: []]
        requestObj.group.groupTitle = "test1a2b" // Make sure title and folder create unique pair
        requestObj.group.groupName = "myName"
        requestObj.group.folderId = folderId
        requestObj.group.groupStatus = "Draft"
        requestObj.group.groupDesc = "<p><strong>This is a group description</p></strong>"
        requestObj.edit = false
        requestObj.duplicate = false

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.createOrUpdateGroup()
        def answer = JSON.parse( controller.response.contentAsString )

        assertTrue( answer.success )
        assertNotNull( answer.group )
        assertTrue( answer.message.equals( null ) )
    }


    @Test
    void testCreateActionGroupNameFolderIdDuplicateConstraint() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [group: [:], edit: [], duplicate: []]
        requestObj.group.groupTitle = "International Students title"
        requestObj.group.groupName = "International Students"
        // group in AIPGeneral Folder with this name already exists
        requestObj.group.folderId = folderId
        requestObj.group.groupStatus = "Draft"
        requestObj.group.groupDesc = "<p><strong>This is a group description</p></strong>"
        requestObj.edit = false
        requestObj.duplicate = false

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.createOrUpdateGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse answer.success
        assertTrue( answer.group.equals( null ) )
        assertEquals( 'Save failed. The group name must be unique within the selected folder.', answer.message )
    }


    @Test
    void testCreateActionItemGroupConstraintNull() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [group: [:], edit: [], duplicate: []]
        requestObj.group.groupTitle = null
        requestObj.group.groupName = "myName"
        requestObj.group.folderId = folderId
        requestObj.group.groupStatus = null
        requestObj.group.groupDesc = "<p><strong>This is a group description</p></strong>"
        requestObj.edit = false
        requestObj.duplicate = false

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createOrUpdateGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( "Save failed. The Title can not be null or empty.", answer.message )
        assertEquals( false, answer.success )
    }


    @Test
    void testCreateActionItemGroupConstraintEmpty() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [group: [:], edit: [], duplicate: []]
        requestObj.group.groupTitle = null
        requestObj.group.groupName = "myName"
        requestObj.group.folderId = folderId
        requestObj.group.groupStatus = "Draft"
        requestObj.group.groupDesc = "<p><strong>This is a group description</p></strong>"
        requestObj.edit = false
        requestObj.duplicate = false

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createOrUpdateGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( "Save failed. The Title can not be null or empty.", answer.message )
        assertEquals( false, answer.success )
    }


    @Test
    void testCreateActionItemGroupConstraintMaxSize() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [group: [:], edit: [], duplicate: []]
        requestObj.group.groupTitle = "myTitle"
        requestObj.group.groupName = "1234567890" + "1234567890" + "1234567890" + "1234567890" + "1234567890" + "1234567890" + "a"
        //60 max
        requestObj.group.folderId = folderId
        requestObj.group.groupStatus = "Draft"
        requestObj.group.groupDesc = "<p><strong>This is a group description</p></strong>"
        requestObj.edit = false
        requestObj.duplicate = false

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.createOrUpdateGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( 'Save failed. Max size exceeded.', answer.message )
        assertEquals( false, answer.success )
    }


    @Test
    void testCreateActionItemGroupFolderValidationError() {
        def BAD_FOLDER_ID = 9842374
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [group: [:], edit: [], duplicate: []]
        requestObj.group.groupTitle = "myTitle"
        requestObj.group.groupName = "myName"
        requestObj.group.folderId = BAD_FOLDER_ID
        requestObj.group.groupStatus = "Draft"
        requestObj.group.groupDesc = "<p><strong>This is a group description</p></strong>"
        requestObj.edit = false
        requestObj.duplicate = false

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.createOrUpdateGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Folder does not exist.", answer.message )
    }


    @Test
    void testCreateActionItem() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [:]
        requestObj.status = "Draft"
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.name = "myName"
        requestObj.description = "<p><strong>This is a group description</p></strong>"

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )

        assertTrue( answer.success )
        assertNotNull( answer.newActionItem )
        assertTrue( answer.message.equals( null ) )
        assertEquals( "AIPADM001", answer.newActionItem.creatorId )
        assertEquals( "AIPADM001", answer.newActionItem.lastModifiedBy )
    }


    @Test
    void testEditActionItem() {
        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor
        assertNotNull admin
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id
        ActionItem actionItem = new ActionItem(
                folderId: folderId,
                name: 'myName',
                description: '<p><strong>This is a group description</p></strong>',
                title: 'a title',
                postedIndicator: 'N',
                status: 'D',
                creatorId: 'BCMADMIN'
        )
        actionItem = actionItemService.create( actionItem )
        def requestObj = [:]
        requestObj.actionItemId = actionItem.id
        requestObj.status = "Active"
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.name = "myName"
        requestObj.description = "<p><strong>This is a group description</p></strong>"
        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.editActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertTrue( answer.success )
        assertNotNull( answer.updatedActionItem )
        assertTrue( answer.message.equals( null ) )
        assertEquals( "BCMADMIN", answer.updatedActionItem.creatorId )
        assertEquals( "BCMADMIN", answer.updatedActionItem.lastModifiedBy )
    }


    @Test
    void testCreateActionItemMaxSizeError() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [:]
        requestObj.status = "Draft"
        requestObj.folderId = folderId
        requestObj.title = "max size title 4tr0"
        requestObj.name = "1234567890" + "1234567890" + "1234567890" + "1234567890" + "1234567890" + "1234567890" + "a"
        //60 max
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

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [:]
        requestObj.status = "Active"
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.name = "myName"
        requestObj.description = null
        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )

        assertTrue( answer.success )
        assertNotNull( answer.newActionItem )
        assertTrue( answer.message.equals( null ) )
        assertEquals( "AIPADM001", answer.newActionItem.creatorId )
        assertEquals( "AIPADM001", answer.newActionItem.lastModifiedBy )
    }


    @Test
    void testCreateActionItemNoSession() {
        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [:]
        requestObj.status = "Active"
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.name = "myName"
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals false, answer.success
    }


    @Test
    void testCreateActionItemNoStatus() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [:]
        requestObj.status = null
        requestObj.folderId = folderId
        requestObj.title = "a title"
        requestObj.name = "myName"
        requestObj.description = null
        //requestObj.lastModifiedBy = "AIPADM001"
        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Status can not be null or empty.", answer.message )
    }


    @Test
    void testCreateActionItemNoTitle() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.findByName( 'AIPgeneral' ).id

        def requestObj = [:]
        requestObj.status = 'Inactive'
        requestObj.folderId = folderId
        requestObj.title = null
        requestObj.name = "myName"
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

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.status = 'Active'
        requestObj.folderId = null
        requestObj.title = 'title 4238j'
        requestObj.name = "myName"
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Folder Id can not be null or empty.", answer.message )
    }


    @Test
    void testCreateActionItemNameNotUniqueInFolder() {

        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def ai = ActionItem.fetchActionItems()[7]

        def requestObj = [:]
        requestObj.status = 'Draft'
        requestObj.folderId = ai.folderId
        requestObj.title = 'a title jsdfnuwncf'
        requestObj.name = ai.name
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( "Save failed. The Action Item Name and Folder must be unique.", answer.message )
        assertFalse( answer.success )
    }


    @Test
    void testCreateActionItemFolderValidationError() {
        def BAD_FOLDER_ID = 9842374
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.status = 'Draft'
        requestObj.folderId = BAD_FOLDER_ID
        requestObj.title = 'a title 49rtu423'
        requestObj.name = 'a name'
        requestObj.description = null

        controller.request.method = "POST"
        controller.request.json = requestObj
        controller.addActionItem()
        def answer = JSON.parse( controller.response.contentAsString )
        assertFalse( answer.success )
        assertEquals( "Save failed. The Folder does not exist.", answer.message )
    }


    @Test
    void testAipGroupAsAdmin() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        List<ActionItemGroup> actionItemGroups = actionItemGroupService.listActionItemGroups()
        def actionItemGroupId = actionItemGroups[0].id
        def actionItemGroupTitle = actionItemGroups[0].title

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.groupId = actionItemGroupId.toString()

        controller.openGroup()
        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( true, answer.success )
        assertEquals( actionItemGroupTitle, answer.group?.groupTitle )
    }


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

        controller.params.groupId = actionItemGroupId.toString()
        controller.openGroup()

        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( actionItemGroupTitle, answer.group?.groupTitle )
        assertEquals( true, answer.success )
    }


    @Test
    void testAipGroupAsNobody() {
        List<ActionItemGroup> actionItemGroups = actionItemGroupService.listActionItemGroups()
        def actionItemGroupId = actionItemGroups[0].id
        def actionItemGroupTitle = actionItemGroups[0].title
        controller.params.groupId = actionItemGroupId.toString()

        controller.openGroup()

        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( true, answer.success )
        assertEquals( actionItemGroupTitle, answer.group?.groupTitle )
    }


    @Test
    void testAipGroupBadParam() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.groupId = "1234567895"

        controller.openGroup()

        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( false, answer.success )
        assertEquals( 0, answer.group.size() )
    }


    @Test
    void testAipGroupNoParam() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: advisor
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.groupId = null

        controller.openGroup()
        assertEquals 403, controller.response.status
    }


    @Test
    void testSortAipActionItemsAsStudent() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.filterName = "%"
        controller.params.sortColumn = "actionItemName"
        controller.params.sortAscending = true
        controller.params.max = 20
        controller.params.offset = 0

        controller.actionItemList()

        assertEquals 200, controller.response.status
    }


    @Test
    void testActionItemStatusGridList() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.params.searchString = null
        controller.params.sortColumnName = null
        controller.params.ascending = false
        controller.params.max = 20
        controller.actionItemStatusGridList()
        assertEquals 200, controller.response.status

    }


    @Test
    void testActionItemList() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.params.searchString = null
        controller.params.sortColumnName = null
        controller.params.ascending = false
        controller.params.max = 20
        controller.actionItemList()
        assertEquals 200, controller.response.status

    }


    @Test
    void testSortAipActionItemStatusAsStudent() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.filterName = "%"
        controller.params.sortColumn = "actionItemStatus"
        controller.params.sortAscending = true
        controller.params.max = 20
        controller.params.offset = 0

        controller.actionItemStatusGridList()

        assertEquals 200, controller.response.status
    }


    @Test
    void testSortAipGroupAsStudent() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.filterName = "%"
        requestObj.sortColumn = "groupTitle"
        requestObj.sortAscending = true
        requestObj.max = 20
        requestObj.offset = 0

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.groupList()

        assertEquals 200, controller.response.status
    }


    @Test
    void testOpenActionItem() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: admin
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        ActionItemReadOnly myActionItem = actionItemReadOnlyService.listActionItemRO()[6]

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
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: admin
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.params.actionItemId = null
    }


    @Test
    void testOpenActionItemBadId() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: admin
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
    void testActionItemStatusList() {
        List<ActionItemStatus> statuses = actionItemStatusService.listActionItemStatuses()
        controller.actionItemStatusList()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( statuses.size(), answer.size() )
        // same order
        assertEquals( statuses[0].id, answer[0].id )
        assertEquals( statuses[1].id, answer[1].id )
    }


    @Test
    void testUpdateActionItemDetailWithTemplate() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        List<ActionItemTemplate> templates = actionItemTemplateService.listActionItemTemplates()
        def actionItemTemplate = templates.id[0]

        List<ActionItem> actionItems = actionItemService.listActionItems()
        ActionItem actionItem = actionItems[0]
        actionItem.postedIndicator = 'N'
        actionItemService.update( actionItem )
        def requestObj = [:]
        requestObj.templateId = actionItemTemplate
        requestObj.actionItemId = actionItem.id

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.updateActionItemDetailWithTemplate()
        def answer = JSON.parse( controller.response.contentAsString )

        assertEquals 200, controller.response.status
        assertEquals actionItemTemplate, answer.actionItem.actionItemTemplateId
    }


    @Test
    void testStatusSave() {
        def admin = PersonUtility.getPerson( "CSRSTU002" ) // role: student
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def requestObj = [:]
        requestObj.title = "integration test status"
        requestObj.block = true

        controller.request.method = "POST"
        controller.request.json = requestObj

        controller.statusSave()
        def answer = JSON.parse( controller.response.contentAsString )

        assertEquals 200, controller.response.status
        assertNotNull answer.status
        assertNotNull answer.status.id

    }


    @Test
    void testActionItemStatusRule() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: admin
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        List<ActionItemStatusRuleReadOnly> actionItemStatusRules = actionItemStatusRuleReadOnlyService.listActionItemStatusRulesRO()
        controller.actionItemStatusRule()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( actionItemStatusRules.size(), answer.size() )
        assertEquals( actionItemStatusRules[0].statusRuleId, answer[0].statusRuleId )
    }


    @Test
    void testActionItemStatusRuleById() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: admin
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        List<ActionItemStatusRuleReadOnly> actionItemStatusRules = actionItemStatusRuleReadOnlyService.listActionItemStatusRulesRO()
        controller.params.id = actionItemStatusRules[0].statusRuleId

        controller.actionItemStatusRuleById()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( actionItemStatusRules[0].statusRuleId, answer.statusRuleId )
    }


    @Test
    void testActionItemStatusRuleByActionItemId() {
        def admin = PersonUtility.getPerson( "AIPADM001" ) // role: admin
        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        List<ActionItemStatusRuleReadOnly> actionItemStatusRules = actionItemStatusRuleReadOnlyService.listActionItemStatusRulesRO()
        List<ActionItemStatusRuleReadOnly> statusRules =
                actionItemStatusRuleReadOnlyService.getActionItemStatusRulesROByActionItemId( actionItemStatusRules[0].statusRuleActionItemId )
        controller.params.actionItemId = actionItemStatusRules[0].statusRuleActionItemId
        controller.actionItemStatusRulesByActionItemId()
        def answer = JSON.parse( controller.response.contentAsString )
        assertEquals( answer.size(), statusRules.size() )
        def result = answer.find { it.statusRuleId == actionItemStatusRules[0].statusRuleId }
        assertEquals( actionItemStatusRules[0].statusRuleId, result.statusRuleId )
    }


    def actionItemJSON() {
        """{"assignment":[{"actionItemId":${
            ActionItem.findByName( 'Drug and Alcohol Policy' ).id
        },"seq":1}],"groupId":${ActionItemGroup.findByName( 'Enrollment' ).id}}"""
    }


    @Test
    void addActionItemPosting() {
        controller.request.contentType = "text/json"
        String inputString = actionItemJSON()
        controller.request.json = inputString
        controller.updateActionItemGroupAssignment()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.success
    }


    @Test
    void getActionItemsListForSelect() {
        controller.request.contentType = "text/json"
        controller.getActionItemsListForSelect()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.find { it.actionItemName == 'Meet with Advisor' }.actionItemName == 'Meet with Advisor'
    }


    @Test
    void adminGroupStatus() {
        controller.request.contentType = "text/json"
        controller.adminGroupStatus()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.find { it.value == 'Draft' }.value == 'Draft'
    }


    @Test
    void removeStatus() {
        def title = 'TEST_TITLE'
        ActionItemStatus actionItemStatus = actionItemStatusCompositeService.statusSave( [title: title] ).status
        controller.request.contentType = "text/json"
        String inputString = """{"id":${actionItemStatus.id}}"""
        controller.request.json = inputString
        controller.removeStatus()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.success
        assert ActionItemStatus.findById( actionItemStatus.id ) == null
    }


    @Test
    void removeStatusFailedCase() {
        controller.request.contentType = "text/json"
        def inputString = """{"id":-99}"""
        controller.request.json = inputString
        controller.removeStatus()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.fail
        assert data.message == 'Action Item Status is not present in System.'
    }


    @Test
    void getAssignedActionItemInGroup() {
        controller.request.contentType = "text/json"
        controller.params.groupId = "${ActionItemGroup.findByName( 'Security, Police and Fire' ).id}"
        controller.getAssignedActionItemInGroup()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.find {
            it.actionItemName == 'Registration Process Training'
        }.actionItemName == 'Registration Process Training'
    }


    @Test
    void updateActionItemStatusRule() {
        controller.request.contentType = "text/json"
        ActionItemStatus actionItemStatus = ActionItemStatus.findByActionItemStatus( 'Completed' )
        ActionItem actionItem = ActionItem.findByName( 'Personal Information' )
        String inputString = """{"rules":[{"statusName":"","status":{"id":${
            actionItemStatus.id
        },"actionItemStatus":"Completed","actionItemStatusActive":"Y"},"statusRuleLabelText":"sas","statusRuleSeqOrder":0}],"actionItemId":${
            actionItem.id
        }}"""
        ActionItem aim = ActionItem.findByName( 'Personal Information' )
        aim.postedIndicator = 'N'
        actionItemService.update( aim )
        controller.request.json = inputString
        controller.updateActionItemStatusRule()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertFalse data.success
        assertNotEquals 'null',data.message
    }


    @Test
    void statusSaveFailedCase() {
        controller.request.contentType = "text/json"
        def requestObj = [:]
        requestObj.title = ActionItemStatus.findByActionItemStatus( 'Completed' ).actionItemStatus
        controller.request.json = requestObj
        controller.statusSave()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertFalse data.success
        assertTrue data.fail
        assert data.message == 'Save failed. The status name must be unique.'
    }


    @Test
    void deleteGroup() {
        controller.request.contentType = "text/json"
        def requestObj = [:]
        requestObj.groupId = ActionItemGroup.findByName( 'Enrollment' ).id
        controller.request.json = requestObj
        controller.deleteGroup()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertFalse data.success
        assert data.message == 'The group is associated with a submitted Post Action Items job and cannot be deleted.'
    }


    @Test
    void deleteActionItem() {
        controller.request.contentType = "text/json"
        def requestObj = [:]
        requestObj.actionItemId = ActionItem.findByName( 'All staff: Prepare for winter snow' ).id
        controller.request.json = requestObj
        controller.deleteActionItem()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertFalse data.success
        assert data.message == 'The action item cannot be deleted because it has been posted to users.'
    }


    @Test
    void updateActionItemDetailWithTemplate() {
        controller.request.contentType = "text/json"
        def requestObj = [:]
        requestObj.actionItemId = null
        controller.request.json = requestObj
        controller.updateActionItemDetailWithTemplate()
        assertEquals 403, controller.response.status
    }


    @Test
    void fetchCurrentDateInLocaleFormat() {
        controller.request.contentType = "text/json"
        controller.fetchCurrentDateInLocaleFormat()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assert data.dateFormat == 'MM/dd/yyyy'
    }


    @Test
    void is12HourClock() {
        controller.request.contentType = "text/json"
        controller.is12HourClock()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assert data.use12HourClock == true
    }

    @Test
    void loadBlockingProcessLov() {
        controller.request.contentType = "text/json"
        controller.loadBlockingProcessLov()
        assertEquals 200, controller.response.status
        def data = JSON.parse( controller.response.contentAsString )
        assert data.persona != null
    }


    @Test
    void groupPosted() {
        controller.request.contentType = "text/json"
        controller.params.groupId = ActionItemGroup.findByName( 'International Students' ).id.toString()
        controller.groupPosted()
        assertEquals 200, controller.response.status
        def data = JSON.parse( controller.response.contentAsString )
        assert data.posted == true
    }


    @Test
    void checkActionItemPosted() {
        controller.request.contentType = "text/json"
        controller.params.actionItemId = ActionItem.findByName( 'Personal Information' ).id.toString()
        controller.checkActionItemPosted()
        assertEquals 200, controller.response.status
        def data = JSON.parse( controller.response.contentAsString )
        assert data.posted == true
    }


    @Test
    void blockedProcessList() {
        controller.request.contentType = "text/json"
        controller.params.actionItemId = ActionItem.findByName( 'Please Review the Attendance Policy' ).id.toString()
        controller.blockedProcessList()
        assertEquals 200, controller.response.status
        def data = JSON.parse( controller.response.contentAsString )
        assert data.actionItem.name == 'Please Review the Attendance Policy'
    }


    @Test
    void updateBlockedProcessItems() {
        controller.request.contentType = "text/json"
        ActionItem actionItem = ActionItem.findByName( 'The Declaration of Independence' )
        BlockingProcess blockingProcess = BlockingProcess.findByProcessName( 'Prepare for Registration' )
        [actionItemId: actionItem.id.toString(), globalBlockProcess: false, blockedProcesses: [[processId: blockingProcess.id, persona: 'STUDENT']]]
        String inputString = """{
        	"actionItemId": "${actionItem.id.toString()}",
        	"globalBlockProcess": false,
        	"blockedProcesses": [{
        			"processId": ${blockingProcess.id},
        			"persona": "EVERYONE"
        		}
        	]
        }"""
        controller.request.json = inputString
        controller.updateBlockedProcessItems()
        assertEquals 200, controller.response.status
        def data = JSON.parse( controller.response.contentAsString )
        assert data.success == true
    }

    @Test
    void checkMaxAttachmentVal() {
        controller.request.session.setAttribute("maxAttachment", 5)
        controller.request.contentType = "text/json"
        controller.getMaxAttachmentsVal()
        assertEquals 200, controller.response.status
        def data = JSON.parse( controller.response.contentAsString )
        assertEquals 5, data.maxAttachment
    }

    @Test
    void testCharMaxAttachmentVal() {
        Holders.config.aip.institution.maximum.attachment.number ='S'
        controller.request.contentType = "text/json"
        controller.getMaxAttachmentsVal()
        assertEquals 200, controller.response.status
        def data1 = JSON.parse( controller.response.contentAsString )
        assertEquals 10, data1.maxAttachment
    }

    @Test
    void testZeroMaxAttachmentVal() {
        Holders.config.aip.institution.maximum.attachment.number = 0
        controller.request.contentType = "text/json"
        controller.getMaxAttachmentsVal()
        assertEquals 200, controller.response.status
        def data1 = JSON.parse( controller.response.contentAsString )
        assertEquals 10, data1.maxAttachment
    }

    @Test
    void testnullMaxAttachmentVal() {
        Holders.config.aip.institution.maximum.attachment.number =''
        controller.request.contentType = "text/json"
        controller.getMaxAttachmentsVal()
        assertEquals 200, controller.response.status
        def data1 = JSON.parse( controller.response.contentAsString )
        assertEquals 10, data1.maxAttachment
    }

    @Test
    void testnegativeMaxAttachmentVal() {
        Holders.config.aip.institution.maximum.attachment.number =-1
        controller.request.contentType = "text/json"
        controller.getMaxAttachmentsVal()
        assertEquals 200, controller.response.status
        def data1 = JSON.parse( controller.response.contentAsString )
        assertEquals 10, data1.maxAttachment
    }

    private void setConfigProperties(String configName, def configValue) {
        ConfigProperties configProperties = ConfigProperties.fetchByConfigNameAndAppId(configName, 'GENERAL_SS')
        if (configProperties) {
            configProperties.configValue = configValue
            configProperties.save(flush: true, failOnError: true)
        }
    }

}
