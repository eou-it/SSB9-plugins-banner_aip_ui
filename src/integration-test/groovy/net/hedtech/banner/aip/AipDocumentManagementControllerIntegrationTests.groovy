/*********************************************************************************
 Copyright 2019 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import grails.converters.JSON
import net.hedtech.banner.general.configuration.ConfigApplication
import net.hedtech.banner.general.configuration.ConfigProperties
import net.hedtech.banner.general.person.PersonUtility
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.apache.commons.fileupload.FileItem
import org.apache.commons.fileupload.disk.DiskFileItemFactory
import org.apache.commons.io.IOUtils
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.mock.web.MockMultipartFile
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.commons.CommonsMultipartFile
import org.springframework.web.multipart.support.DefaultMultipartHttpServletRequest
import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback

/**
 * UploadControllerIntegrationTests.
 */
@Integration
@Rollback
class AipDocumentManagementControllerIntegrationTests extends BaseIntegrationTestCase {

    @Autowired
    AipDocumentManagementController controller

    def selfServiceBannerAuthenticationProvider
    def userActionItemReadOnlyCompositeService

    def userActionItemId
    def responseId
    def person;
    def auth;
    def uploadDocumentCompositeService;


    @Before
    public void setUp() {
        formContext = ['SELFSERVICE']
        /*controller = new AipDocumentManagementController();
        def auth = selfServiceBannerAuthenticationProvider.authenticate(new UsernamePasswordAuthenticationToken('CSRSTU004', '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertNotNull auth*/
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }


    void testUploadEmptyDocument() {
        def person = PersonUtility.getPerson("CSRSTU004")
        assertNotNull person

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)

        def pidm = auth?.pidm
        assertNotNull pidm

        def userActionItem = getActionItemIdPersonalInformation(pidm);
        assertNotNull userActionItem

        def multipartParameters = [userActionItemId: ["${userActionItem.actionItemId}"],
                                   responseId      : ["${userActionItem.responseId}"],
                                   documentName    : ["TestFile2.txt"]
        ]
        def mpfile = new LinkedMultiValueMap<String, MultipartFile>();
        mpfile.add("file", formFileObject("TestFile2.txt", ""));

        def mpParamContentType = ["Content-Type": "multipart/form-data"]

        DefaultMultipartHttpServletRequest defaultMultipartHttpServletRequest = new DefaultMultipartHttpServletRequest(controller.request, mpfile, multipartParameters, mpParamContentType)
        controller.class.metaClass.request = defaultMultipartHttpServletRequest

        controller.uploadDocument()
        assertEquals 200, controller.response.status

