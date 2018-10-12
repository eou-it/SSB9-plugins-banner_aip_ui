/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
package net.hedtech.banner.aip

class AipReviewController {
    static defaultAction = "monitor"

        def monitor() {
            render( view: "aipReview" )
        }

}
