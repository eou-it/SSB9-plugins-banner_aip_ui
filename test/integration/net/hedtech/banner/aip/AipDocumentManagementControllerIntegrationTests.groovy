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
class AipDocumentManagementControllerIntegrationTests extends BaseIntegrationTestCase {

    def selfServiceBannerAuthenticationProvider

    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        controller = new AipDocumentManagementController()
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    @Test
    void testUploadDocument() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        def result = controller.uploadDocument()
        assertEquals 200, controller.response.status
    }

    @Test
    void testRestrictedAttachmentType() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.getRestrictedAttachmentTypeVal()
        assertEquals 200, controller.response.status
        def data = JSON.parse( controller.response.contentAsString )
        assertNotNull data.restrictedFileTypes
    }

    @Test
    void testAttachmentMaxSizeVal() {
        def person = PersonUtility.getPerson( "CSRSTU002" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.getAttachmentMaxSizeVal()
        assertEquals 200, controller.response.status
        def data = JSON.parse( controller.response.contentAsString )
        assertNotNull data.maxFileSize
    }

}
