gapi.load('client:auth2', async function(){

	// the configs are imported as a promise in the setup.js
	let configs = await app.configsAsync

	await gapi.client.init({
		discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
		scope: configs.scopes,
		client_id : configs.clientId
	})
	app.controllers.banner.attach()

	let signInSateChange = app.signInSateChange = function(signInState){
		app.authState = signInState
		console.log("signInState:", signInState)

		if (!signInState){
			// detach all controllers if it's not the banner
			Object.getOwnPropertyNames(app.controllers)
				.forEach(controllerName=>controllerName !== "banner" && app.controllers[controllerName].detach())
			// attach the login view
			app.controllers.login.attach()
		}
		else{
			app.controllers.login.detach()
			// app.controllers.streamList.attach()
			app.rout()
		}
	}

	gapi.auth2.getAuthInstance().isSignedIn.listen(signInSateChange)

	signInSateChange(gapi.auth2.getAuthInstance().isSignedIn.get())
})

history.replaceState({}, null, document.location.pathname)

app.rout = function(newUrl = document.location.pathname){
	history.pushState({}, null, newUrl)

	Object.getOwnPropertyNames(app.controllers)
		.forEach(controllerName=>{
			let controller = app.controllers[controllerName]

			// console.log(controller)
			if (controller.routRegex && controller.routRegex.test(newUrl)){
				controller.attach()
			}
			else if (controller.routRegex){
				controller.detach()
			}
		})

}

window.addEventListener("popstate", ev=>{
	app.rout()
})
