// SPDX-FileCopyrightText: 2024 OpenBit Technologies
//
// SPDX-License-Identifier: MIT
"use strict";

const yailDefaultAttribute = "i18n";

class Yail {
    constructor(terms, strict=false, attribute=yailDefaultAttribute) {
        // Main class to translate dom elements
        // Args:
        //  terms (object): Translated terms to be applied to the dom
        //  strict (bool): If true, the applied translated match the full user language (en-GB)
        //                 instead of only the country code (en)
        //  attribute: Custom element attribute to get the translated keyworrd
        this.terms = terms;
        this.strict = strict;
        this.attribute = attribute;
        this.first_translation = true; // Used to detect the first translation

        // Create site lang entry in terms
        // It's going to be populated during the first translation
        if (!(this.siteLang in this.terms)) {
            this.terms[this.siteLang] = {};
        }
        console.debug(`User language is: ${this.userLang}`);
        console.debug(`Site language is: ${this.siteLang}`);
        console.debug(`Strict mode is: ${this.strict}`);
    }

    get userLang() {
        // Get the user language based on lang query argument or the browser
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("lang") || navigator.language || navigator.userLanguage;
    }

    get siteLang() {
        // Get the site language from <html> lang attribute. Default to en-us
        return document.getElementsByTagName("html")[0].getAttribute("lang") || "en-us";
    }

    check_language(language) {
        // Check if a language is available in this.terms
        //
        // Args:
        //  language (str): Target language

        if (this.strict) {
            return language in this.terms;
        } else {
            return language in this.terms || language.substring(0, 2) in this.terms;
        }
    }

    translatable(language) {
        // Check if translation is needed
        //
        // Args:
        //  language (str): Target language

        // Always translate on first iteration
        if (!this.first_translation) {
            return true;
        }

        // Don't translate if default language is the selected language
        if (this.strict) {
            return this.siteLang != language;
        } else {
            return this.siteLang != language && this.siteLang.substring(0, 2) != language.substring(0, 2);  // Using en-GB as a example, it will try en-GB and then just en
        }
    }

    translate(language=undefined, force=false, root=document) {
        // Apply translation
        //
        // Args:
        //  language (str): Target language. Defaults to this.userLang
        //  force (bool): If true, translation is always applied
        //  root (element): Root element to apply translation
        if (!language) {
            language = this.userLang;
        }

        const lang_code = language.substring(0, 2);

        if (!this.check_language(language)) {
            console.error(`No terms for language ${language}`);
            return false;
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
                        text = this.terms[language][placeholder];
                    } catch {
                        if (!this.strict) {
                            try {
                                text = this.terms[lang_code][placeholder];
                            } catch {
                                console.error(`No mapping for ${placeholder}`);
                            }
                        }
                    }
                    if (text) {
                        // Save a backup of the original (default) value
                        if (!(placeholder in this.terms[this.siteLang])) {
                            this.terms[this.siteLang][placeholder] = element.innerText;
                        }
                        element.innerText = text;
                    } else {
                        console.warn(`Unable to find translation in ${language} for ${placeholder}`);
                    }
                }
                else {
                    console.warn("Unable to find placeholder");
                }
            }
        }

        if (this.first_translation) {
            this.first_translation = false;
        }
    }
}
