"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * AjaxTap.js
 * 
 * Listen in on any trusted XHR's made on your webpage.
 * Run functions when your conditions are met.
 * 
 * @author Nick Adams
 * @see {@link https://github.com/nickolasjadams/ajax-tap|Repository}
 * @license MIT
 * @version 1.0.4
 */
var AjaxTap = /*#__PURE__*/function () {
  function AjaxTap() {
    _classCallCheck(this, AjaxTap);
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
  _createClass(AjaxTap, [{
    key: "addResponseEvent",
    value: function addResponseEvent(options) {
      if (!options) {
        throw new Error("Event options are required.");
      }
      if (!options.conditions) {
        throw new Error("Event conditions are required.");
      }
      if (!options.fire) {
        throw new Error("Event must have something to fire in response to met conditions.");
      }
      var responseEvent = {
        trustedMessengers: [],
        conditions: null,
        fire: null
      };

      // Add all trusted messengers.
      responseEvent.trustedMessengers.push(window.location.origin); // Default: this origin
      if (options.trustedMessengers) {
        options.trustedMessengers.forEach(function (messenger) {
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
  }, {
    key: "listen",
    value: function listen() {
      if (this.responseEvents.length == 0) {
        throw new Error("This tap has no response events to listen to.");
      }
      try {
        var _this = this;
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
          this.addEventListener('load', function () {
            var _this2 = this;
            var matched = false;
            var origin = AjaxTap.url(this.responseURL).origin;
            _this.responseEvents.forEach(function (e) {
              if (!matched) {
                // Check if response comes from trusted messenger
                if (e.trustedMessengers.some(function (messenger) {
                  return origin.includes(messenger);
                })) {
                  // Parse data based on content-type
                  var contentType = _this2.getResponseHeader('content-type') || _this2.getResponseHeader('Content-Type');
                  var data;
                  if (!contentType) {
                    // Only handle if there is a response
                    if (contentType.includes("json")) {
                      data = JSON.parse(_this2.responseText);
                    } else if (contentType.includes("html")) {
                      // Return the Document
                      data = new DOMParser().parseFromString(_this2.responseText, "text/html");
                    } else if (contentType.includes("xml")) {
                      // Return the Document
                      data = _this2.responseXML;
                    } else if (contentType.includes("text")) {
                      data = _this2.responseText;
                    }
                    if (e.conditions(data)) {
                      // Fire function if conditions are met
                      matched = true;
                      e.fire(data);
                    }
                  }
                }
              }
            });
          });
          origOpen.apply(this, arguments);
        };
      } catch (e) {
        if (dev) {
          console.error(e);
        }
      }
    }

    /**
     * Get url properties from a String.
     * @returns {{hostname, protocol, search, port, origin: string, host, hash, pathname}}
     */
  }], [{
    key: "url",
    value: function url(str) {
      var a = document.createElement('a');
      a.setAttribute('href', str);
      var origin = a.protocol + '//' + a.hostname;
      if (a.port.length > 0) {
        origin = "".concat(origin, ":").concat(a.port);
      }
      var host = a.host,
        hostname = a.hostname,
        pathname = a.pathname,
        port = a.port,
        protocol = a.protocol,
        search = a.search,
        hash = a.hash;
      return {
        origin: origin,
        host: host,
        hostname: hostname,
        pathname: pathname,
        port: port,
        protocol: protocol,
        search: search,
        hash: hash
      };
    }
  }]);
  return AjaxTap;
}();
