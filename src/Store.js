/**
* Small-Flux - Store class
*
* The `Store` is a central unit when using Flux or Small-Flux,
* which stores and handles entities. Usually an `Action` is triggering
* some form of update to a `Store` (adding/removing/updating an entity)
* which in turn notify any listeners after the task is performed.
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <http://opensource.org/licenses/Apache-2.0>
* @version 1.1.0
* @copyright Welcom Web i Göteborg AB 2015
*/
var EventManager = require('./events/Manager'),
	Utils = require('./utils/Utils');

/*
 * A Small-Flux store have some methods that shouldn't
 * be overriden, so we use a keyword filter for these.
 */
var keywords = ['observe', 'forget', 'notify', 'attach', 'detach'];

/*
 * Class constructor
 *
 * @param store 	{Object}	Properties and methods for the store
 * @returns 		{Store}
 */
var Store = function (store) {
	/*
	 * `store` contains properties and methods that should
	 * be attributed to the generated `Store` instance,
	 * so lets add them upon creation.
	 */
	for (var prop in store) {
		if (store.hasOwnProperty(prop) && keywords.indexOf(prop) < 0) {
			if (typeof store[prop] === 'function') {
				this[prop] = store[prop].bind(this);
			} else {
				this[prop] = store[prop];
			}
		}
	}
	this.id = Utils.guid();
	!!this.initialize ? this.initialize() : false;
};
/*
 * Attach a callback for an action event, so when an
 * action is triggered - this store can handle it.
 *
 * @param action 	{Action} 	An instance of an action
 * @param callback	{Function} 	Callback handling logic
 * @returns 		{Function} 	A function that unsubscribes from the event
 */
Store.prototype.observe = function (action, callback) {
	return EventManager.on(action.id, callback);
};
/*
 * Detach a callback from an action event.
 *
 * @param action 	{Action} 	An instance of an action
 * @param callback 	{Function} 	The subscribing callback
 * @returns 		{Void}
 */
Store.prototype.forget = function (action, callback) {
	EventManager.off(action.id, callback);
};
/*
 * A helper method to notify all listening
 * subscribers of a change.
 *
 * @returns 		{Void}
 */
Store.prototype.notify = function () {
	EventManager.trigger(this.id);
};
/*
 * Attach a listener for changes in a `Store`
 *
 * @param callback 	{Function} 	Callback handling logic
 * @returns 		{Function} 	A function that unsubscribes the listener
 */
Store.prototype.attach = function (callback) {
	return EventManager.on(this.id, callback);
};
/*
 * Detach a listener from any change events.
 *
 * @param callback 	{Function} 	The subscribing callback
 * @returns 		{Void}
 */
Store.prototype.detach = function (callback) {
	EventManager.off(this.id, callback);
};

module.exports = Store;