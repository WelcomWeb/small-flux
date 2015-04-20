/**
* Small-Flux - Utility functions
*
* Collecting helper functions in a utility object.
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <http://opensource.org/licenses/Apache-2.0>
* @version 1.1.0
* @copyright Welcom Web i Göteborg AB 2015
*/

/*
 * Helper function to generate a unique id
 *
 * @returns			{String}
 */
var guid = function () {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10101).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports = {
	guid: guid
};