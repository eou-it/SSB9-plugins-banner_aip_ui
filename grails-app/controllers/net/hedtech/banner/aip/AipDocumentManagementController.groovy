/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON
import org.springframework.web.multipart.MultipartHttpServletRequest
import org.springframework.web.multipart.commons.CommonsMultipartFile

/**
 * Upload Controller
 */
class AipDocumentManagementController {

    def uploadDocumentCompositeService

    /**
     * Upload Document
     * @return
     */
    def uploadDocument() {
        println("Request "+request)
        def    uploadDocumentInfo = uploadDocumentCompositeService.addUploadDocument( requestParamsProcess(request))
        render uploadDocumentInfo as JSON
    }

    /**
     * This method is responsible for deleting attached document for a response.
     * @return
     */
    def deleteDocument() {
        def map = request.JSON
        def result = uploadDocumentCompositeService.deleteDocument( map.documentId )
        render result as JSON
    }

    /**
     * This method is responsible for getting list is attached documents for a response.
     * @return documents list as JSON
     */
    def listDocuments() {
        def paramsObj = [
                actionItemId : params.actionItemId,
                responseId   : params.responseId,
                sortColumn   : params.sortColumnName ?: "id",
                sortAscending: params.ascending ? params.ascending.toBoolean() : false
        ]
        def results = uploadDocumentCompositeService.fetchDocuments(paramsObj)
        render results as JSON
    }

    /**
     * Get configured restricted attachment type val from GUROCFG table
     * @return
     */
    def getRestrictedFileTypes() {
        def restrictedFileTypes = session.getAttribute("restrictedFileTypes");
        if (!restrictedFileTypes) {
            restrictedFileTypes = uploadDocumentCompositeService.getRestrictedFileTypes()
            session.setAttribute("restrictedFileTypes", restrictedFileTypes)
        }
        render restrictedFileTypes as JSON
    }

    /**
     * Get configured allowed attachment max size val from GUROCFG table
     * @return
     */
    def getMaxFileSize() {
        def maxFileSize = session.getAttribute("maxFileSize");
        if (!maxFileSize) {
            maxFileSize = uploadDocumentCompositeService.getMaxFileSize()
            session.setAttribute("maxFileSize", maxFileSize)
        }
        render maxFileSize as JSON
    }

    /**
     * This method is responsible for process the request params.
     * @return request params map
     */
    private Map requestParamsProcess(request){
        Map requestParams =[:]
        try {
            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
            requestParams.put('file',(CommonsMultipartFile) multipartRequest.getFile('file'))
            requestParams.put('actionItemId',multipartRequest.multipartParameters.actionItemId[0])
            requestParams.put('responseId',multipartRequest.multipartParameters.responseId[0])
            requestParams.put('documentName',multipartRequest.multipartParameters.documentName[0])
        } catch (ClassCastException e) {

        }
        return  requestParams
    }
}
