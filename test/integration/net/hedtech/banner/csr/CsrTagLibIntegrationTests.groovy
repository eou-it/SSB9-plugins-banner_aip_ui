/** *****************************************************************************
 © 2016 SunGard Higher Education.  All Rights Reserved.

 CONFIDENTIAL BUSINESS INFORMATION

 THIS PROGRAM IS PROPRIETARY INFORMATION OF SUNGARD HIGHER EDUCATION
 AND IS NOT TO BE COPIED, REPRODUCED, LENT, OR DISPOSED OF,
 NOR USED FOR ANY PURPOSE OTHER THAN THAT WHICH IT IS SPECIFICALLY PROVIDED
 WITHOUT THE WRITTEN PERMISSION OF THE SAID COMPANY
 ****************************************************************************** */
package net.hedtech.banner.csr

import net.hedtech.banner.aip.AipGroupController
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test

/**
 * CsrTagLibIntegrationTests.
 *
 * Date: 6/1/2016
 * Time: 9:52 AM
 */
class CsrTagLibIntegrationTests extends BaseIntegrationTestCase {

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

    def lib = new CsrTagLib()


    @Test
    void testEncodeHtml() {
        assertEquals( "&lt;br&gt;", lib.encodeHTML( "<br>" ))
        assertEquals( "&quot;", lib.encodeHTML( "\"" ))
    }


    @Test
    void testi18nEntry() {
    }


    @Test
    void testiAipVersion() {
    }
}

