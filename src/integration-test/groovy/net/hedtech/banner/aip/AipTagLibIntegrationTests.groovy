/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Ignore
import org.junit.Test
import org.springframework.beans.factory.annotation.Autowired

/**
 * AipTagLibIntegrationTests.
 */
@Integration
@Rollback
class AipTagLibIntegrationTests extends BaseIntegrationTestCase {

    @Autowired
    AipController controller
    def selfServiceBannerAuthenticationProvider

    @Before
    public void setUp() {
        formContext = ['SELFSERVICE']
        super.setUp()
    }


    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    def lib = new AipTagLib()

    @Test
    void testAipVersion() {
        def answer = lib.aipVersion().toString()
        assertTrue answer.contains( 'window.aipApp' )
        assertTrue answer.contains( 'fileSystemName' )
        assertTrue answer.contains( 'bannerAipUi' )
    }
}
