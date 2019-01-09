app.controllers.banner = Object.create(app.controllers.base)

app.controllers.banner.ajax = fetch("js/components/banner.html")
	.then(owo=>owo.text())
	.then(template=>{
		app.customElement("app-banner")

		app.controllers.banner.view = proxymity(template, app.controllers.banner)

	})
	.catch(app.catchPromiseError)
