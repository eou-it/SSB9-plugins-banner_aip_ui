/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
class BannerAipUiUrlMappings {

	static mappings = {
//        "/$controller/$action?/$work?/$id?"{
//            constraints {
//                // apply constraints here
//            }
//        }


        "/"(view:"/index")
        "500"(view:'/error')
	}
}
