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
        map.file= file;
        def uploadDocumentInfo = uploadDocumentCompositeService.saveUploadDocument( map )
        render uploadDocumentInfo as JSON
    }

}
