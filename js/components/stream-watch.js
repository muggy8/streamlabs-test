app.controllers.streamWatch = Object.create(app.controllers.base)

app.controllers.streamWatch.ajax = fetch("js/components/stream-watch.html")
	.then(owo=>owo.text())
	.then(template=>{

		let controller = app.controllers.streamWatch

		controller.routRegex = /^\/stream\/([^\/]+)/

		controller.onAttach = function(){
			document.location.pathname.replace(controller.routRegex, function(whole, videoId){
				controller.videoId = videoId
			})
		}

		controller.chat = {
			open: false,
			messages: []
		}

		async function fetchChat(){
			if (!controller.chat.open){
				return
			}

			await gapi.client.youtube.liveChatMessages.list({
				part: "snippet",
				liveChatId: controller.videoId
			})
		}

		controller.view = proxymity(template, app.controllers.streamWatch)
	})
	.catch(app.catchPromiseError)
