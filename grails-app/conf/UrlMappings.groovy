class UrlMappings {

	static mappings = {
        "ssb/csr/$action/$params*" (controller:"csr")
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(view:"/index")
        "500"(view:'/error')
	}
}
