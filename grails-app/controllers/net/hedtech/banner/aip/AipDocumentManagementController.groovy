/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

package net.hedtech.banner.aip

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest
import net.hedtech.banner.i18n.MessageHelper

/**
 * Upload Controller
 */
@Slf4j
class AipDocumentManagementController {
    def uploadDocumentCompositeService
    def springSecurityService

    /**
     * Upload Document
     * @return
     */
    def uploadDocument() {
        Map model = [:]
        Map requestParamsMap = requestParamsProcess(request,params)
        def selectedfile = requestParamsMap.file

        if(!maxFileSizeValidation(selectedfile.getSize())){
            model =[success:false,message:MessageHelper.message('aip.uploadDocument.file.maxsize.error')]
        }

        if(!model && !restrictedFileTypesValidation(requestParamsMap.documentName)){
            model =[success:false,message:MessageHelper.message('aip.uploadDocument.file.type.restricted.error')]
        }

       if(!model && !maximumAttachmentsValidation(requestParamsMap.userActionItemId,requestParamsMap.responseId)){
            model =[success:false,message:MessageHelper.message('aip.uploadDocument.maximum.attachment.error')]
        }

        if(!model){
            model = uploadDocumentCompositeService.addDocument(requestParamsMap)
        }
        render model as JSON
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
                userActionItemId :Long.parseLong(params.userActionItemId),
                responseId   :Long.parseLong(params.responseId),
                sortColumn   : params.sortColumnName ?: "id",
                sortAscending: params.ascending ? params.ascending.toBoolean() : false
        ]
        def results = uploadDocumentCompositeService.fetchDocuments(paramsObj)
        render results as JSON
    }

    /**
     * This method is responsible for getting restricted file types for a response.
     * @return restricted file types as JSON
     */
    def restrictedFileTypes(){
        render getRestrictedFileTypes() as JSON
    }

    /**
     * This method is responsible for getting max file size for a response.
     * @return max file size as JSON
     */
    def maxFileSize(){
        render getMaxFileSize() as JSON
    }

    /**
     * Get configured restricted attachment type val from GUROCFG table
     * @return
     */
    private def getRestrictedFileTypes() {
        def restrictedFileTypes = session.getAttribute("restrictedFileTypes")
        if (!restrictedFileTypes) {
            restrictedFileTypes = uploadDocumentCompositeService.getRestrictedFileTypes()
            session.setAttribute("restrictedFileTypes", restrictedFileTypes)
        }
        return restrictedFileTypes
    }

    /**
     * Get configured allowed attachment max size val from GUROCFG table
     * @return
     */
    private def getMaxFileSize() {
        def maxFileSize = session.getAttribute("maxFileSize")
        if (!maxFileSize) {
            maxFileSize = uploadDocumentCompositeService.getMaxFileSize()
            session.setAttribute("maxFileSize", maxFileSize)
        }
        return maxFileSize
    }

    /**
     * This method is responsible for process the request params.
     * @return request params map
     */
    private Map requestParamsProcess(request,params){
        Map requestParams =[:]
        try {
            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest)request
            MultipartFile multipartFile = multipartRequest.getFile("file");
            requestParams.put('file',multipartFile )
            requestParams.put('userActionItemId',Long.parseLong(params.userActionItemId))
            requestParams.put('responseId',Long.parseLong(params.responseId))
            requestParams.put('documentName',params.documentName)
        } catch (ClassCastException e) {
            log.error(e.getMessage())
        }
        return  requestParams
    }

    /**
     * This method is responsible for file size validation.
     * @return boolean flag
     */
    private boolean maxFileSizeValidation(selectedFileSize){
        def configMaxFileSize  =  getMaxFileSize()
        if(configMaxFileSize.maxFileSize){
            if (selectedFileSize){
                if( selectedFileSize > Long.valueOf(configMaxFileSize.maxFileSize) ){
                    return false
                }
            }
        }
        return true
    }

    /**
     * This method is responsible for restricted file types validation.
     * @return boolean flag
     */
    private boolean restrictedFileTypesValidation(selectedFileName){
        def restrictedFileTypesSession = getRestrictedFileTypes()
        if(restrictedFileTypesSession.restrictedFileTypes) {
            if((restrictedFileTypesSession.restrictedFileTypes.toUpperCase().indexOf(getFileExtension(selectedFileName.toUpperCase()))) != -1) {
                return false
            }
        }
        return true
    }

    private String getFileExtension(fileName) {
        return fileName.substring(fileName.lastIndexOf(".")+1)
    }

    /**
     * This method is responsible for maximum attachments validation.
     * @return boolean flag
     */
    private boolean maximumAttachmentsValidation(userActionItemId,responseId){

        Map paramsMapObj = [
                userActionItemId : userActionItemId,
                responseId   : responseId
        ]
        return uploadDocumentCompositeService.validateMaxAttachments(paramsMapObj)
    }
    /**
     * This method is responsible for Preview Document
     * @return
     */
    def previewDocument() {
        def map = request.JSON
        def   previewDocumentInfo = uploadDocumentCompositeService.previewDocument(map)
        render previewDocumentInfo as JSON
    }
}
