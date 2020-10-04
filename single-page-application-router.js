window.customElements.define('single-page-application-router', class extends HTMLElement {

    #routerMap = new Map();
    #previousPath;

    constructor() {
        super();
    }

    addRoute(path, customElementTagName) {
        this.#routerMap.set(path, customElementTagName);
        this.navigate();
    }

    connectedCallback() {
        const observer = new window.MutationObserver(function (mutations) {
            for (let a of document.querySelectorAll("a:not([data-suppressed])")) {
                a.setAttribute("data-suppressed", "");
                a.addEventListener("click", function (e) {
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
        if (this.#previousPath === window.location.pathname) {
            return true;
        }
        let tagName = null;
        let keys = this.#routerMap.keys();
        for (let k of keys) {
            if (window.location.pathname.indexOf(k) >= 0) {
                tagName = this.#routerMap.get(k);
            }
        }
        if (tagName) {
            window.scroll(0, 0);
            this.#previousPath = window.location.pathname;
            const page = this.querySelector(":scope > :not(app-route)");
            if (page) {
                page.remove();
            }
            this.appendChild(new (window.customElements.get(tagName)));
        }
    }
});

window.customElements.define('single-page-application-route', class extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.parentNode.addRoute(this.getAttribute("path"), this.getAttribute("element"));
        this.remove();
    }

});