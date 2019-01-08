fetch("js/components/banner.html")
	.then(owo=>owo.text())
	.then(template=>{
		app.customElement("app-banner")

		let view = proxymity(
			template,
			app.controllers.banner = app.controllers.banner || {}
		)

		view.appendTo(app.body)
	})
	.catch(app.catchPromiseError)
