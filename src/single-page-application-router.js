window.customElements.define('single-page-application-route', class extends HTMLElement {
    constructor() {
        super();
    }
});
window.customElements.define('single-page-application-router', class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var self = this;
        var map = {};
        // Suppress <a> element
        var observer = new MutationObserver(function(mutations) {
            for (var a of document.querySelectorAll("a:not([data-suppressed])")) {
                a.setAttribute("data-suppressed", true);
                a.addEventListener("click", function(e) {
                    e.preventDefault();
                    window.history.pushState(null, null, this.href);
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
        // Construct map
        for (var r of this.querySelectorAll("single-page-application-route")) {
            map[r.getAttribute("data-pattern")] = r.getAttribute("data-element");
        }
        // Deal with popstate event
        window.addEventListener("popstate", function(e) {
            self.classList.add("fade");
            window.setTimeout(function() {
                window.scroll(0, 0);
                self.innerHTML = "";
                var p = window.location.pathname;
                var t = "";
                var keys = Object.keys(map);
                for (var i = 0; i < keys.length; i++) {
                    if (p.indexOf(keys[i]) >= 0) {
                        t = map[keys[i]];
                    }
                }
                var c = window.customElements.get(t);
                if (c) {
                    self.appendChild(new c());
                } else {
                    console.log("Element not defined");
                }
                window.setTimeout(function() {
                    self.classList.remove("fade");
                }, 100);
            }, 100);
        });
        window.addEventListener("load", function(e) {
            window.dispatchEvent(new Event("popstate"));
        });
        window.addEventListener("WebComponentsReady", function(e) {
            window.dispatchEvent(new Event("popstate"));
        });
    }
});
