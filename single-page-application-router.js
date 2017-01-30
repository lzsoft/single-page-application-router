window.customElements.define('single-page-application-router', class extends HTMLElement {
    constructor() {
        super();
        const map = {};
        // Suppress <a> element
        let observer = new MutationObserver(function(mutations) {
            document.querySelectorAll("a:not([data-suppressed])").setAttribute("data-suppressed", true).addEventListener("click", function(e) {
                e.preventDefault();
                window.history.pushState(null, null, this.href);
                window.dispatchEvent(new Event("popstate"));
            });
        });
        observer.observe(document, {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: true
        });
        // Construct map
        this.querySelectorAll(":scope > single-page-application-route").exec(function(el) {
            map[el.getAttribute("data-pattern")] = el.getAttribute("data-element");
        });
        // Deal with popstate event
        window.addEventListener("popstate", (e) => {
            this.innerHTML = "";
            let p = window.location.pathname;
            let t = "";
            let keys = Object.keys(map);
            for (let i = 0; i < keys.length; i++) {
                if (p.indexOf(keys[i]) >= 0) {
                    t = map[keys[i]];
                }
            }
            let c = window.customElements.get(t);
            if (c) {
                this.appendChild(new c());
            } else {
                console.log("Element not defined");
            }
        });
        window.addEventListener("load", (e) => {
            window.dispatchEvent(new Event("popstate"));
        });
    }
});
window.customElements.define('single-page-application-route', class extends HTMLElement {
    constructor() {
        super();
    }
});
