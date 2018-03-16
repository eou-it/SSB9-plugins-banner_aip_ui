/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.general.communication.population.CommunicationPopulationListView
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test

import java.text.SimpleDateFormat

/**
 * AipActionItemPostingControllerIntegrationTests.
 *
 */
class AipActionItemPostingControllerIntegrationTests extends BaseIntegrationTestCase {
    def actionItemProcessingCommonService
    def actionItemPostCompositeService


    @Before
    void setUp() {
        formContext = ['GUAGMNU']
        super.setUp()
        controller = new AipActionItemPostingController()
        loginSSB( 'AIPADM001', '111111' )
    }


    @After
    void tearDown() {
        super.tearDown()
        logout()
    }


    def getCreatActionItemJSON() {
        def dynamicData = getDynamicData()
        """{
            "postingName":"TEST_INTEGRATION_TEST",
            "postingActionItemGroupId":${dynamicData.postingActionItemGroupId},
            "actionItemIds":[${dynamicData.actionItemIds}],
            "populationId":${dynamicData.populationId},
            "displayStartDate":"${dynamicData.displayStartDate}",
            "displayEndDate":"${dynamicData.displayEndDate}",
            "postNow":"true",
            "populationRegenerateIndicator":false
            }"""
    }


    def getCreateActionItemForScheduleJSON() {
        def dynamicData = getDynamicDataForScheduledPosting()
        """{
            "postingName":"TEST_INTEGRATION_TEST",
            "postingActionItemGroupId":${dynamicData.postingActionItemGroupId},
            "actionItemIds":[${dynamicData.actionItemIds}],
            "populationId":${dynamicData.populationId},
            "displayStartDate":"${dynamicData.displayStartDate}",
            "displayEndDate":"${dynamicData.displayEndDate}",
            "postNow":"false",
            "scheduled":"true",
            "scheduledStartDate":"${dynamicData.scheduledStartDate}", 
            "scheduledStartTime":"${dynamicData.scheduledStartTime}", 
            "timezoneStringOffset":"${dynamicData.timezoneStringOffset}",
            "populationRegenerateIndicator":false
            }"""
    }


    def getCreateActionItemJSONWithoutName() {
        def dynamicData = getDynamicData()
        """{
                "postingName":"",
                "postingActionItemGroupId":${dynamicData.postingActionItemGroupId},
                "actionItemIds":[${dynamicData.actionItemIds}],
                "populationId":${dynamicData.populationId},
                "displayStartDate":"${dynamicData.displayStartDate}",
                "displayEndDate":"${dynamicData.displayEndDate}",
                "postNow":"true",
                "populationRegenerateIndicator":false
                }"""
    }


    @Test
    void addActionItemPosting() {
        controller.request.contentType = "text/json"
        String inputString = getCreatActionItemJSON()
        controller.request.json = inputString
        controller.addActionItemPosting()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.success
        assertNotNull data.savedJob.id
        assertNotNull data.savedJob.id
        assert data.savedJob.lastModifiedBy == 'AIPADM001'
        assert data.savedJob.postingCreatorId == 'AIPADM001'
        assert data.savedJob.postingName == 'TEST_INTEGRATION_TEST'
        assert data.savedJob.populationListId == dynamicData.populationId
        assert data.savedJob.postingActionItemGroupId == dynamicData.postingActionItemGroupId
    }


    @Test
    void addActionItemPostingWithScheduleDate() {
        controller.request.contentType = "text/json"
        String inputString = getCreateActionItemForScheduleJSON()
        controller.request.json = inputString
        controller.addActionItemPosting()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.success
        assertNotNull data.savedJob.id
        assertNotNull data.savedJob.id
        assert data.savedJob.lastModifiedBy == 'AIPADM001'
        assert data.savedJob.postingCreatorId == 'AIPADM001'
        assert data.savedJob.postingName == 'TEST_INTEGRATION_TEST'
        assert data.savedJob.populationListId == dynamicData.populationId
        assert data.savedJob.postingActionItemGroupId == dynamicData.postingActionItemGroupId
    }


    @Test
    void updateActionItemPostingWithScheduleDate() {
        controller.request.contentType = "text/json"
        String inputString = getCreateActionItemForScheduleJSON()
        controller.request.json = inputString
        controller.updateActionItemPosting()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.fail
    }


    @Test
    void addActionItemPostingFailedCase() {
        controller.request.contentType = "text/json"
        String inputString = getCreateActionItemJSONWithoutName()
        controller.request.json = inputString
        controller.addActionItemPosting()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.fail
        assert data.message == 'Posting Job Name is required'
    }


