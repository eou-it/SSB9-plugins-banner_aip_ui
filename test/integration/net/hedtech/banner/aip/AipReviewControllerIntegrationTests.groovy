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
        def result =controller.fetchActionItemNames()
        def ActionItemList = JSON.parse( controller.response.contentAsString )
        assertNotNull( ActionItemList )
        assertTrue( ActionItemList.size() > 0 )

    }

    //ActionID + personID test case
    @Test
    void searchActionItemsByActionIdAndExsitingPersonID() {

        controller.params.actionItemId = "3"
        controller.params.sortColumnName="spridenId"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 1, jsonResp.result.size()
        assertEquals 1, jsonResp.length
        assertEquals "CSRSTU001", jsonResp.result.get(0).spridenId
    }


    @Test
    void searchActionItemsByActionIdAndNonExsitingPersonID() {

        controller.params.actionItemId= "3"
        controller.params.personId = "CSRSTABCD"
        controller.request.contentType = "text/json"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length

    }


    @Test
    void searchActionItemsByNonExistingActionIdAndExisitingPersonID() {

        controller.params.actionItemId= "98989"
        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"
        controller.params.sortColumnName="spridenId"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"


        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length

    }

    //ActionID + personID test case
    @Test
    void searchActionItemsByActionIdAndExsitingPersonName() {

        controller.params.actionItemId= "3"
        controller.params.personName = "Cliff Starr"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 1, jsonResp.length
        assertEquals "CSRSTU001", jsonResp.result.get(0).spridenId
    }

    @Test
    void searchActionItemsByActionIdAndNonExsitingPersonName() {

        controller.params.actionItemId= "3"
        controller.params.personName = "Osama Bin Ladden"
        controller.request.contentType = "text/json"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"


        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length

    }

    @Test
    void searchActionItemsByNonExistingActionIdAndPersonName() {

        controller.params.actionItemId= "32323233"
        controller.params.personName = "Cliff Starr"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length

    }

    @Test
    void searchActionItemsBygActionIdAndPartialPersonName() {

        controller.params.actionItemId= "3"
        controller.params.personName = "Cliff"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 1, jsonResp.length
    }

    //action item only

    @Test
    void searchActionItemsByActionItemOnly() {

        controller.params.actionItemId= "3"

        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 13, jsonResp.length

        def row1 = jsonResp.result[0]
        def row2 = jsonResp.result[1]
        assertNotEquals row1, row2
    }

    @Test
    void searchActionItemsByActionItemOnlyNonExsistingActionItem() {

        controller.params.actionItemId= "999998"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length
    }

    //person Id only
    @Test
    void searchActionItemByPersonIdOnly() {

        controller.params.personId = "CSRSTU001"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 5, jsonResp.length

        def row1 = jsonResp.result[0]
        def row2 = jsonResp.result[1]
        assertNotEquals row1, row2

    }

    @Test
    void searchActionItemByPersonIdOnlyNonExisting() {

        controller.params.personId = "CSRQWERTY"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length
    }

    @Test
    void searchActionItemByNameOnly() {
        controller.params.personName = "Cliff Starr"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 5, jsonResp.length
    }

    @Test
    void searchActionItemByNameOnlyPartial() {
        controller.params.personName = "Cliff"
        controller.request.contentType = "text/json"
        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()

        def response = controller.response.getContentAsString()
        assertEquals 200, controller.response.status

        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 6, jsonResp.length
        //test unique values
        def row1 = jsonResp.result[0]
        def row2 = jsonResp.result[1]
        assertNotEquals row1, row2
    }

    @Test
    void searchActionItemByNameNonExisting() {
        controller.params.personName = "Osama Bin Ladden"
        controller.request.contentType = "text/json"

        controller.params.ascending=true
        controller.params.max="50"
        controller.params.offset="0"
        controller.params.sortColumnName="spridenId"

        controller.searchActionItems()
        def response = controller.response.getContentAsString()

        assertEquals 200, controller.response.status
        def jsonResp = JSON.parse(response)
        assertNotNull jsonResp
        assertEquals 0, jsonResp.length
    }

}
