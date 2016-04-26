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
import net.hedtech.banner.exceptions.ApplicationException
import net.hedtech.banner.general.person.PersonUtility
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import net.hedtech.banner.general.communication.folder.CommunicationFolder

/**
 * AipGroupControllerIntegrationTests.
 *
 * Date: 4/25/2016
 * Time: 11:10 AM
 */
class AipGroupControllerIntegrationTests extends BaseIntegrationTestCase {
    def selfServiceBannerAuthenticationProvider

    def VALID_FOLDER_NAME = "My Folder"
    def VALID_FOLDER_DESCRIPTION = "My Folder"

    def INVALID_FOLDER_NAME = "My Folder".padLeft( 1021 )
    def INVALID_FOLDER_DESCRIPTION = "My Folder".padLeft( 4001 )


    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        //formContext = ['SELFSERVICE']
        super.setUp()
        controller = new AipGroupController()
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
        def folder =  JSON.parse(controller.response.contentAsString)
        println folder
    }

    @Test
    void testFoldersEntryPointAsAdmin() {
        def person = PersonUtility.getPerson( "BCMADMIN" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        controller.folders()
        def folder =  JSON.parse(controller.response.contentAsString)
        println folder
    }

    // using student. Fail on security?
    @Test
    void testAddFolderEntryPointAsStudent() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        String errorMessage = ""

        try {
            controller.addFolder(VALID_FOLDER_NAME, VALID_FOLDER_DESCRIPTION)
            def answer =  JSON.parse(controller.response.contentAsString)
            assertTrue(e.getMessage().toString().contains("@@r1:operation.not.authorized@@"))
            println answer
        }
        catch (ApplicationException e) {
            assertTrue(e.getMessage().toString().contains("@@r1:operation.not.authorized@@"))
            errorMessage = e.getMessage().toString()
        }
        println errorMessage
    }

    @Test
    void testAddFolderEntryPointAsAdmin() {
        def person = PersonUtility.getPerson( "BCMADMIN" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.addFolder(VALID_FOLDER_NAME, VALID_FOLDER_DESCRIPTION)
        def answer =  JSON.parse(controller.response.contentAsString)
        println answer
    }


    @Test
    void testCreateActionItemGroup() {

        def admin = PersonUtility.getPerson( "BCMADMIN" ) // role: advisor

        assertNotNull admin

        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( admin.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )

        def folderId = CommunicationFolder.fetchByName('AIPGeneral').id
        //println folder

        controller.params.groupTitle = "test group"
        controller.params.folderId = folderId
        controller.params.groupStatus = "folderId"
        controller.params.userId = "CSRADM001"

        controller.createGroup()
        def answer = JSON.parse( controller.response.contentAsString )
        println answer

    }

}