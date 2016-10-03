package net.hedtech.banner.aip

import grails.converters.JSON
import groovy.json.JsonSlurper


class AipPageBuilderController {

    def index() {}

    def groovyPagesTemplateEngine
    def compileService
    def user = net.hedtech.banner.sspb.PBUser.get()
    def jsonSlurper = new JsonSlurper()

    def page = {
        def html
        def model
        def pageId = params.id
        def data = getPage(pageId)
        def validateResult = compileService.preparePage(data.modelView)
        def pageName = jsonSlurper.parseText(data.modelView).name
        if(validateResult.valid) {
            def compiledView = compileService.compile2page(validateResult.pageComponent)
            def compiledJSCode = compileService.compileController(validateResult.pageComponent)
            if (data && compiledView && compiledJSCode)
                html = compileService.assembleFinalPage(compiledView, compiledJSCode)
            def output = new StringWriter()
            groovyPagesTemplateEngine.createTemplate(compiledView, 'test').make().writeTo(output)
            model = ['html': output.toString(), 'pageName':pageName, 'script': compiledJSCode.toString()]
        }
        render model as JSON
    }

    def pageScript = {
        def compiledJSCode
        def pageId = params.id
        def data = getPage(pageId)
        def pageName = jsonSlurper.parseText(data.modelView).name
        def validateResult = compileService.preparePage(data.modelView)
        if(validateResult.valid) {
            try {
                compiledJSCode=compileService.compileController(validateResult.pageComponent)
            } catch(e) {

            }
        }
        compiledJSCode = "var CustomPageController_" + pageName.toString() + "=" + compiledJSCode
        render (text: compiledJSCode, contentType: "text/javascript")
//        render model as JSON
    }

    def getPage(pageId) {
        def page
        try {
            Long id = pageId
            page = net.hedtech.banner.sspb.Page.get(id)
        }
        catch (e) { //pageId is not a Long, find by name
            page = net.hedtech.banner.sspb.Page.findByConstantName(pageId)
        }
        return page
    }
}
