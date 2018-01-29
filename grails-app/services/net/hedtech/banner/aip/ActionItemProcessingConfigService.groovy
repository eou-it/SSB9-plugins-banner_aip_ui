/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
package net.hedtech.banner.aip

class ActionItemProcessingConfigService {

    def springSecurityService
    def userActionItemReadOnlyService

    /**
     * Check if Action Item present for logged in user
     */
    def isActionItemPresentForUser() {
        userActionItemReadOnlyService.checkIfActionItemPresent( springSecurityService.getAuthentication()?.user.pidm )
    }
}
