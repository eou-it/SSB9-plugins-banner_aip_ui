/*********************************************************************************
 Copyright 2019 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.general.configuration.ConfigApplication
import net.hedtech.banner.general.configuration.ConfigProperties
import net.hedtech.banner.general.person.PersonUtility
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.apache.commons.io.IOUtils
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.mock.web.MockMultipartFile
import org.springframework.web.multipart.MultipartFile
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback

/**
 * AipReviewControllerIntegrationTests.
 */
@Integration
@Rollback
class AipReviewControllerIntegrationTests extends BaseIntegrationTestCase {

    @Autowired
    AipReviewController controller

    def monitorActionItemCompositeService
    def uploadDocumentCompositeService
    def userActionItemReadOnlyCompositeService
    ActionItem drugAndAlcoholPolicyActionItem;

   

    @Before
    public void setUp() {
        formContext = ['SELFSERVICE']
        //controller = new AipReviewController()
        super.setUp()
       /* def auth = selfServiceBannerAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken('AIPADM001', '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertNotNull auth*/
       // loginSSB('AIPADM001', '111111')
        drugAndAlcoholPolicyActionItem = ActionItem.findByName("Drug and Alcohol Policy")
        assertNotNull drugAndAlcoholPolicyActionItem
    }

    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    @Test
    void listActionItemNames() {
        def person = PersonUtility.getPerson( "AIPADM001" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.fetchActionItemNames()
        def ActionItemList = JSON.parse( controller.response.contentAsString )
        assertNotNull( ActionItemList )
        assertTrue( ActionItemList.size() > 0 )

    }

    //ActionID + personID test case
    @Test
    void searchActionItemsByActionIdAndExsitingPersonID() {

        controller.params.actionItemId = drugAndAlcoholPolicyActionItem.id.toString()
        controller.params.sortColumnName="spridenId"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 1, jsonResp.result.size()
        assertEquals 1, jsonResp.length
        assertEquals "CSRSTU001", jsonResp.result.get(0).spridenId
    }


    @Test
    void searchActionItemsByActionIdAndNonExsitingPersonID() {

        controller.params.actionItemId= drugAndAlcoholPolicyActionItem.id.toString()
        controller.params.personId = "CSRSTABCD"
        controller.request.contentType = "text/json"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length

    }


    @Test
    void searchActionItemsByNonExistingActionIdAndExisitingPersonID() {

        controller.params.actionItemId= "98989"
        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"
        controller.params.sortColumnName="spridenId"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"


        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length

    }


    @Test
    void searchActionItemsByActionIdAndNonExsitingPersonName() {

        controller.params.actionItemId= drugAndAlcoholPolicyActionItem.id.toString()
        controller.params.personName = "Osama Bin Ladden"
        controller.request.contentType = "text/json"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"


        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length

    }

    @Test
    void searchActionItemsByNonExistingActionIdAndPersonName() {

        controller.params.actionItemId= "32323233"
        controller.params.personName = "Cliff Starr"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length

    }

    @Test
    void searchActionItemsBygActionIdAndPartialPersonName() {

        controller.params.actionItemId= drugAndAlcoholPolicyActionItem.id.toString()
        controller.params.personName = "Cliff"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 1, jsonResp.length
    }

    //action item only

    @Test
    void searchActionItemsByActionItemOnly() {

        controller.params.actionItemId= drugAndAlcoholPolicyActionItem.id.toString()

        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertTrue(jsonResp.length > 0)
        def row1 = jsonResp.result[0]
        def row2 = jsonResp.result[1]
        assertNotEquals row1, row2
    }

    @Test
    void searchActionItemsByActionItemOnlyNonExsistingActionItem() {

        controller.params.actionItemId= "999998"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length
    }

    //person Id only
    @Test
    void searchActionItemByPersonIdOnly() {

        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 5, jsonResp.length

        def row1 = jsonResp.result[0]
        def row2 = jsonResp.result[1]
        assertNotEquals row1, row2

    }

    @Test
    void searchActionItemByPersonIdOnlyNonExisting() {

        controller.params.personId = "CSRQWERTY"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length
    }



      @Test
    void searchActionItemByNameOnlyPartial() {
        controller.params.personName = "Cliff"
        controller.request.contentType = "text/json"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status

        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 6, jsonResp.length
        //test unique values
        def row1 = jsonResp.result[0]
        def row2 = jsonResp.result[1]
        assertNotEquals row1, row2
    }

    @Test
    void searchActionItemByNameNonExisting() {
        controller.params.personName = "Osama Bin Ladden"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length
    }

    @Test
    void getContactInformation() {
        controller.request.contentType = "text/json"
        controller.getContactInformation()
        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def configDataList = JSON.parse(response)
        assertNotNull configDataList
    }

    @Test
    void getReviewStatusList() {
        def result = monitorActionItemCompositeService.getReviewStatusList()
        assertNotNull result
        controller.request.contentType = "text/json"
        controller.getReviewStatusList()
        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
    }

    @Test
    void updateActionItemReviewInvalid() {
        controller.request.contentType = "text/json"
        controller.updateActionItemReview()
        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def result = JSON.parse(response)
        assertNotNull result
        assertEquals false , result.success
    }

    @Test
    void getActionItem() {

        def authPerson = PersonUtility.getPerson( "CSRSTU004" )
        assertNotNull authPerson
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( authPerson.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def actionItemResult = userActionItemReadOnlyCompositeService.listActionItemByPidmWithinDate()
        assert actionItemResult.groups.size() > 0
        assert actionItemResult.groups.items.size() > 0
        def group = actionItemResult.groups.find{it.title == 'Enrollment'}
        def item = group.items.find {it.name == 'Drug and Alcohol Policy'}
        assert item.name == 'Drug and Alcohol Policy'
        Long actionItemId = item.id
        def person = PersonUtility.getPerson( "CSRSTU004" )
        List<UserActionItem> gcraactIdList = UserActionItem.fetchUserActionItemsByPidm(person.pidm)
        UserActionItem gcraact = gcraactIdList.find { it.actionItemId = actionItemId }
        def userActionItemId = gcraact.id
        controller.params.userActionItemID= userActionItemId
        controller.request.contentType = "text/json"
        def result = monitorActionItemCompositeService.getActionItem(userActionItemId)
        assertNotNull result
        controller.getActionItem()
        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
    }

    @Test
    void listDocuments() {
        setConfigProperties('aip.attachment.file.storage.location', 'AIP', 'string')
        def authPerson = PersonUtility.getPerson( "CSRSTU004" )
        assertNotNull authPerson
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( authPerson.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def actionItemResult = userActionItemReadOnlyCompositeService.listActionItemByPidmWithinDate()
        assert actionItemResult.groups.size() > 0
        assert actionItemResult.groups.items.size() > 0
        def group = actionItemResult.groups.find{it.title == 'Enrollment'}
        def item = group.items.find {it.name == 'Personal Information'}
        assert item.name == 'Personal Information'
        Long actionItemId = item.id
        def person = PersonUtility.getPerson( "CSRSTU004" )
        List<UserActionItem> gcraactIdList = UserActionItem.fetchUserActionItemsByPidm(person.pidm)
        UserActionItem gcraact = gcraactIdList.find { it.actionItemId = actionItemId }
        def userActionItemId = gcraact.id

        List<ActionItemStatusRule> responsesList = ActionItemStatusRule.fetchActionItemStatusRulesByActionItemId(actionItemId)
        ActionItemStatusRule response = responsesList.find { it.labelText == 'Not in my life time.' }
        def responseId = response.id

        def saveResult = saveUploadDocumentService(userActionItemId, responseId, 'AIPTestFileTXT.txt')
        assert saveResult.success == true
        def paramsObj = [
                userActionItemId: userActionItemId,
                responseId      : responseId,
                sortColumn      : "id",
                sortAscending   : false
        ]
        def docResponse = uploadDocumentCompositeService.fetchDocuments(paramsObj)
        assert docResponse.result.size() > 0
        assert docResponse.length > 0

        controller.params.userActionItemId = userActionItemId.toString()
        controller.params.responseId = responseId.toString()
        controller.params.sortColumn = "id"
        controller.params.sortAscending = false
        controller.request.contentType = "text/json"
        controller.listDocuments()
        def controllerResponse = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def result = JSON.parse(controllerResponse)
        assertNotNull result
    }


    /**
     * Form file Object
     */
    private MockMultipartFile formFileObject(filename) {
        File testFile
        try {
            String data = " Test data for integration testing"
            String tempPath = "test/data"
            tempPath = System.getProperty("user.dir") + File.separator+"build"+File.separator+"tmp"
            testFile = new File(tempPath, filename)
            if (!testFile.exists()) {
                testFile.createNewFile()
                FileWriter fileWritter = new FileWriter(testFile, true)
                BufferedWriter bufferWritter = new BufferedWriter(fileWritter)
                bufferWritter.write(data)
                bufferWritter.close()
            }
        } catch (IOException e) {
            throw e
        }
        FileInputStream input = new FileInputStream(testFile);
        MultipartFile multipartFile = new MockMultipartFile("file",
                testFile.getName(), "text/plain", IOUtils.toByteArray(input))
        multipartFile
    }


    private def saveUploadDocumentService(userActionItemId, responseId, fileName) {
        MockMultipartFile multipartFile = formFileObject(fileName)
        def result = uploadDocumentCompositeService.addDocument(
                [userActionItemId: userActionItemId, responseId: responseId, documentName: fileName, documentUploadedDate: new Date(), fileLocation: 'AIP', file: multipartFile])
        result
    }


    private void setConfigProperties(String configName, String configValue, String configType) {
        ConfigProperties configProperties = ConfigProperties.fetchByConfigNameAndAppId(configName, 'GENERAL_SS')
        if (configProperties) {
            configProperties.configValue = configValue
            configProperties.save(flush: true, failOnError: true)
        } else {
            ConfigApplication configApplication = ConfigApplication.fetchByAppId('GENERAL_SS')
            if (!configApplication) {
                configApplication = new ConfigApplication(
                        lastModified: new Date(),
                        appName: 'BannerGeneralSsb',
                        appId: 'GENERAL_SS'
                )
                configApplication.save(failOnError: true, flush: true)
                configApplication = configApplication.refresh()
            }
            configProperties = new ConfigProperties(
                    configName: configName,
                    configType: configType,
                    configValue: configValue,
                    configComment: 'TEST_COMMENT'
            )
            configProperties.setConfigApplication(configApplication)
            configProperties.save(failOnError: true, flush: true)
        }

    }


}
