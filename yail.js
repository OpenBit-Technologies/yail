// SPDX-FileCopyrightText: 2024 OpenBit Technologies
//
// SPDX-License-Identifier: MIT
"use strict";

const yailDefaultAttribute = "i18n"

class Yail {
    constructor(terms, strict=false, attribute=yailDefaultAttribute) {
        this.terms = terms;
        this.strict = strict;
        this.attribute = attribute;
        console.debug(`User language is: ${this.userLang}`);
        console.debug(`Site language is: ${this.siteLang}`);
        console.debug(`Strict mode is: ${this.strict}`);
    }

    get userLang() {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("lang") || navigator.language || navigator.userLanguage;
    }

    get siteLang() {
        return document.getElementsByTagName("html")[0].getAttribute("lang") || "en-us";
    }

    translatable(language) {
        // Don't translate if default language is the selected language
        if (this.strict)
            return this.siteLang != language;
        else
            return this.siteLang != language && this.siteLang.substring(0, 2) != language.substring(0, 2);  // Using en-GB as a example, it will try en-GB and then just en
    }

    translate(force=false, language=undefined, root=document) {
        if (!language) {
            language = this.userLang;
        }

        if (force || this.translatable(language)) {
            console.debug(`Translating terms to ${language}`);

            const i18n_elements = root.querySelectorAll(`[${this.attribute}]`);
            for(let i = 0; i< i18n_elements.length; i++) {
                let element = i18n_elements[i];
                let placeholder = element.getAttribute(this.attribute);

                if (placeholder) {
                    let text = null;
                    try {
                        text = this.terms[placeholder][language] || this.terms[placeholder][language.substring(0 ,2)];
                    } catch(err) {
                        if (err instanceof TypeError)
                            console.error(`No mapping for ${placeholder}`);
                        else
                            console.error(err);
                    }
                    if (text)
                        element.innerText = text;
                    else
                        console.warn(`Unable to find translation in ${language} for ${placeholder}`);
                }
                else {
                    console.warn("Unable to find placeholder");
                }
            }
        }

    }
}
