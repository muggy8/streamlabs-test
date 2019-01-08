const app = {}

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


app.customElement("app-main")

app.controllers = {}

app.body = document.querySelector("app-main")
