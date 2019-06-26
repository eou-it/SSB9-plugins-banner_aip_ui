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
invokeTag('captureMeta','sitemesh',10,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("headerAttributes"),'content':("")],-1)
printHtmlPart(2)
createTagBody(3, {->
invokeTag('captureTitle','sitemesh',11,[:],-1)
})
invokeTag('wrapTitleTag','sitemesh',11,[:],3)
printHtmlPart(5)
invokeTag('captureMeta','sitemesh',13,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("menuEndPoint"),'content':(g.createLink(controller: 'selfServiceMenu', action: 'data'))],-1)
printHtmlPart(2)
invokeTag('captureMeta','sitemesh',14,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("menuBaseURL"),'content':(createLink(uri: '/ssb'))],-1)
printHtmlPart(2)
invokeTag('set','g',15,['var':("applicationContextRoot"),'value':(application.contextPath)],-1)
printHtmlPart(2)
invokeTag('captureMeta','sitemesh',16,['gsp_sm_xmlClosingForEmptyTag':(""),'name':("applicationContextRoot"),'content':(applicationContextRoot)],-1)
printHtmlPart(2)
if(true && (message(code: 'default.language.direction')  == 'rtl')) {
printHtmlPart(6)
invokeTag('stylesheet','asset',18,['href':("modules/aipAppRTL-mf.css")],-1)
printHtmlPart(2)
}
else {
printHtmlPart(6)
invokeTag('stylesheet','asset',21,['href':("modules/aipApp-mf.css")],-1)
printHtmlPart(2)
}
printHtmlPart(2)
invokeTag('javascript','asset',23,['src':("modules/aipAdminApp-mf.js")],-1)
printHtmlPart(7)
})
invokeTag('applyLayout','g',24,['name':("bannerWebPage")],2)
printHtmlPart(8)
expressionOut.print(applicationContextRoot)
printHtmlPart(9)
expressionOut.print(applicationContextRoot)
printHtmlPart(10)
invokeTag('aipVersion','g',54,[:],-1)
printHtmlPart(6)
if((grails.util.Environment.current.name == 'development') && true) {
printHtmlPart(11)
}
printHtmlPart(12)
expressionOut.print(fragment)
printHtmlPart(13)
expressionOut.print(fragment)
printHtmlPart(14)
invokeTag('i18n_setup','g',64,[:],-1)
printHtmlPart(15)
})
invokeTag('captureHead','sitemesh',67,[:],1)
printHtmlPart(16)
createClosureForHtmlPart(17, 1)
invokeTag('captureBody','sitemesh',81,[:],1)
printHtmlPart(18)
}
public static final Map JSP_TAGS = new HashMap()
protected void init() {
	this.jspTags = JSP_TAGS
}
public static final String CONTENT_TYPE = 'text/html;charset=UTF-8'
public static final long LAST_MODIFIED = 1561455111663L
public static final String EXPRESSION_CODEC = 'html'
public static final String STATIC_CODEC = 'none'
public static final String OUT_CODEC = 'none'
public static final String TAGLIB_CODEC = 'none'
}
