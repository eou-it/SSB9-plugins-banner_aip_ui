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
                filterName   : params.searchString ?: "%",
                sortColumn   : params.sortColumnName ?: "id",
                sortAscending: params.ascending ? params.ascending.toBoolean() : false,
                max          : params.max.toInteger(),
                offset       : params.offset ? params.offset.toInteger() : 0]
        def results = uploadDocumentCompositeService.fetchDocuments(paramsObj)
        render results as JSON
    }

    /**
     * Get configured restricted attachment type val from GUROCFG table
     * @return
     */
    def getRestrictedFileTypes() {
        String restrictedFileTypes = session.getAttribute("restrictedFileTypes");
        def result
        if (!restrictedFileTypes) {
            restrictedFileTypes = uploadDocumentCompositeService.getRestrictedFileTypes()
        }
        result = [restrictedFileTypes: restrictedFileTypes]
        render result as JSON
    }

    /**
     * Get configured allowed attachment max size val from GUROCFG table
     * @return
     */
    def getMaxFileSize() {
        String maxFileSize = session.getAttribute("maxFileSize");
        def result
        if (!maxFileSize) {
            maxFileSize = uploadDocumentCompositeService.getMaxFileSize()
        }
        result = [maxFileSize: maxFileSize]
        render result as JSON
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