    @Test
    void populationListForSendLov() {
        controller.request.contentType = "text/json"
        controller.populationListForSendLov()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assert data.find {
            it.description.contains( 'All Students with ID beginning with CSRSTU' )
        }.description.contains( 'All Students with ID beginning with CSRSTU' ) == true
    }


    @Test
    void getGroupLov() {
        controller.request.contentType = "text/json"
        controller.getGroupLov()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assert data.find {it.groupName.contains( 'Enrollment' )}.groupName == 'Enrollment'
    }


    @Test
    void getActionGroupActionItemLov() {
        controller.request.contentType = "text/json"
        controller.params.searchParam = ActionItemGroup.findByName( 'Cultural and Entertainment Facilities' ).id
        controller.getActionGroupActionItemLov()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assert data.find {
            it.actionItemName.contains( 'Registration Process Training' )
        }.actionItemName == 'Registration Process Training'
    }


    @Test
    void getActionGroupActionItemLovParam() {
        controller.request.contentType = "text/json"
        controller.getActionGroupActionItemLov()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assert data.size() == 0
    }


    @Test
    void actionItemPostJobList() {
        SimpleDateFormat testingDateFormat = new SimpleDateFormat( 'MM/dd/yyyy' )
        CommunicationPopulationListView populationListView = actionItemProcessingCommonService.fetchPopulationListForSend( 'p', [max: 10, offset: 0] )[0]
        List<ActionItemGroup> actionItemGroups = ActionItemGroup.fetchActionItemGroups()
        def actionItemGroup = actionItemGroups[0]
        List<Long> actionItemIds = ActionItemGroupAssign.fetchByGroupId( actionItemGroup.id ).collect {it.actionItemId}
        def requestMap = [:]
        requestMap.postingName = 'TEST_INTEGRATION_TEST'
        requestMap.populationId = populationListView.id
        requestMap.referenceId = UUID.randomUUID().toString()
        requestMap.postingActionItemGroupId = actionItemGroup.id
        requestMap.postNow = true
        requestMap.recalculateOnPost = false
        requestMap.displayStartDate = testingDateFormat.format( new Date() )
        requestMap.displayEndDate = testingDateFormat.format( new Date() + 50 )
        requestMap.scheduledStartDate = new Date() + 1
        requestMap.actionItemIds = actionItemIds
        actionItemPostCompositeService.sendAsynchronousPostItem( requestMap )
        controller.request.contentType = "text/json"
        controller.params.searchParam = null
        controller.params.max = 1000
        controller.params.offset = 0
        controller.actionItemPostJobList()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.result.find {it.postingName == 'TEST_INTEGRATION_TEST'}.postingName == 'TEST_INTEGRATION_TEST'

    }


    @Test
    void getStatusValue() {
        SimpleDateFormat testingDateFormat = new SimpleDateFormat( 'MM/dd/yyyy' )
        CommunicationPopulationListView populationListView = actionItemProcessingCommonService.fetchPopulationListForSend( 'p', [max: 10, offset: 0] )[0]
        List<ActionItemGroup> actionItemGroups = ActionItemGroup.fetchActionItemGroups()
        def actionItemGroup = actionItemGroups[0]
        List<Long> actionItemIds = ActionItemGroupAssign.fetchByGroupId( actionItemGroup.id ).collect {it.actionItemId}
        def requestMap = [:]
        requestMap.postingName = 'TEST_INTEGRATION_TEST1'
        requestMap.populationId = populationListView.id
        requestMap.referenceId = UUID.randomUUID().toString()
        requestMap.postingActionItemGroupId = actionItemGroup.id
        requestMap.postNow = true
        requestMap.recalculateOnPost = false
        requestMap.displayStartDate = testingDateFormat.format( new Date() )
        requestMap.displayEndDate = testingDateFormat.format( new Date() + 50 )
        requestMap.scheduledStartDate = new Date() + 1
        requestMap.actionItemIds = actionItemIds
        def postingId = actionItemPostCompositeService.sendAsynchronousPostItem( requestMap ).savedJob.id
        controller.request.contentType = "text/json"
        controller.params.postID = postingId
        controller.getStatusValue()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue ret == 'N'

    }


