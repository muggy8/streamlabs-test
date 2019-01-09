app.controllers.login = Object.create(app.controllers.base)

app.controllers.login.ajax = fetch("js/components/login-frame.html")
	.then(owo=>owo.text())
	.then(template=>{
		let controller = app.controllers.login

		controller.view = proxymity(template, app.controllers.login)

		controller.loginClick = function(){
			console.log("login clicked")
			gapi.auth2.getAuthInstance().signIn();
		}

	})
	.catch(app.catchPromiseError)
