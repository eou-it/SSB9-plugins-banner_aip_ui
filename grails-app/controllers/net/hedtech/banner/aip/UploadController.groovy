/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON
import org.springframework.web.multipart.MultipartFile

/**
 * Upload Controller
 */
class UploadController {

    def uploadDocumentCompositeService

    /**
     * Upload Document
     * @return
     */
    def saveuploadInfo() {
        def map = request.JSON
        MultipartFile file = (MultipartFile) request.multipartFiles.file?.get( 0 );
        map.file = file;
        def uploadDocumentInfo = uploadDocumentCompositeService.addUploadDocument( map )
        render uploadDocumentInfo as JSON
    }

    /**
     * This method is responsible for getting list is attached documents for a response.
     * @return documents list as JSON
     */
    def fetchDocuments() {
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
