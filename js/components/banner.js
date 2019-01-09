app.controllers.banner = Object.create(app.controllers.base)

app.controllers.banner.ajax = fetch("js/components/banner.html")
	.then(owo=>owo.text())
	.then(template=>{
		app.customElement("app-banner")

		let controller = app.controllers.banner

		controller.view = proxymity(template, app.controllers.banner)

		controller.logoutClick = async function(){
			console.log("logout clicked")
			let authInstance = gapi.auth2.getAuthInstance()
			await authInstance.signOut()
			await authInstance.disconnect()
			document.location.reload()
		}

	})
	.catch(app.catchPromiseError)
