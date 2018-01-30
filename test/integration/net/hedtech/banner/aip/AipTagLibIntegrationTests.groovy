/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import net.hedtech.banner.aip.AipAdminController
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
        //formContext = ['SELFSERVICE']
        super.setUp()
        controller = new AipAdminController()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    def lib = new AipTagLib()

    // private or utility?
    @Test
    void testEncodeHtml() {
        assertEquals( "&lt;br&gt;", lib.encodeHTML( "<br>" ) )
        assertEquals( "&quot;", lib.encodeHTML( "\"" ) )
    }

    // FIXME: needs setup since 12/02/16 change
    // FIXME: need to parse and validate
    @Ignore
    @Test
    void testi18nEntry() {
        def answer = lib.i18n_aip_setup().toString()
        println answer
        assertTrue answer.contains( 'window.i18n_aip' )
        //assertTrue answer.contains( 'window.i18n_aip_bundle_plugins' ) // TODO: needed?
        //assertTrue answer.contains( 'window.i18n_aip_bundle' ) // TODO: needed?
        //assertTrue answer.contains( 'window.i18n_temp' )  // TODO: temp? code says to remove. why? Are we using it?
        assertTrue answer.contains( 'aip.user.detail.button.deny' ) // a string name
        assertTrue answer.contains( 'I do not agree with the university policy' ) // a value
    }

    //FIXME: need to parse and validate
    @Test
    void testAipVersion() {
        def answer = lib.aipVersion().toString()
        assertTrue answer.contains( 'window.aipApp' )
        assertTrue answer.contains( 'fileSystemName' )
        assertTrue answer.contains( 'bannerAipUi' )
        // TODO: add version and name
    }


    private Map parseTagLib( String raw ) {
        def map = [:]
        raw.splitEachLine( "," ) {
            it.each { x ->
                def object = x.split( "=" )
                map.put( object[0], object[1] )
            }
        }
        return map
    }
}
