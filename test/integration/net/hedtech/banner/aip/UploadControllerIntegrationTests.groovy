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
 * UploadControllerIntegrationTests.
 */
class UploadControllerIntegrationTests extends BaseIntegrationTestCase {
    def selfServiceBannerAuthenticationProvider

    def uploadDocumentService


    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        controller = new UploadController()
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    @Test
    void testSaveUploadInfo() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def result = controller.saveuploadInfo()
        assertEquals 200, controller.response.status
    }

    @Test
    void testrestrictedAttachmentType() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def result = controller.getrestrictedAttachmetTypeVal()
        assertEquals 200, controller.response.status
        assertNotNull result.documentType
    }

    @Test
    void testAttachmentMaxSizeVal() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def result = controller.getAttachmentMaxSizeVal()
        assertEquals 200, controller.response.status
    }
}
