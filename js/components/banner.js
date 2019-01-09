app.controllers.banner = Object.create(app.controllers.base)

app.controllers.banner.ajax = fetch("js/components/banner.html")
	.then(owo=>owo.text())
	.then(template=>{
		app.customElement("app-banner")

		let controller = app.controllers.banner

		controller.view = proxymity(template, app.controllers.banner)

		controller.logoutClick = function(){
			console.log("logout clicked")
			gapi.auth2.getAuthInstance().signOut()
		}

	})
	.catch(app.catchPromiseError)
