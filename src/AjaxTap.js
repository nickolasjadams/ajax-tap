/**
 * AjaxTap.js
 * 
 * Listen in on any trusted XHR's made on your webpage.
 * Run functions when your conditions are met.
 * 
 * @author Nick Adams
 * @see {@link https://github.com/nickolasjadams/ajax-tap|Repository}
 * @license MIT
 * @version 1.0.1
 */

class AjaxTap {
    
    constructor() {
        this.responseEvents = [];
        this.dev = false;
    }

    /**
     * Adds a Request Event to the Tap. You can add multiple Request Events to a Tap.
     * This method returns the Tap so you can chain off of it.
     * 
     * Request Event
     * - trustedMessengers (optional): Array
     * - conditions        (required): Function
     * - fire              (required): Function
     * 
     * @param Object options 
     * @returns AjaxTap
     */
    addResponseEvent(options) {
        if (!options) { throw new Error("Event options are required."); }
        if (!options.conditions) { throw new Error("Event conditions are required."); }
        if (!options.fire) { throw new Error("Event must have something to fire in response to met conditions."); }

        let responseEvent = {
            trustedMessengers: [],
            conditions: null,
            fire: null
        };

        // Add all trusted messengers.
        responseEvent.trustedMessengers.push(window.location.origin); // Default: this origin
        if (options.trustedMessengers) {
            options.trustedMessengers.forEach(messenger => {
                responseEvent.trustedMessengers.push(messenger);
            });
        }

        // Set the conditions that the response data must meet.
        responseEvent.conditions = options.conditions;

        // Set the function that will fire when this event conditions are met.
        responseEvent.fire = options.fire;

        this.responseEvents.push(responseEvent);

        return this;
    }

    /**
     * Begin listening to ajax requests for each RequestEvent on the Tap.
     */
    listen() {
        if (this.responseEvents.length == 0) { throw new Error("This tap has no response events to listen to."); }

        try {
            let _this = this;
            var origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener('load', function() {

                    let matched = false;
                    let origin = AjaxTap.url(this.responseURL).origin;
    
                    _this.responseEvents.forEach(e => {
                        if (!matched) {
                            if (e.trustedMessengers.some( messenger => messenger == origin )) {
                                var contentType = this.getResponseHeader('content-type');
                                let data;
                                if (contentType.includes("json")) {
                                    data = JSON.parse(this.responseText);
                                } else if (contentType.includes("html")) {
                                    // Return the Document
                                    data = (new DOMParser).parseFromString(this.responseText, "text/html");
                                } else if (contentType.includes("xml")) {
                                    // Return the Document
                                    data = this.responseXML;
                                } else if (contentType.includes("text")) {
                                    data = this.responseText;
                                }
    
                                if (e.conditions(data)) {
                                    matched = true;
                                    e.fire(data);
                                }
                            }
                        }
                    });
                });
                origOpen.apply(this, arguments);
            };
        } catch(e) {
            if (dev) {
                console.error(e);
            }
        }
    }

    /**
     * Get url properties from a String.
     * @returns {{hostname, protocol, search, port, origin: string, host, hash, pathname}}
     */
    static url(str) {
        let a = document.createElement('a');
        a.setAttribute('href', this);
        let origin = a.protocol + '//' + a.hostname;
        if (a.port.length > 0) {
            origin = `${origin}:${a.port}`;
        }
        let {host, hostname, pathname, port, protocol, search, hash} = a;
        return {origin, host, hostname, pathname, port, protocol, search, hash};
    }
}