    @Test
    void getJobDetailsByPostId() {
        SimpleDateFormat testingDateFormat = new SimpleDateFormat( 'MM/dd/yyyy' )
        CommunicationPopulationListView populationListView = actionItemProcessingCommonService.fetchPopulationListForSend( 'p', [max: 10, offset: 0] )[0]
        List<ActionItemGroup> actionItemGroups = ActionItemGroup.fetchActionItemGroups()
        def actionItemGroup = actionItemGroups[0]
        List<Long> actionItemIds = ActionItemGroupAssign.fetchByGroupId( actionItemGroup.id ).collect {it.actionItemId}
        def requestMap = [:]
        requestMap.postingName = 'TEST_INTEGRATION_TEST1'
        requestMap.populationId = populationListView.id
        requestMap.referenceId = UUID.randomUUID().toString()
        requestMap.postingActionItemGroupId = actionItemGroup.id
        requestMap.postNow = true
        requestMap.recalculateOnPost = false
        requestMap.displayStartDate = testingDateFormat.format( new Date() )
        requestMap.displayEndDate = testingDateFormat.format( new Date() + 50 )
        requestMap.scheduledStartDate = new Date() + 1
        requestMap.actionItemIds = actionItemIds
        def postingId = actionItemPostCompositeService.sendAsynchronousPostItem( requestMap ).savedJob.id
        controller.request.contentType = "text/json"
        controller.params.postID = postingId
        controller.getJobDetailsByPostId()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data.postingName == 'TEST_INTEGRATION_TEST1'

    }


    @Test
    void getActionItemByPostId() {
        SimpleDateFormat testingDateFormat = new SimpleDateFormat( 'MM/dd/yyyy' )
        CommunicationPopulationListView populationListView = actionItemProcessingCommonService.fetchPopulationListForSend( 'p', [max: 10, offset: 0] )[0]
        List<ActionItemGroup> actionItemGroups = ActionItemGroup.fetchActionItemGroups()
        def actionItemGroup = actionItemGroups[0]
        List<Long> actionItemIds = ActionItemGroupAssign.fetchByGroupId( actionItemGroup.id ).collect {it.actionItemId}
        def requestMap = [:]
        requestMap.postingName = 'TEST_INTEGRATION_TEST1'
        requestMap.populationId = populationListView.id
        requestMap.referenceId = UUID.randomUUID().toString()
        requestMap.postingActionItemGroupId = actionItemGroup.id
        requestMap.postNow = true
        requestMap.recalculateOnPost = false
        requestMap.displayStartDate = testingDateFormat.format( new Date() )
        requestMap.displayEndDate = testingDateFormat.format( new Date() + 50 )
        requestMap.scheduledStartDate = new Date() + 1
        requestMap.actionItemIds = actionItemIds
        def postingId = actionItemPostCompositeService.sendAsynchronousPostItem( requestMap ).savedJob.id
        controller.request.contentType = "text/json"
        controller.params.postID = postingId
        controller.getActionItemByPostId()
        assertEquals 200, controller.response.status
        def ret = controller.response.contentAsString
        def data = JSON.parse( ret )
        assertTrue data != null

    }


    private getDynamicData() {
        def dynamicData = [:]
        SimpleDateFormat testingDateFormat = new SimpleDateFormat( 'MM/dd/yyyy' )
        CommunicationPopulationListView populationListView = actionItemProcessingCommonService.fetchPopulationListForSend( 'p', [max: 10, offset: 0] )[0]
        List<ActionItemGroup> actionItemGroups = ActionItemGroup.fetchActionItemGroups()
        def actionItemGroup = actionItemGroups[0]
        List<Long> actionItemIds = ActionItemGroupAssign.fetchByGroupId( actionItemGroup.id ).collect {it.actionItemId}
        dynamicData.actionItemIds = actionItemIds[0]
        dynamicData.populationId = populationListView.id
        dynamicData.postingActionItemGroupId = actionItemGroup.id
        dynamicData.displayStartDate = testingDateFormat.format( new Date() )
        dynamicData.displayEndDate = testingDateFormat.format( new Date() + 50 )
        dynamicData
    }


    private getDynamicDataForScheduledPosting() {
        def dynamicData = [:]
        SimpleDateFormat testingDateFormat = new SimpleDateFormat( 'MM/dd/yyyy' )
        CommunicationPopulationListView populationListView = actionItemProcessingCommonService.fetchPopulationListForSend( 'p', [max: 10, offset: 0] )[0]
        List<ActionItemGroup> actionItemGroups = ActionItemGroup.fetchActionItemGroups()
        def actionItemGroup = actionItemGroups[0]
        List<Long> actionItemIds = ActionItemGroupAssign.fetchByGroupId( actionItemGroup.id ).collect {it.actionItemId}
        dynamicData.actionItemIds = actionItemIds[0]
        dynamicData.populationId = populationListView.id
        dynamicData.postingActionItemGroupId = actionItemGroup.id
        dynamicData.displayStartDate = testingDateFormat.format( new Date() )
        dynamicData.displayEndDate = testingDateFormat.format( new Date() + 50 )
        dynamicData.scheduledStartDate = testingDateFormat.format( new Date() + 1 )
        dynamicData.scheduledStartTime = "2230"
        dynamicData.timezoneStringOffset = "Asia/Kolkata"
        dynamicData
    }

}
