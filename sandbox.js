(function () {

    // Enable angular's deferred bootstrapping so that angular samples can do
    // manual bootstrapping without automatic bootstrapping also running.
    // https://docs.angularjs.org/guide/bootstrap
    window.name = "NG_DEFER_BOOTSTRAP!";

    function setHtml(html, isHtmlBody) {
        if (isHtmlBody) {
            document.body.innerHTML = html;
        } else {
            document.getElementById("content").innerHTML = html;
        }
    }

    function loadCss(css) {
        var style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function execJs(js) {
        try {
            eval('(function () { "use strict"; ' + js + '; })();');
        } catch (error) {
            var elt = document.createElement("pre");
            elt.textContent = "Error: " + error.message || JSON.stringify(error);
            var parent = document.getElementById("content") || document.body;
            parent.insertBefore(elt, parent.firstElementChild);
        }
    }

    // options is of type IViewerOptions
    function runSample(options) {
        var html = options.html;
        var script = options.script;
        var css = options.css;
        var navigationHome = options.navigationHome;
        var epilogueScript = options.epilogueScript;
        var isHtmlBody = !!options.isHtmlBody;
        var scriptDependencies = options.scriptDependencies || [];

        var htmlContent;
        if (navigationHome) {
            // Allow page navigation to work with the HTML string that the user has
            // edited on the web page.
            WinJS.UI.Pages.define(navigationHome, {
                load: function (uri) {
                    var root = document.createElement("div");
                    root.innerHTML = html;
                    return root;
                }
            });
            htmlContent = '<div data-win-control="WinJS.Site.PageControlNavigator" data-win-options="{}"></div>';
        } else {
            htmlContent = html;
        }

        // Load the script dependecies *sequentially* (e.g. Don't start loading the second dependency
        // until the first dependency has loaded. You wouldn't want angular-winjs.js to run before
        // anguluar.js has loaded.).
        var scriptDependenciesLoaded = scriptDependencies.reduce(function (p, src) {
            return p.then(function () {
                var script = document.createElement("script");
                script.src = src;
                var result = new WinJS.Promise(function (c) {
                    script.onload = function () {
                        c();
                    };
                });
                document.head.appendChild(script);
                return result;
            });
        }, WinJS.Promise.as());
        scriptDependenciesLoaded.then(function () {
            htmlContent && setHtml(htmlContent, isHtmlBody);
            css && loadCss(css);
            script && execJs(script);
            epilogueScript && execJs(epilogueScript);
            if (navigationHome) {
                return WinJS.UI.processAll().then(function () {
                    return WinJS.Navigation.navigate(navigationHome);
                });
            }
        });
    }

    WinJS.Namespace.define("WinJS.Sandbox", {
        runSample: runSample
    });

})();