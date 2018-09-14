/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON
import org.springframework.web.multipart.MultipartFile
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
        Map map = [:]
        def uploadDocumentInfo
        MultipartHttpServletRequest multipartRequest
        try {
            multipartRequest = (MultipartHttpServletRequest) request;
            map.put('file',(CommonsMultipartFile) multipartRequest.getFile('file'))
            map.put('actionItemId',multipartRequest.multipartParameters.actionItemId[0])
            map.put('responseId',multipartRequest.multipartParameters.responseId[0])
            map.put('documentName',multipartRequest.multipartParameters.documentName[0])
            map.put('fileLocation',multipartRequest.multipartParameters.fileLocation[0])
            uploadDocumentInfo = uploadDocumentCompositeService.addUploadDocument( map )
        } catch (Exception e) {

        }
        render uploadDocumentInfo as JSON
    }

    /**
     * This method is responsible for delete documents for a response.
     * @return
     */
    def deleteDocument() {

    }

    /**
     * This method is responsible for getting list is attached documents for a response.
     * @return documents list as JSON
     */
    def getDocumentList() {
        def map = request.JSON
        def results = uploadDocumentCompositeService.fetchDocuments( map )
        render results as JSON
    }

    /**
     * Get configured restricted attachment type val from GUROCFG table
     * @return
     */
    def getrestrictedAttachmetTypeVal() {
        String documentType = session.getAttribute("documentType");
        def result
        if (documentType.equals(null)) {
            result = uploadDocumentCompositeService.uploadDocumentType()
        }
        else{
            result = [documentType: documentType]
        }
        render result as JSON
    }

    /**
     * Get configured allowed attachment max size val from GUROCFG table
     * @return
     */
    def getAttachmentMaxSizeVal() {
        String documentSize = session.getAttribute("documentSize");
        def result
        if (documentType.equals(null)) {
            result = uploadDocumentCompositeService.uploadDocumentSize()
        }
        else{
            result = [documentSize: documentSize]
        }
        render result as JSON
    }
}
