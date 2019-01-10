app.controllers.streamWatch = Object.create(app.controllers.base)

app.controllers.streamWatch.ajax = fetch("js/components/stream-watch.html")
	.then(owo=>owo.text())
	.then(template=>{

		app.customElement("chat-message")
		app.customElement("chat-display-text")
		app.customElement("rolling-chat")

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

		controller.sendMessage = async function(){
			if (!controller.chat.input || !controller.streamDeets.activeLiveChatId){
				return
			}

			controller.chat.input = ""

			await gapi.client.youtube.liveChatMessages.insert({
				part: "snippet",
				resource: {
					snippet: {
						liveChatId: controller.streamDeets.activeLiveChatId,
						type: "textMessageEvent",
						textMessageDetails: {
							messageText: controller.chat.input
						}
					}
				}
			})
		}

		function wait(ms){
			return new Promise(function(accept){
				setTimeout(accept, ms)
			})
		}

		async function fetchChatRecursive(doAgain = true){
			// this is a recursive fetch function and this is the stop condition aka when the video that the user is watching has been switch away
			if (!controller.streamDeets.activeLiveChatId){
				return
			}

			let currentChat = await gapi.client.youtube.liveChatMessages.list({
				part: "snippet,authorDetails",
				liveChatId: controller.streamDeets.activeLiveChatId,
				pageToken: controller.chat.nextPageToken || undefined
			})

			currentChat.result.items.forEach(message=>controller.chat.messages.push(message))

			controller.chat.nextPageToken = currentChat.result.nextPageToken

			// scroll the chat to the bottom after proxymity is done re-rendering the view automagically
			await proxymity.on.renderend
			controller.scrollingChat.scrollTop = controller.scrollingChat.scrollHeight

			// wait for as long as google tells us to wait and then re fetch
			if (doAgain){
				await wait(currentChat.result.pollingIntervalMillis)
				fetchChatRecursive()
			}
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
