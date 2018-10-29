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
import static org.junit.Assert.*
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
        loginSSB('AIPADM001', '111111')
    }

    @After
    public void tearDown() {
        super.tearDown()
        logout()
    }

    @Test
    void listActionItemNames() {
        def result =monitorActionItemCompositeService.getActionItemNames()
        assert result.size() > 0
    }

    //ActionID + personID test case
    @Test
    void searchActionItemsByActionIdAndExsitingPersonID() {

        controller.params.actionId = "3"
        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 1, jsonResp.size()
        assertEquals "CSRSTU001", jsonResp.get(0).spridenId
    }


    @Test
    void searchActionItemsByActionIdAndNonExsitingPersonID() {

        controller.params.actionId = "3"
        controller.params.personId = "CSRSTABCD"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.size()

    }


    @Test
    void searchActionItemsByNonExistingActionIdAndExisitingPersonID() {

        controller.params.actionId = "98989"
        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.size()

    }

    //ActionID + personID test case
    @Test
    void searchActionItemsByActionIdAndExsitingPersonName() {

        controller.params.actionId = "3"
        controller.params.personName = "Cliff Starr"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 1, jsonResp.size()
        assertEquals "CSRSTU001", jsonResp.get(0).spridenId
    }

    @Test
    void searchActionItemsByActionIdAndNonExsitingPersonName() {

        controller.params.actionId = "3"
        controller.params.personName = "Osama Bin Ladden"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.size()

    }

    @Test
    void searchActionItemsByNonExistingActionIdAndPersonName() {

        controller.params.actionId = "32323233"
        controller.params.personName = "Cliff Starr"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.size()

    }

    @Test
    void searchActionItemsBygActionIdAndPartialPersonName() {

        controller.params.actionId = "3"
        controller.params.personName = "Cliff"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 1, jsonResp.size()
    }

    //action item only

    @Test
    void searchActionItemsByActionItemOnly() {

        controller.params.actionId = "3"
        controller.request.contentType = "text/json"
        controller.searchActionItems()

        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 13, jsonResp.size()

        def row1 = jsonResp[0]
        def row2 = jsonResp[1]
        assertNotEquals row1, row2
    }

    @Test
    void searchActionItemsByActionItemOnlyNonExsistingActionItem() {

        controller.params.actionId = "999998"
        controller.request.contentType = "text/json"
        controller.searchActionItems()

        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.size()
    }

    //person Id only
    @Test
    void searchActionItemByPersonIdOnly() {

        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 5, jsonResp.size()

        def row1 = jsonResp[0]
        def row2 = jsonResp[1]
        assertNotEquals row1, row2

    }

    @Test
    void searchActionItemByPersonIdOnlyNonExisting() {

        controller.params.personId = "CSRQWERTY"
        controller.request.contentType = "text/json"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.size()
    }

    @Test
    void searchActionItemByNameOnly() {
        controller.params.personName = "Cliff Starr"
        controller.request.contentType = "text/json"
        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 5, jsonResp.size()
    }

    @Test
    void searchActionItemByNameOnlyPartial() {
        controller.params.personName = "Cliff"
        controller.request.contentType = "text/json"
        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status

        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 6, jsonResp.size()
        //test unique values
        def row1 = jsonResp[0]
        def row2 = jsonResp[1]
        assertNotEquals row1, row2
    }

    @Test
    void searchActionItemByNameNonExisting() {
        controller.params.personName = "Osama Bin Ladden"
        controller.request.contentType = "text/json"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.size()
    }

}
