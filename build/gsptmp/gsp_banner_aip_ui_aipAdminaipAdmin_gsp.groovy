import grails.plugins.metadata.GrailsPlugin
import org.grails.gsp.compiler.transform.LineNumber
import org.grails.gsp.GroovyPage
import org.grails.web.taglib.*
import org.grails.taglib.GrailsTagException
import org.springframework.web.util.*
import grails.util.GrailsUtil

class gsp_banner_aip_ui_aipAdminaipAdmin_gsp extends org.grails.gsp.GroovyPage {
public String getGroovyPageFileName() { "/WEB-INF/grails-app/views/aipAdmin/aipAdmin.gsp" }
public Object run() {
Writer out = getOut()
Writer expressionOut = getExpressionOut()
registerSitemeshPreprocessMode()
printHtmlPart(0)
printHtmlPart(1)
createTagBody(1, {->
printHtmlPart(2)
createTagBody(2, {->
printHtmlPart(3)
expressionOut.print(createLink(uri: '/ssb'))
printHtmlPart(4)
invokeTag('captureMeta','sitemesh',9,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("headerAttributes"),'content':("")],-1)
printHtmlPart(5)
createTagBody(3, {->
invokeTag('captureTitle','sitemesh',10,[:],-1)
})
invokeTag('wrapTitleTag','sitemesh',10,[:],3)
printHtmlPart(6)
invokeTag('captureMeta','sitemesh',12,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("menuEndPoint"),'content':(g.createLink(controller: 'selfServiceMenu', action: 'data'))],-1)
printHtmlPart(5)
invokeTag('captureMeta','sitemesh',13,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("menuBaseURL"),'content':(createLink(uri: '/ssb'))],-1)
printHtmlPart(5)
invokeTag('set','g',14,['var':("applicationContextRoot"),'value':(application.contextPath)],-1)
printHtmlPart(5)
invokeTag('captureMeta','sitemesh',15,['gsp_sm_xmlClosingForEmptyTag':(""),'name':("applicationContextRoot"),'content':(applicationContextRoot)],-1)
printHtmlPart(5)
if(true && (message(code: 'default.language.direction')  == 'rtl')) {
printHtmlPart(7)
invokeTag('stylesheet','asset',17,['href':("modules/aipAppRTL-mf.css")],-1)
printHtmlPart(5)
}
else {
printHtmlPart(7)
invokeTag('stylesheet','asset',20,['href':("modules/aipApp-mf.css")],-1)
printHtmlPart(5)
}
printHtmlPart(5)
invokeTag('javascript','asset',22,['src':("modules/aipAdminApp-mf.js")],-1)
printHtmlPart(2)
})
invokeTag('applyLayout','g',23,['name':("bannerSelfServicePage")],2)
printHtmlPart(8)
expressionOut.print(applicationContextRoot)
printHtmlPart(9)
expressionOut.print(applicationContextRoot)
printHtmlPart(10)
invokeTag('i18n_setup','g',52,[:],-1)
printHtmlPart(7)
invokeTag('aipVersion','g',53,[:],-1)
printHtmlPart(7)
if((grails.util.Environment.current.name == 'development') && true) {
printHtmlPart(11)
}
printHtmlPart(7)
createTagBody(2, {->
printHtmlPart(12)
expressionOut.print(fragment)
printHtmlPart(13)
expressionOut.print(fragment)
printHtmlPart(14)
})
invokeTag('javascript','g',61,[:],2)
printHtmlPart(15)
})
invokeTag('captureHead','sitemesh',64,[:],1)
printHtmlPart(16)
createClosureForHtmlPart(17, 1)
invokeTag('captureBody','sitemesh',78,[:],1)
printHtmlPart(18)
}
public static final Map JSP_TAGS = new HashMap()
protected void init() {
	this.jspTags = JSP_TAGS
}
public static final String CONTENT_TYPE = 'text/html;charset=UTF-8'
public static final long LAST_MODIFIED = 1560917014141L
public static final String EXPRESSION_CODEC = 'html'
public static final String STATIC_CODEC = 'none'
public static final String OUT_CODEC = 'none'
public static final String TAGLIB_CODEC = 'none'
}
