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

		function wait(ms){
			return new Promise(function(accept){
				setTimeout(accept, ms)
			})
		}

		async function fetchChatRecursive(){
			console.log("chat open toggled")
			if (!controller.streamDeets.activeLiveChatId){
				return
			}

			let currentChat = await gapi.client.youtube.liveChatMessages.list({
				part: "snippet",
				liveChatId: controller.streamDeets.activeLiveChatId,
				pageToken: controller.chat.nextPageToken || undefined
			})

			console.log(currentChat)

			currentChat.result.items.forEach(message=>controller.chat.messages.push(message))

			controller.chat.nextPageToken = currentChat.result.nextPageToken

			await wait(currentChat.result.pollingIntervalMillis)
			fetchChatRecursive()
		}

		controller.watch("chat.open", fetchChatRecursive)

		controller.watch("videoId", async function(){
			controller.chat.open = false;

			if (controller.chat.messages.length){
				controller.chat.messages.splice(0, controller.chat.messages.length)
			}

			controller.streamDeets = {}

			if (!controller.videoId){
				return
			}

			let liveDeets = await gapi.client.youtube.videos.list({
				part: "liveStreamingDetails",
				id: controller.videoId
			})
			controller.streamDeets = liveDeets.result.items[0].liveStreamingDetails
		})

		controller.onDetach = function(){
			controller.chat.open = false;

			if (controller.chat.messages.length){
				controller.chat.messages.splice(0, controller.chat.messages.length)
			}

			controller.streamDeets = {}

			controller.videoId = null

			controller.chat.nextPageToken = null
		}

		controller.view = proxymity(template, app.controllers.streamWatch)
	})
	.catch(app.catchPromiseError)