        def jsonResponse = JSON.parse(controller.response.contentAsString)
        assertNotNull jsonResponse
        assertFalse jsonResponse.success
        assertEquals "Save failed. Empty document can not be uploaded.", jsonResponse.message

    }


    @Test
    void testUploadExeDocument() {
        setConfigProperties('aip.restricted.attachment.type', '[EXE]', 'list')
        println uploadDocumentCompositeService.getRestrictedFileTypes()

        def person = PersonUtility.getPerson("CSRSTU004")
        assertNotNull person

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)

        def pidm = auth?.pidm
        assertNotNull pidm

        def userActionItem = getActionItemIdPersonalInformation(pidm);
        assertNotNull userActionItem


        def multipartParameters = [userActionItemId: ["${userActionItem.actionItemId}"],
                                   responseId      : ["${userActionItem.responseId}"],
                                   documentName    : ["TestFile.exe"]
        ]
        def mpfile = new LinkedMultiValueMap<String, MultipartFile>();
        mpfile.add("file", formFileObject("TestFile.exe"));

        def mpParamContentType = ["Content-Type": "multipart/form-data"]

        DefaultMultipartHttpServletRequest defaultMultipartHttpServletRequest = new DefaultMultipartHttpServletRequest(controller.request, mpfile, multipartParameters, mpParamContentType)
        controller.class.metaClass.request = defaultMultipartHttpServletRequest

        controller.uploadDocument()
        assertEquals 200, controller.response.status

        def jsonResponse = JSON.parse(controller.response.contentAsString)
        assertNotNull jsonResponse
        assertFalse jsonResponse.success
        assertEquals "Selected file type is not allowed.", jsonResponse.message
    }


    void testMaximumAttachmentCountError() {
        def person = PersonUtility.getPerson("CSRSTU004")
        assertNotNull person

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)

        def pidm = auth?.pidm
        assertNotNull pidm

        def userActionItem = getActionItemIdInternationalStudents(pidm);



        def multipartParameters = [userActionItemId: ["${userActionItem.actionItemId}"],
                                   responseId      : ["${userActionItem.responseId.toString()}"],
                                   documentName    : ["TestFile.txt"]
        ]
        def mpfile = new LinkedMultiValueMap<String, MultipartFile>();
        mpfile.add("file", formFileObject("TestFile.txt"));

        def mpParamContentType = ["Content-Type": "multipart/form-data"]

        DefaultMultipartHttpServletRequest defaultMultipartHttpServletRequest = new DefaultMultipartHttpServletRequest(controller.request, mpfile, multipartParameters, mpParamContentType)
        controller.class.metaClass.request = defaultMultipartHttpServletRequest

        controller.uploadDocument()
        assertEquals 200, controller.response.status

        def jsonResponse = JSON.parse(controller.response.contentAsString)
        assertNotNull jsonResponse
        assertFalse jsonResponse.success
        assertEquals "Maximum attachment count exceeded.", jsonResponse.message
    }

    @Test
    void testRestrictedFileTypes() {
        def person = PersonUtility.getPerson("CSRSTU002")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        controller.restrictedFileTypes()
        assertEquals 200, controller.response.status
        def data = JSON.parse(controller.response.contentAsString)
        assertNotNull data.restrictedFileTypes
    }

    @Test
    void testMaxFileSize() {
        def person = PersonUtility.getPerson("CSRSTU002")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        controller.maxFileSize()
        assertEquals 200, controller.response.status
        def data = JSON.parse(controller.response.contentAsString)
        assertNotNull data.maxFileSize
    }


    @Test
    void testGetRestrictedFileTypes() {
        setConfigProperties('aip.restricted.attachment.type', '[EXE]', 'list')
        def person = PersonUtility.getPerson("CSRSTU002")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertNotNull controller.getRestrictedFileTypes()
    }

    @Test
    void testGetMaxFileSize() {
        setConfigProperties('aip.allowed.attachment.max.size', '26214400', 'string')
        def person = PersonUtility.getPerson("CSRSTU002")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertNotNull controller.getMaxFileSize()
    }

    @Test
    void testMaxFileSizeValidation() {
        setConfigProperties('aip.allowed.attachment.max.size', '26214400', 'string')
        def person = PersonUtility.getPerson("CSRSTU002")
        int fileSize = 1024
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertTrue(controller.maxFileSizeValidation(fileSize))
    }

    @Test
    void testAllowedRestrictedFileTypesValidation() {
        setConfigProperties('aip.restricted.attachment.type', '[EXE]', 'list')
        def person = PersonUtility.getPerson("CSRSTU002")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertTrue(controller.restrictedFileTypesValidation("AIPTestFile.txt"))
    }

    @Test
    void testRestrictedFileTypesValidation() {
        setConfigProperties('aip.restricted.attachment.type', '[EXE]', 'list')
        def person = PersonUtility.getPerson("CSRSTU002")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertFalse(controller.restrictedFileTypesValidation("AIPTestFile.EXE"))
    }

    @Test
    void testFileExtension() {
        def person = PersonUtility.getPerson("CSRSTU002")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        assertEquals(controller.getFileExtension("AIPTestFile.doc"), "doc")
    }

    /**
     * Form file Object
     */
    private def formFileObject(filename, content = " Test data for integration testing and not empty file") {
        File testFile
        try {
            String data = content
            String tempPath = System.getProperty("base.dir") + File.separator+"test"+File.separator+"data"
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
        File input = new File(testFile.getAbsolutePath());
        DiskFileItemFactory factory = new DiskFileItemFactory();
        FileItem fileItem = factory.createItem("file", "text/plain", true, input.getAbsolutePath())
        fileItem.getOutputStream()
        CommonsMultipartFile multipartFile = new CommonsMultipartFile(fileItem)
        multipartFile
    }


    def getActionItemIdPersonalInformation(def pidm) {
        Long actionItemId;
        def result = userActionItemReadOnlyCompositeService.listActionItemByPidmWithinDate()
        def group = result.groups.find { it.title == 'Enrollment' }
        def item = group.items.find { it.name == 'Personal Information' }
        actionItemId = item.id

        List<UserActionItem> gcraactIdList = UserActionItem.fetchUserActionItemsByPidm(pidm)
        UserActionItem gcraact = gcraactIdList.find { it.actionItemId = actionItemId }


        List<ActionItemStatusRule> responsesList = ActionItemStatusRule.fetchActionItemStatusRulesByActionItemId(actionItemId)
        ActionItemStatusRule response = responsesList.find { it.labelText == 'Not in my life time.' }
        response.id

        return [actionItemId: gcraact.id,
                responseId  : response.id]

    }


    def getActionItemIdInternationalStudents(def pidm) {
        Long actionItemId;
        def result = userActionItemReadOnlyCompositeService.listActionItemByPidmWithinDate()
        def group = result.groups.find { it.title == 'Proof of GCBACTM_TITLE' }
        def item = group.items.find { it.name == 'Proof of Residence' }
        actionItemId = item.id

        List<UserActionItem> gcraactIdList = UserActionItem.fetchUserActionItemsByPidm(pidm)
        UserActionItem gcraact = gcraactIdList.find { it.actionItemId = actionItemId }


        List<ActionItemStatusRule> responsesList = ActionItemStatusRule.fetchActionItemStatusRulesByActionItemId(actionItemId)
        ActionItemStatusRule response = responsesList.find { it.labelText == 'I do not think so.' }
        response.id

        return [actionItemId: gcraact.id,
                responseId  : response.id]

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

    @Test
    void testPreviewDocument() {
        def person = PersonUtility.getPerson("CSRSTU001")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        def pidm = auth.pidm
        assertNotNull pidm

        def actionItemdata = getActionItemIdPersonalInformation(pidm)
        assertNotNull actionItemdata
        def saveResult = saveUploadDocumentService(actionItemdata.actionItemId, actionItemdata.responseId, 'AIPTestFileTXT.txt')
        assertNotNull saveResult

        def paramsObj = [
                userActionItemId: actionItemdata.actionItemId.toString(),
                responseId      : actionItemdata.responseId.toString(),
                sortColumn      : "id",
                sortAscending   : false
        ]
        def response = uploadDocumentCompositeService.fetchDocuments(paramsObj)
        controller.request.json = '{documentId:"'+response.result[0].id+'"}'
        controller.previewDocument()
        assertEquals 200, controller.response.status
    }


    @Test
    void testDeleteDocument() {
        def person = PersonUtility.getPerson("CSRSTU001")
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(person.bannerId, '111111'))
        SecurityContextHolder.getContext().setAuthentication(auth)
        def pidm = auth.pidm
        assertNotNull pidm

        def actionItemdata = getActionItemIdPersonalInformation(pidm)
        assertNotNull actionItemdata
        def saveResult = saveUploadDocumentService(actionItemdata.actionItemId, actionItemdata.responseId, 'AIPTestFileTXT.txt')
        assertNotNull saveResult

        def paramsObj = [
                userActionItemId: actionItemdata.actionItemId.toString(),
                responseId      : actionItemdata.responseId.toString(),
                sortColumn      : "id",
                sortAscending   : false
        ]
        def response = uploadDocumentCompositeService.fetchDocuments(paramsObj)
        controller.request.json = '{documentId:"'+response.result[0].id+'"}'
        controller.deleteDocument()
        assertEquals 200, controller.response.status
    }

    private def saveUploadDocumentService(userActionItemId, responseId, fileName) {
        MockMultipartFile multipartFile = formFileObjectMockMultipartFile(fileName)
        def result = uploadDocumentCompositeService.addDocument(
                [userActionItemId: userActionItemId, responseId: responseId, documentName: fileName, documentUploadedDate: new Date(), fileLocation: 'AIP', file: multipartFile])
        result
    }

    private MockMultipartFile formFileObjectMockMultipartFile(filename) {
        File testFile
        try {
            String data = " Test data for integration testing"
            String tempPath = System.getProperty("base.dir") + File.separator+"test"+File.separator+"data"
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


}
