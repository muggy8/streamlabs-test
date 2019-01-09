const app = proxymity.convert({})

// new block to keep the custom element function properties scoped to the special function so nothing else can really mess with it too much except by directly getting it via dom but it's so generic that's gonna be kinda hard.
{
	let customElementStyler = document.head.appendChild(document.createElement("style"))
	let elementList = []

	let renderCSS = function(){
		customElementStyler.innerHTML = elementList.join(",") + "{display: block}"
	}

	app.customElement = function(domString, constructorClass = class extends HTMLElement {}){
		customElements.define(domString, constructorClass)

		elementList.push(domString)
		renderCSS()
	}
}

{
	let recursiveFetcher = app.recursiveFetcher = async function(endpoint, config, totalResults = [], nextPageToken){
		if (nextPageToken){
			config.pageToken = nextPageToken
		}
		config.maxResults = config.maxResults || 50

		let requestResults = await endpoint(config)
		requestResults.result.items.forEach(item=>totalResults.push(item))

		if (requestResults.result.nextPageToken){
			return recursiveFetcher(endpoint, config, totalResults, requestResults.result.nextPageToken)
		}

		return totalResults
	}
}


app.customElement("app-main")

app.controllers = {}

app.body = document.querySelector("app-main")

app.controllers.base = {
	attach: async function(){
		if (this.ajax){
			await this.ajax
		}
		if (this.view){
			this.view.appendTo(app.body)
			this.onAttach && this.onAttach()
		}
	},
	detach: async function(){
		if (this.ajax){
			await this.ajax
		}
		if (this.view){
			this.view.detach()
			this.onDetach && this.onDetach()
		}
	}
}

app.catchPromiseError = function(uwu){
	console.log(uwu)
	alert("An unexpected error has occurred. Check the console for more information")
}

app.configsAsync = fetch("config.json")
	.then(owo=>owo.json())
	.catch(app.catchPromiseError)
