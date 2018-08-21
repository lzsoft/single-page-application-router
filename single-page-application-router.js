{
	const ATTR_MULTI_PAGE_MODE = "data-multi-page-mode";
	const ROUTER_MAP = new Map();
	let previousPathName = "";
	window.customElements.define('single-page-application-route', class extends HTMLElement {
		constructor() {
			super();
		}
	});
	window.customElements.define('single-page-application-router', class extends HTMLElement {
		constructor() {
			super();
		}
		async connectedCallback() {
			if (this.hasAttribute(ATTR_MULTI_PAGE_MODE)) {
				// Do nothing if we're running in classic multi page mode
			} else {
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
			}
			// Construct map
			for (let r of this.querySelectorAll("single-page-application-route")) {
				ROUTER_MAP.set(r.getAttribute("data-pattern"), r.getAttribute("data-element"));
			}
			// Deal with popstate event
			await this.navigate();
		}
		async navigate() {
			if (previousPathName !== window.location.pathname) {
				previousPathName = window.location.pathname;
				let tt = parseFloat(window.getComputedStyle(this).getPropertyValue('--single-page-application-router-transition-time').replace('s', '')) * 1000;
				this.classList.add("fade");
				await window.avalon.util.sleep(tt);
				this.classList.add("disk");
				this.classList.remove("fade");
				let z = this.offsetTop;
				window.scroll(0, 0);
				this.innerHTML = "";
				let p = window.location.pathname;
				let t = "";
				let keys = ROUTER_MAP.keys();
				for (let k of keys) {
					if (p.indexOf(k) >= 0) {
						t = ROUTER_MAP.get(k);
					}
				}
				customElements.whenDefined(t).then(() => {
					this.appendChild(new(customElements.get(t)));
				});
				this.classList.remove("disk");
			} else {
				//otherwise it's likely to be a hashchange
			}
		}
	});
}