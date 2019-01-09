app.controllers.streamList = Object.create(app.controllers.base)

app.controllers.streamList.ajax = fetch("js/components/stream-list.html")
	.then(owo=>owo.text())
	.then(template=>{
		app.customElement("stream-list")

		let controller = app.controllers.streamList

		controller.view = proxymity(template, app.controllers.streamList)

	})
	.catch(app.catchPromiseError)
