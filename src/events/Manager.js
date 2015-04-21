/**
* Small-Flux - EventManager class
*
* The `EventManager` handles a map of event names, each
* with it's own queue of callback listeners. When an event
* is triggered, all listening callbacks will be called
* with an optional specified payload.
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <http://opensource.org/licenses/Apache-2.0>
* @version 1.2.0
* @copyright Welcom Web i Göteborg AB 2015
*/
var EventManager = function () {

    var queue = {};

    return {
        /*
        * Let a handler listen for an event.
        *
        * @param event      {String}    The event name
        * @param handler    {Function}  The handler of the event
        * @returns          {Function}  An unsubscribing function for the handler
        */
        on: function (event, handler) {
            if (!queue[event]) {
                queue[event] = [];
            }

            queue[event].push(handler);
            return this.off.bind(this, event, handler);
        },
        /*
        * Unsubscribe a handler from an event
        *
        * @param event      {String}    The event name
        * @param handler    {Function}  The handler to be unsubscribed
        * @returns          {Void}
        */
        off: function (event, handler) {
            if (!queue[event]) {
                return;
            }

            for (var i = 0; i < queue[event].length; i++) {
                if (queue[event][i] === handler) {
                    delete queue[event][i];
                    queue[event].splice(i, 1);
                    break;
                }
            }
        },
        /*
        * Trigger an event with a payload, and notify listeners
        *
        * @param event      {String}    The event name
        * @param payload    {Mixed}     An optional payload for the event
        * @returns          {Void}
        */
        trigger: function (event, payload) {
            if (!queue[event]) {
                return;
            }

            for (var i = 0; i < queue[event].length; i++) {
                queue[event][i](payload);
            }
        }
    };

}();

module.exports = EventManager;