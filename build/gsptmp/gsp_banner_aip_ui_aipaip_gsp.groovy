import grails.plugins.metadata.GrailsPlugin
import org.grails.gsp.compiler.transform.LineNumber
import org.grails.gsp.GroovyPage
import org.grails.web.taglib.*
import org.grails.taglib.GrailsTagException
import org.springframework.web.util.*
import grails.util.GrailsUtil

class gsp_banner_aip_ui_aipaip_gsp extends org.grails.gsp.GroovyPage {
public String getGroovyPageFileName() { "/WEB-INF/grails-app/views/aip/aip.gsp" }
public Object run() {
Writer out = getOut()
Writer expressionOut = getExpressionOut()
registerSitemeshPreprocessMode()
printHtmlPart(0)
printHtmlPart(1)
createTagBody(1, {->
printHtmlPart(2)
expressionOut.print(createLink(uri: '/ssb'))
printHtmlPart(3)
invokeTag('captureMeta','sitemesh',8,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("headerAttributes"),'content':("")],-1)
printHtmlPart(4)
createTagBody(2, {->
invokeTag('captureTitle','sitemesh',9,[:],-1)
})
invokeTag('wrapTitleTag','sitemesh',9,[:],2)
printHtmlPart(4)
invokeTag('captureMeta','sitemesh',10,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("layout"),'content':("bannerWebPage")],-1)
printHtmlPart(4)
invokeTag('captureMeta','sitemesh',11,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("menuEndPoint"),'content':(g.createLink(controller: 'selfServiceMenu', action: 'data'))],-1)
printHtmlPart(4)
invokeTag('captureMeta','sitemesh',12,['gsp_sm_xmlClosingForEmptyTag':("/"),'name':("menuBaseURL"),'content':(createLink(uri: '/ssb'))],-1)
printHtmlPart(4)
invokeTag('set','g',13,['var':("applicationContextRoot"),'value':(application.contextPath)],-1)
printHtmlPart(4)
invokeTag('captureMeta','sitemesh',14,['gsp_sm_xmlClosingForEmptyTag':(""),'name':("applicationContextRoot"),'content':(applicationContextRoot)],-1)
printHtmlPart(4)
if(true && (message(code: 'default.language.direction')  == 'rtl')) {
printHtmlPart(5)
invokeTag('stylesheet','asset',16,['href':("modules/aipAppRTL-mf.css")],-1)
printHtmlPart(4)
}
else {
printHtmlPart(5)
invokeTag('stylesheet','asset',19,['href':("modules/aipApp-mf.css")],-1)
printHtmlPart(4)
}
printHtmlPart(4)
invokeTag('javascript','asset',21,['src':("modules/aipNonAdminApp-mf.js")],-1)
printHtmlPart(6)
expressionOut.print(applicationContextRoot)
printHtmlPart(7)
expressionOut.print(applicationContextRoot)
printHtmlPart(8)
expressionOut.print(reUrl)
printHtmlPart(9)
invokeTag('aipVersion','g',51,[:],-1)
printHtmlPart(5)
if((grails.util.Environment.current.name == 'development') && true) {
printHtmlPart(10)
}
printHtmlPart(11)
expressionOut.print(fragment)
printHtmlPart(12)
expressionOut.print(fragment)
printHtmlPart(13)
invokeTag('i18n_setup','g',60,[:],-1)
printHtmlPart(14)
})
invokeTag('captureHead','sitemesh',63,[:],1)
printHtmlPart(15)
createClosureForHtmlPart(16, 1)
invokeTag('captureBody','sitemesh',77,[:],1)
printHtmlPart(17)
}
public static final Map JSP_TAGS = new HashMap()
protected void init() {
	this.jspTags = JSP_TAGS
}
public static final String CONTENT_TYPE = 'text/html;charset=UTF-8'
public static final long LAST_MODIFIED = 1561455111662L
public static final String EXPRESSION_CODEC = 'html'
public static final String STATIC_CODEC = 'none'
public static final String OUT_CODEC = 'none'
public static final String TAGLIB_CODEC = 'none'
}
