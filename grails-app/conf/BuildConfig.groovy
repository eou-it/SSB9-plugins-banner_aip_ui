/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"

grails.plugin.location.'banner-aip'                         = "../banner_aip.git"
grails.plugin.location.'banner-ui-ss'                       = "../banner_ui_ss.git"
grails.plugin.location.'i18n_core'                          = "../i18n_core.git"
grails.plugin.location.'sghe-aurora'                        = "../sghe_aurora.git"
grails.plugin.location.'banner-codenarc'                    = "../banner_codenarc.git"
grails.plugin.location.'banner-general-common-ui-ss'        = "../banner_general_common_ui_ss.git"
grails.plugin.location.'domain-extension'                   = "../domain_extension.git"
grails.plugin.location.'web-app-extensibility'              = "../web-app-extensibility.git"
grails.plugin.location.'grails-constraints'                 = "../grails_constraints.git"
grails.plugin.location.'banner-restful-api-support'         = "../banner-restful-api-support.git"
grails.plugin.location.'banner-general-person'              = "../banner_general_person.git"
grails.plugin.location.'banner-general-common'              = "../banner_general_common.git"
grails.plugin.location.'banner-general-utility'              = "../banner_general_utility.git"
grails.plugin.location.'banner-general-validation-common' = "../banner_general_validation_common.git"

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

/*    plugins {
// TODO: evaluate if these are really needed
//        runtime ':font-awesome-resources:5.0.0.0'
        runtime "org.grails.plugins:font-awesome-resources:4.4.0"
        compile ":resources:1.2.8"
//        compile ':zipped-resources:1.0'
//        compile ':cached-resources:1.0'
//        compile ':cache-headers:1.1.5'
        test ':code-coverage:2.0.3-3'
        compile ":ckeditor:4.5.4.1"
    }*/


}
grails.reload.enabled = true;
