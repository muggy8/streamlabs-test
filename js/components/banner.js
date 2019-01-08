fetch("js/components/banner.html")
	.then(ouo=>ouo.text())
	.then(template=>{
		console.log(template,
		proxymity(
			template,
			app.controllers.banner = app.controllers.banner || {}
		).appendTo(app.body))
	})
