# AjaxTap

[![npm version](https://badge.fury.io/js/ajax-tap.svg)](//npmjs.com/package/@stegopop/ajax-tap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Listen in on any trusted XHR's made on your webpage. Run functions when your conditions are met.

## Why?

Say we are performing CRUD operation with AJAX through our API. 

And our API always returns this structure

```
{
    type: String (success|failure),
    message: String (A user-friendly message)
}
```

In your main template you could listen to all Ajax requests, and if they have this structure and come from a URL origin you trust, you can display the message at the top of the page.

```
<script src="/dist/ajax-tap.min.js"></script>
<script>
    new AjaxTap()
        .addResponseEvent({
            conditions: function(data) {
                return (data.type && data.message)
            },
            fire: function(data) {
                var messages = document.querySelector("#messages");
                var message = document.createElement("div");
                    message.classList.add(data.type);
                    message.innerText = data.message;
                messages.appendChild(message);
            }
        })
        .listen();
</script>
```

## Install

With NPM

```
npm install @stegopop/ajax-tap
```

With a CDN

```
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
 - conditions        (required): Function
 - fire              (required): Function

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
