package net.hedtech.banner.aip

class AipReviewController {
    static defaultAction = "monitor"

        def monitor() {
            render( view: "aipReview" )
        }

}
