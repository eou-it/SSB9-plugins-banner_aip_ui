package net.hedtech.banner.aip

import grails.converters.JSON

/** Controller for Review Action Items **/

class AipReviewController {
    static defaultAction = "monitor"
    def monitorActionItemCompositeService

    def monitor() {
        render(view: "aipReview")
    }

    /**
     * Fetch Action Item Names
     * @return
     */
    def fetchActionItemNames() {
        def result = monitorActionItemCompositeService.getactionItemNames()
        render result as JSON
    }
}
