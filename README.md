# AjaxTap

[![npm version](https://badge.fury.io/js/@stegopop%2Fajax-tap.svg)](https://badge.fury.io/js/@stegopop%2Fajax-tap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Listen in on any trusted XHR's made on your webpage. Run functions when your conditions are met.

## Why?

Say we are performing CRUD operation with AJAX through our (or someone else's) API. 

And the API always returns this structure

```
{
    type: String (success|failure),
    message: String (A user-friendly message)
}
```

It's not mandatory that you return JSON. It could be JSON, HTML, XML, or plain Text.

In your main template you could listen to all Ajax requests, and if they have this structure and come from a URL origin you trust, you can display the message at the top of the page.

```js
<script src="/dist/ajax-tap.min.js"></script>
<script>
    (function() {
        new AjaxTap()
            .addResponseEvent({
                trustedMessengers: [ "a-different-domain-you-trust.com" ],
                conditions: function(data) {
                    // The response contains keys for 'type' and 'message'.
                    return (data.type && data.message)
                },
                fire: function(data) {
                    // Display the message at the top of the page.
                    var messages = document.querySelector("#messages");
                    var message = document.createElement("div");
                        message.classList.add(data.type);
                        message.innerText = data.message;
                    messages.appendChild(message);
                }
            })
            .listen();
    })();
</script>
```

## Install

With NPM

```markdown
npm install @stegopop/ajax-tap
```

With a CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@stegopop/ajax-tap"></script>
```

## Browser Support

This project is transpiled to support back to IE11.

## Methods

`addResponseEvent(options)`

Adds a Request Event to the Tap. You can add multiple Request Events to a Tap.
This method returns the Tap so you can chain off of it.
 
Request Event Object Options
 - trustedMessengers (optional): Array
     -  The origin of the calling website is included in trustedMessengers by default.
 - conditions        (required): Function
     - You must provide data as an argument to this function.
     - This function must return true or false.
 - fire              (required): Function
     - You must provide data as an argument to this function.
     - This function must return true or false.

`listen()`

Begin listening to ajax requests for each RequestEvent on the Tap.

`url(str)`

A static helper method to get url properties from a String.

Returns 
 - hostname
 - protocol
 - search
 - port
 - origin
 - string
 - host
 - hash
 - pathname
