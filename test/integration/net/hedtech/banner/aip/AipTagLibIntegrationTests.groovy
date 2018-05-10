/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Ignore
import org.junit.Test

/**
 * AipTagLibIntegrationTests.
 */
class AipTagLibIntegrationTests extends BaseIntegrationTestCase {

    @Before
    public void setUp() {
        formContext = ['GUAGMNU']
        super.setUp()
        controller = new AipAdminController()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    def lib = new AipTagLib()


    @Ignore
    @Test
    void testi18nEntry() {
        def answer = lib.i18n_aip_setup().toString()
        println answer
        assertTrue answer.contains( 'window.i18n_aip' )
        assertTrue answer.contains( 'aip.user.detail.button.deny' ) // a string name
        assertTrue answer.contains( 'I do not agree with the university policy' ) // a value
    }


    @Test
    void testAipVersion() {
        def answer = lib.aipVersion().toString()
        assertTrue answer.contains( 'window.aipApp' )
        assertTrue answer.contains( 'fileSystemName' )
        assertTrue answer.contains( 'bannerAipUi' )
    }
}
