window.customElements.define('single-page-application-router', class extends HTMLElement {
    get map() {
        // TBD
        const m = {
            "/index.html": "page-index",
            "/": "page-index",
            "/t/": "page-thing"
        };
        return m;
    }
    constructor() {
        super();
        let observer = new MutationObserver(function (mutations) {
            document.querySelectorAll("a:not([data-suppressed])").setAttribute("data-suppressed", true).addEventListener("click", function (e) {
                e.preventDefault();
                window.history.pushState(null, null, this.href);
                window.dispatchEvent(new Event("popstate"));
            });
        });
        // pass in the target node, as well as the observer options
        observer.observe(document, {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: true
        });
        window.addEventListener("popstate", (e) => {
            this.popState();
        });
        this.popState();
    }
    popState(e) {
        this.innerHTML = "";
        let p = window.location.pathname;
        let t = "";
        let keys = Object.keys(this.map);
        for (let i = 0; i < keys.length; i++) {
            if (p.indexOf(keys[i]) >= 0) {
                t = this.map[keys[i]];
            }
        }
        let c = window.customElements.get(t);
        if (c) {
            this.appendChild(new c());
        }
    }
});
window.customElements.define('single-page-application-route', class extends HTMLElement {
    // TBD
    constructor() {
        super();
    }
});
