app.controllers.streamList = Object.create(app.controllers.base)

app.controllers.streamList.ajax = fetch("js/components/stream-list.html")
	.then(owo=>owo.text())
	.then(template=>{
		app.customElement("stream-list")
		app.customElement("stream-card")

		let controller = app.controllers.streamList

		controller.streams = {
			list: [],
		}

		controller.onAttach = async function(){
			// let subs = await app.recursiveFetcher( gapi.client.youtube.subscriptions.list, {
			// 	part: "snippet,contentDetails",
			// 	mine: true,
			// })
			//
			// console.log(subs)

			let live = await gapi.client.youtube.search.list({
				part: "snippet",
				type: "video",
				eventType: 'live',
				maxResults: 48, // 48 cuz it's a multiple of 4 and 3 that doesn't end up with a werid space at the bottom and is under 50
				order: "viewCount",
				relevanceLanguage: navigator.language
			})

			live.result.items.forEach(item=>controller.streams.list.push(item))
		}

		controller.routRegex = /^\/$/

		controller.viewStream = function(streamData){
			app.rout("/stream/" + streamData.id.videoId)
		}

		controller.view = proxymity(template, app.controllers.streamList)
	})
	.catch(app.catchPromiseError)
