// SPDX-FileCopyrightText: 2024 OpenBit Technologies
//
// SPDX-License-Identifier: MIT

"use strict";

const TERMS={
    "PAGE_TITLE": {
        "en": "Oh no!"
    },
    "TITLE": {
        "en": "TODO"
    },
    "MESSAGE_1": {
        "en": "TODO"
    },
    "MESSAGE_2": {
        "en": "TODO"
    }
}
const urlParams = new URLSearchParams(window.location.search);
const userLang = urlParams.get("lang") || navigator.language || navigator.userLanguage;
const siteLang = document.getElementsByTagName("html")[0].getAttribute("lang") || "en-gb";

console.debug(`User language is: ${userLang}`);
console.debug(`Site language is: ${siteLang}`);

// Don't translate if default language is the selected language
if (siteLang != userLang && siteLang.substring(0, 2) != userLang.substring(0, 2)) {
    console.debug("Translating terms");

    const i18n_elements = document.querySelectorAll("[i18n]");
    for(let i = 0; i< i18n_elements.length; i++) {
        let element = i18n_elements[i];
        let placeholder = element.getAttribute("i18n");

        if (placeholder) {
            // Using en-GB as a example, it will try en-GB and then just en
            let text = null;
            try {
                text = TERMS[placeholder][userLang] || TERMS[placeholder][userLang.substring(0 ,2)];
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
