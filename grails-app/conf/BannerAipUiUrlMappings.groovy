class BannerAipUiUrlMappings {

	static mappings = {
//        "/$controller/$action?/$work?/$id?"{
//            constraints {
//                // apply constraints here
//            }
//        }
        "/ssb/aipAdmin/$action?/$work?/$id?/$flag?" {
            action = $action
            controller = "aipAdmin"
        }

        "/"(view:"/index")
        "500"(view:'/error')
	}
}
