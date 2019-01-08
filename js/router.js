gapi.load('client:auth2', async function(){
	let configs = await app.configsAsync
	gapi.client.init({
		scope: configs.scopes,
		client_id : configs.clientId
	})
})
