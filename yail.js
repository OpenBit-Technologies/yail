// SPDX-FileCopyrightText: 2024 OpenBit Technologies
//
// SPDX-License-Identifier: MIT
"use strict";

const YailClass = (function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userLang = urlParams.get("lang") || navigator.language || navigator.userLanguage;
    const siteLang = document.getElementsByTagName("html")[0].getAttribute("lang") || "en-gb";
    const defaultAttribute = "i18n"

    var YailClass = function() {

        this.terms = {};
        this.strict = false;

        this.init = function(terms, strict=false, attribute=defaultAttribute) {
            this.terms = terms;
            this.strict = strict;
            this.attribute = attribute;
            console.debug(`User language is: ${userLang}`);
            console.debug(`Site language is: ${siteLang}`);
            console.debug(`Strict mode is: ${this.strict}`);
        };

        this.is_translatable = function() {
            if (this.strict)
                return siteLang != userLang;
            else
                return siteLang != userLang && siteLang.substring(0, 2) != userLang.substring(0, 2);
        };

        this.translate = function(force) {

            // Don't translate if default language is the selected language
            if (force || this.is_translatable()) {
                console.debug("Translating terms");

                const i18n_elements = document.querySelectorAll(`[${this.attribute}]`);
                for(let i = 0; i< i18n_elements.length; i++) {
                    let element = i18n_elements[i];
                    let placeholder = element.getAttribute(this.attribute);

                    if (placeholder) {
                        // Using en-GB as a example, it will try en-GB and then just en
                        let text = null;
                        try {
                            text = this.terms[placeholder][userLang] || this.terms[placeholder][userLang.substring(0 ,2)];
                        } catch(err) {
                            if (err instanceof TypeError)
                                console.error(`No mapping for ${placeholder}`);
                            else
                                console.error(err);
                        }
                        if (text)
                            element.innerText = text;
                        else
                            console.warn(`Unable to find translation in ${userLang} for ${placeholder}`);
                    }
                    else {
                        console.warn("Unable to find placeholder");
                    }
                }
            }
        };
    };

    return YailClass;
})();

const Yail = new YailClass();
