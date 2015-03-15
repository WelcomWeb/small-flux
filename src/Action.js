/**
* Small-Flux - Actions class
*
* An `Action` is an object being passed between classes,
* allowing listeners to handle changes when an action is
* triggered.
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <http://opensource.org/licenses/Apache-2.0>
* @version 1.0.0
* @copyright Welcom Web i Göteborg AB 2015
*/
var EventManager = require('./events/Manager');

/*
 * Class constructor
 *
 * @param name 		{String} 	The name of the action
 * @returns 		{Action}
 */
var Action = function (name) {
	this.name = name;
};
/*
 * Trigger the event, notifying any listeners.
 *
 * @param payload 	{Mixed} 	An optional payload for the event
 * @returns 		{Void}
 */
Action.prototype.trigger = function (payload) {
	EventManager.trigger(this.name, payload);
};

module.exports = Action;