const _router_map = Symbol('Router Map');
const _when_ready_event_queue = Symbol('When Ready Event Queue');
const _previous_path = Symbol('Previous Path');
//
window.customElements.define('single-page-application-router', class extends HTMLElement {
	constructor() {
		super();
		this[_router_map] = new Map();
		this[_when_ready_event_queue] = new Map();
		this[_previous_path] = null;
	}
	addRoute(path, customElementTagName) {
		this.routerMap.set(path, customElementTagName);
		this.navigate();
	}
	get routerMap() {
		return this[_router_map];
	}
	get previousPath() {
		return this[_previous_path];
	}
	set previousPath(value) {
		this[_previous_path] = value;
	}
	async connectedCallback() {
		if (this.hasAttribute("data-multi-page-mode")) {
			// Do nothing if we're running in classic multi page mode
			return true;
		}
		const observer = new MutationObserver(function(mutations) {
			for (let a of document.querySelectorAll("a:not([data-suppressed])")) {
				a.setAttribute("data-suppressed", "");
				a.addEventListener("click", function(e) {
					e.preventDefault();
					window.history.pushState(true, null, this.href);
					window.dispatchEvent(new Event("popstate"));
				});
			}
		});
		observer.observe(document, {
			attributes: false,
			childList: true,
			characterData: false,
			subtree: true
		});
		window.addEventListener("popstate", e => {
			this.navigate();
		});
		// Deal with popstate event
		this.navigate();
	}
	navigate() {
		// If the new path is the same as the previous one then no page reloading is needed
		// Most likely a hashchange
		if (this.previousPath === window.location.pathname) {
			return true;
		}
		let tagName = "";
		let keys = this.routerMap.keys();
		for (let k of keys) {
			if (window.location.pathname.indexOf(k) >= 0) {
				tagName = this.routerMap.get(k);
			}
		}
		if (tagName) {
			window.scroll(0, 0);
			this.previousPath = window.location.pathname;
			const page = this.querySelector(":scope > :not(single-page-application-route)");
			if (page) {
				page.remove();
			}
			window.customElements.whenDefined(tagName).then(() => {
				this.appendChild(new(customElements.get(tagName)));
			});
		}
	}
});
window.customElements.define('single-page-application-route', class extends HTMLElement {
	constructor() {
		super();
		this.parentNode.addRoute(this.getAttribute("data-path"), this.getAttribute("data-element"));
		this.remove();
	}
});