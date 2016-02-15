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
//import net.hedtech.banner.student.session.StudentApplicationSessionManager
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder

/**
 * CsrControllerIntegrationTests.
 *
 * Date: 2/11/2016
 * Time: 9:18 AM
 */
class CsrControllerIntegrationTests extends BaseIntegrationTestCase {
    def selfServiceBannerAuthenticationProvider
    //def controller = new CsrController()
    //def actionItemListService


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
        //println controller.listItems()
        //controller = new CsrController()
        def person = PersonUtility.getPerson( "ADVA00006" )
        assertNotNull person
        def auth = selfServiceBannerAuthenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken( person.bannerId, '111111' ) )
        SecurityContextHolder.getContext().setAuthentication( auth )
        /*
        Long myNoteId = StudentNote.findBySummary( "And it’s likely they’d have killed him had not Casey raised his hand." ).id
        def result = controller.viewNote( myNoteId )
        assertEquals( 200, controller.response.status )
        */
       // def List<ActionItemList> getActionItems = actionItemListService.listActionItems()
        //assertFalse actionItemsList.isEmpty(  )

        println controller.actionItemsNew()
    }
}
