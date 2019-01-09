app.controllers.login = Object.create(app.controllers.base)

app.controllers.login.ajax = fetch("js/components/login-frame.html")
	.then(owo=>owo.text())
	.then(template=>{

		app.controllers.login.view = proxymity(template, app.controllers.login)

	})
	.catch(app.catchPromiseError)
