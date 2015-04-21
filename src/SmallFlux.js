/**
* Small-Flux
*
* `SmallFlux` is the only object to expose to developers,
* allowing creation of an `Action` or a `Store`.
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <http://opensource.org/licenses/Apache-2.0>
* @version 1.1.0
* @copyright Welcom Web i Göteborg AB 2015
*/
var Action = require('./Action'),
    Store = require('./Store');

var SmallFlux = {
    /*
    * Instantiate an `Action`, with a unique name.
    *
    * @param name   {String}    A unique name for the `Action`
    * @returns      {Action}
    */
    createAction: function (name) {
        return new Action(name);
    },
    /*
    * Helper method to instantiate multiple `Action`s at once.
    *
    * @param names  {Array}     A list of unique names
    * @returns      {Object}    Containing all `Action`s with the name as key
    */
    createActions: function (names) {
        var actions = {};
        for (var i = 0; i < names.length; i++) {
            actions[names[i]] = new Action(names[i]);
        }
        return actions;
    },
    /*
    * Instantiate a `Store`, inheriting properties and
    * methods from the passed parameter.
    *
    * @param store  {Object}    An object with properties and methods for the `Store`
    * @returns      {Store}
    */
    createStore: function (store) {
        return new Store(store);
    }
};

module.exports = SmallFlux;