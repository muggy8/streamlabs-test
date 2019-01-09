app.controllers.streamWatch = Object.create(app.controllers.base)

app.controllers.streamWatch.ajax = fetch("js/components/stream-watch.html")
	.then(owo=>owo.text())
	.then(template=>{

		let controller = app.controllers.streamWatch

		controller.routRegex = /^\/stream\/([^\/]+)/

		controller.view = proxymity(template, app.controllers.streamWatch)

		controller.onAttach = function(){
			document.location.pathname.replace(controller.routRegex, function(whole, videoId){
				controller.videoId = videoId
			})
		}

	})
	.catch(app.catchPromiseError)
