gapi.load('client:auth2', async function(){

	// the configs are imported as a promise in the setup.js
	let configs = await app.configsAsync

	await gapi.client.init({
		scope: configs.scopes,
		client_id : configs.clientId
	})
	app.controllers.banner.attach()

	function signInSateChange(signInState){
		console.log(signInState)
		if (!signInState){
			app.controllers.login.attach()
		}
		else{
			app.controllers.login.detach()
		}
	}

	gapi.auth2.getAuthInstance().isSignedIn.listen(signInSateChange)

	signInSateChange(gapi.auth2.getAuthInstance().isSignedIn.get())
})
