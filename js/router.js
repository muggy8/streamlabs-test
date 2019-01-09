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
			app.controllers.login.attach()
			app.controllers.streamList.detach()
		}
		else{
			app.controllers.login.detach()
			app.controllers.streamList.attach()
		}
	}

	gapi.auth2.getAuthInstance().isSignedIn.listen(signInSateChange)

	signInSateChange(gapi.auth2.getAuthInstance().isSignedIn.get())
})
