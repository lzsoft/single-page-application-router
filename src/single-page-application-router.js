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
        let lastPathName = "";
        let map = {};
        // Suppress <a> element
        const observer = new MutationObserver(function (mutations) {
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
        // Construct map
        for (let r of this.querySelectorAll("single-page-application-route")) {
            map[r.getAttribute("data-pattern")] = r.getAttribute("data-element");
        }
        // Deal with popstate event
        window.addEventListener("popstate", async () => {
            if (lastPathName !== window.location.pathname) {
                lastPathName = window.location.pathname;
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
                let keys = Object.keys(map);
                for (let i = 0; i < keys.length; i++) {
                    if (p.indexOf(keys[i]) >= 0) {
                        t = map[keys[i]];
                    }
                }
                customElements.whenDefined(t).then(() => {
                    this.appendChild(new(customElements.get(t)));
                });
                this.classList.remove("disk");
            } else {
                //otherwise it's likely to be a hashchange
            }
        });
        window.addEventListener("load", (e) => {
            window.dispatchEvent(new Event("popstate"));
        });
    }
});