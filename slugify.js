(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
        } else {
                root.slugify = factory(root);
        }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

        'use strict';

    /*** Private Methods */

    function extendDefaults(defaults, properties) {
        Object.keys(properties).forEach(property => {
            if(properties.hasOwnProperty(property)) {
                defaults[property] = properties[property];
            }
        });

        return defaults;
    }

    function toSlugify(text) {
        return text.toString().toLowerCase().trim()
            .normalize("NFD")                /* separate accent from letter */
            .replace(/[\u0300-\u036f]/g, "") /* remove all separated accents */
            .replace(/\s+/g, "_")            /* replace spaces with _ */
            .replace(/&/g, "-")              /* replace & with "-" */
            .replace(/[^\w\-]+/g, "")        /* remove all non-word chars */
            .replace(/--+/g, "-")            /* replace multiple "-" with single "-" */
    }

    function buildEnableMonitor(string) {
        let settings = this.getSettings();
        elMonitor = document.querySelectorAll(string);
        [].forEach.call(elMonitor, function(el) {
            if(el.tagName == "INPUT" && el.type == "checkbox")
                settings.enable = el.checked;
        });
    }

    function buildSourceElement(element) {
        if(this.getSettings().enable == true) {
            if(typeof element !== "object")
                element = document.querySelectorAll(element);

            let targetElement = this.getTargetElement();
            let settings = this.getSettings();

            [].forEach.call(element, function(elSource) {
                elSource.addEventListener("focusout", (event) => {
                    if(elSource.tagName == "TEXTAREA" || (elSource.tagName == "INPUT" && elSource.type == "text")) {
                        let slugResult = toSlugify(elSource.value);
                        if(settings.mode == "replace")
                            elSource.value = slugResult;

                        if(targetElement !== false) {
                            if(typeof targetElement !== "object")
                                targetElement = document.querySelectorAll(targetElement);

                            [].forEach.call(targetElement, function(elTarget) {
                                if(elTarget.tagName == "TEXTAREA" || (elTarget.tagName == "INPUT" && elTarget.type == "text")) {
                                    if(settings.mode == "replace" || settings.mode == "target" || (settings.mode == "fill" && elTarget.value.trim().replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "") == ""))
                                        elTarget.value = slugResult;
                                }
                                else
                                    elTarget.innerHTML = slugResult;
                            });
                        }
                    }
                });
            });
        }
    }

    function buildTargetElement(element) {
        if(this.getSettings().enable == true)
            if(element !== false) {
                let sourceElement = document.querySelectorAll(this.getSourceElement());
                
                if(typeof element !== "object")
                    element = document.querySelectorAll(element);

                [].forEach.call(element, function(el) {
                    el.addEventListener("focusout", (event) => {
                        if(el.tagName == "TEXTAREA" || (el.tagName == "INPUT" && el.type == "text"))
                            el.value = toSlugify(el.value);

                        if(el.value.trim().replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "") == "")
                            [].forEach.call(sourceElement, function(source) {
                                el.value = toSlugify(source.value);
                            });
                    });
                });
            }
    }


    /*** Register plugin in window object */

    function slugify (element, params) {
        let defaults = {
            enable: true, /* boolean or Html Element(checkbox), to allow plugin running */
            targetElement: false, /* boolean or HTML Element */
            mode: "replace", /* "replace" slugify result to element and targetElement, "target" slugify result only to targetElement, "fill" slugify result only to targetElement if the target element is empty */
        };

        let settings = (arguments[1] && typeof arguments[1] === "object") ? extendDefaults(defaults, arguments[1]) : defaults;
        let sourceElement = element;
        let targetElement = settings.targetElement;

        this.getSettings = function() {
            return settings;
        }

        this.getSourceElement = function() {
            return sourceElement;
        }

        this.getTargetElement = function() {
            return targetElement;
        }

        this.init();
    }


    /*** Public Methods */

    slugify.prototype.init = function() {
        if(typeof this.getSettings().enable === "string")
            buildEnableMonitor.call(this, this.getSettings().enable);
        buildSourceElement.call(this, this.getSourceElement());
        buildTargetElement.call(this, this.getTargetElement());
    }

    return slugify;
});
