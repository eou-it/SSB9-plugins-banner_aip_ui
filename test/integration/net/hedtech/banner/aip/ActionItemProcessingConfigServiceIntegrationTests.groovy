/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test

/**
 * ActionItemProcessingConfigService.
 */
class ActionItemProcessingConfigServiceIntegrationTests extends BaseIntegrationTestCase {
    def actionItemProcessingConfigService


    @Before
    void setUp() {
        formContext = ['GUAGMNU']
        controller = new AipController()
        super.setUp()
        loginSSB( 'CSRSTU001', '111111' )
    }


    @After
    void tearDown() {
        super.tearDown()
        logout()
    }

    // using student. Fail on security?
    @Test
    void testAdminEntryPoint() {
        assertTrue actionItemProcessingConfigService.isActionItemPresentForUser()
    }
}
