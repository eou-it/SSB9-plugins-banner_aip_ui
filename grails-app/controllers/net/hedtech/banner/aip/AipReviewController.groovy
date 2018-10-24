package net.hedtech.banner.aip

import grails.converters.JSON

class AipReviewController {
    static defaultAction = "monitor"
    def monitorActionItemReadOnlyCompositeService

    def monitor() {
        render( view: "aipReview" )
    }

    /**
     * Add Action Item
     * @return
     */
    def fetchActionItem() {
        def result = monitorActionItemReadOnlyCompositeService.getactionItemNames()
        render result as JSON
    }
}
