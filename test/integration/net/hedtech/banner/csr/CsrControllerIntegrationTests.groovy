/** *****************************************************************************
 © 2016 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
package net.hedtech.banner.csr

import grails.converters.JSON
import grails.util.Holders
import net.hedtech.banner.general.person.PersonUtility
import net.hedtech.banner.security.BannerUser
import net.hedtech.banner.csr.ActionItemList
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextHolder as SCH

/**
 * CsrControllerIntegrationTests.
 *
 * Date: 2/11/2016
 * Time: 9:18 AM
 */
class CsrControllerIntegrationTests extends BaseIntegrationTestCase {
    def selfServiceBannerAuthenticationProvider
    def actionItemListService


    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        controller = new CsrController()
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }


    @Test
    void testFetchActionItems() {
        def person = PersonUtility.getPerson( "ADVA00006" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        controller.actionItems()
        assertEquals 200, controller.response.status
        def answer = JSON.parse( controller.response.contentAsString )
        println answer
    }
}
