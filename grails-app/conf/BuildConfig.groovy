/*********************************************************************************
 Copyright 2010-2015 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"


grails.plugin.location.'banner-csr'="../banner_csr.git"
grails.plugin.location.'i18n_core'="../i18n_core.git"
grails.plugin.location.'banner-general-person'="../banner_general_person.git"
grails.plugin.location.'banner-core'="../banner_core.git"

grails.project.dependency.resolver = "maven" // or maven
grails.project.dependency.resolution = {

    inherits "global" // inherit Grails' default dependencies
    log "error"        // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'

    repositories {
        if (System.properties['PROXY_SERVER_NAME']) {
            mavenRepo "${System.properties['PROXY_SERVER_NAME']}"
        }
        mavenLocal()
        grailsCentral()
        mavenCentral()
        mavenRepo "https://code.lds.org/nexus/content/groups/main-repo"
        mavenRepo "http://repository.jboss.org/maven2/"
    }


    dependencies {
    }

    plugins {


    }

}