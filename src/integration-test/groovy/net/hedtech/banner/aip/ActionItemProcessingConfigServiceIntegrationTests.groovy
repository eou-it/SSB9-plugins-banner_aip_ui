/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

import net.hedtech.banner.testing.BaseIntegrationTestCase
import org.junit.After
import org.junit.Before
import org.junit.Test
import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder

/**
 * ActionItemProcessingConfigService.
 */
@Integration
@Rollback
class ActionItemProcessingConfigServiceIntegrationTests extends BaseIntegrationTestCase {
    def actionItemProcessingConfigService
    def selfServiceBannerAuthenticationProvider


    @Before
    void setUp() {
        formContext = ['SELFSERVICE']
       // controller = new AipController()
        super.setUp()
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
