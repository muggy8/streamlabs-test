fetch("js/components/banner.html")
	.then(owo=>owo.text())
	.then(template=>{
		app.customElement("app-banner")

		proxymity(
			template,
			app.controllers.banner = app.controllers.banner || {}
		).appendTo(app.body)
	})
	.catch(app.catchPromiseError)
