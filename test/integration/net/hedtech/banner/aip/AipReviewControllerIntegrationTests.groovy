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
 * AipReviewControllerIntegrationTests.
 */
class AipReviewControllerIntegrationTests extends BaseIntegrationTestCase {

    def monitorActionItemCompositeService

    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        controller = new AipReviewController()
        super.setUp()
    }

    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    @Test
    void listActionItemNames() {
        def result =controller.fetchActionItemNames()
        def ActionItemList = JSON.parse( controller.response.contentAsString )
        assertNotNull( ActionItemList )
        assertTrue( ActionItemList.size() > 0 )

    }
}
