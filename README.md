<!--
SPDX-FileCopyrightText: 2024 OpenBit Technologies

SPDX-License-Identifier: CC0-1.0
-->

# Yet Another i18n Library

yail is a i18n javascript library that targets simple websites that want to have localization without pulling a huge library (it has no other dependencies). 

A good use case for it, is a multi-language error page, like a HTTP 502 returned by NGINX.

yail let's you keep a user select language by using the ``lang`` query argument

## How to use
yail is delivered via [jsDelivr](https://www.jsdelivr.com/package/gh/openbit-technologies/yail), so you can pull the JS file from there.

Example
`<script src="https://cdn.jsdelivr.net/gh/openbit-technologies/yail@1.0.0/yail.min.js"></script>`

Set the default language on the ``<html>`` tag.

``<html lang="en-US">``

Create a JS object where each key is a language and the value is another object where each key is the translated version of a text.

You don't need to create a entry for your site default language, yail gets that information from the elements it self.
```
const terms = {
    "pt-PT": "{
        "title": "Bem-vindo ao meu site"
    },
    "es-ES": {
        "title": "Bienvenidos a mi sitio web"
    }
```

On the element you want to place the ``title`` translation, add a attribute named ``i18n`` with the value on the ``terms`` array. As for the text, set your language version of the translation. You can use another attribute instead of ``i18n``, just let yail know (see bellow)

```
<h1 i18n="title">Welcome to my website</h1>
```

Initialize a yail object and translate

```
var yail = new Yail(terms);
yail.translate();
```

Full example:
```
<!DOCTYPE html>
<html lang="en-US">
	<head>
		<title>yail</title>
	</head>
	<body>
		<h1 i18n="title">Welcome to my website</h1>
		<script src="https://cdn.jsdelivr.net/gh/openbit-technologies/yail@1.0.0/yail.min.js"></script>
		<script>
			const terms = {
				"pt-PT": "{
					"title": "Bem-vindo ao meu site"
				},
				"es-ES": {
					"title": "Bienvenidos a mi sitio web"
				}
			}
			var yail = new Yail(terms);
			yail.translate();
		</script>
	</body>
</html>
```

### Arguments
#### Constructor
| Argument | Type | Usage | Default
|--|--|--|--|
| terms | object | Translated terms | undefined
| strict | bool | If true, initial translation terms must match the full user language (ex: en-GB) instead of just the country-code (ex: **en**-GB) | false
| attribute | string | Custom element attribute that holds the translation key | i18n

#### yail.translate
| Argument | Type | Usage | Default
|--|--|--|--|
| language | string | Translate to these language terms | ``lang`` query argument or browser language
| force | bool | Forces the initial translation| false
| root | element | Root element where yail starts to look for translation elements | ``document``

