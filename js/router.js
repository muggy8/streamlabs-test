gapi.load('client:auth2', async function(){

	// the configs are imported as a poromise in the setup.js
	let configs = await app.configsAsync

	await gapi.client.init({
		scope: configs.scopes,
		client_id : configs.clientId
	})

})
