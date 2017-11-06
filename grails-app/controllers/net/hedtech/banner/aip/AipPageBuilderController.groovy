package net.hedtech.banner.aip

import grails.converters.JSON
import groovy.json.JsonSlurper
import net.hedtech.banner.sspb.Page


class AipPageBuilderController {

    def index() {}

    def groovyPagesTemplateEngine
    def compileService
    def pageService
    def user = net.hedtech.banner.sspb.PBUser.get()
    def jsonSlurper = new JsonSlurper()


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
        compiledJSCode = "var pageId = '" + pageName.toString() + "',\n controllerId = 'CustomPageController_" + pageName.toString() + "',\n" + "CustomPageController_" + pageName.toString() + "=" + compiledJSCode.toString() + ";"
        render (text: compiledJSCode, contentType: "text/javascript")
//        render model as JSON
    }

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
            groovyPagesTemplateEngine.clearPageCache()
            groovyPagesTemplateEngine.createTemplate(compiledView, 'test').make().writeTo(output)
            model = ['html': output.toString(), 'pageName':pageName, 'script': compiledJSCode.toString(), 'compiled':html]
        }
        render model as JSON
    }


    def getPage(pageId) {
        def page
        try {
            Long id = pageId
            page = net.hedtech.banner.sspb.Page.get(id)
        }
        catch (e) { //pageId is not a Long, find by name
            page = pageService.get(pageId)
        }
        return page
    }
}
