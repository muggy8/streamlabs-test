app.controllers.streamList = Object.create(app.controllers.base)

app.controllers.streamList.ajax = fetch("js/components/stream-list.html")
	.then(owo=>owo.text())
	.then(template=>{
		app.customElement("stream-list")
		app.customElement("error-list")

		let controller = app.controllers.streamList

		controller.streams = {
			errors: []
		}

		controller.onAttach = async function(){

			// controller.streams = {
			// 	errors: []
			// }

			try{
				controller.streams.list = await gapi.client.youtube.liveBroadcasts.list({
					part: "snippet",
					broadcastStatus: "active",
					broadcastType: "all"
				})
			}
			catch(uwu){
				console.warn(uwu)
				uwu.result.error.errors.forEach(err=>controller.streams.errors.push(err))
			}
		}

		controller.view = proxymity(template, app.controllers.streamList)
	})
	.catch(app.catchPromiseError)
