(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
	TodoView = require('./views/Todo');

window.addEventListener('load', function onpageload(event) {
	window.removeEventListener('load', onpageload, false);

	React.render(React.createElement(TodoView, null), document.getElementById('todo-application'));
}, false);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./views/Todo":13}],2:[function(require,module,exports){
/**
* Small-Flux
*
* Small-Flux is an event based, really small, library for Flux-like
* development. It has a small footprint, while yet being able to handle
* most use cases for an application striving to make use of Flux.
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <http://opensource.org/licenses/Apache-2.0>
* @version 1.1.0
* @copyright Welcom Web i Göteborg AB 2015
*/
module.exports = require('./src/SmallFlux');
},{"./src/SmallFlux":4}],3:[function(require,module,exports){
/**
* Small-Flux - Actions class
*
* An `Action` is an object being passed between classes,
* allowing listeners to handle changes when an action is
* triggered.
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <http://opensource.org/licenses/Apache-2.0>
* @version 1.1.0
* @copyright Welcom Web i Göteborg AB 2015
*/
var EventManager = require('./events/Manager'),
	Utils = require('./utils/Utils');

/*
 * Class constructor
 *
 * @param name 		{String} 	The name of the action
 * @returns 		{Action}
 */
var Action = function (name) {
	this.name = name;
	this.id = Utils.guid();
};
/*
 * Trigger the event, notifying any listeners.
 *
 * @param payload 	{Mixed} 	An optional payload for the event
 * @returns 		{Void}
 */
Action.prototype.trigger = function (payload) {
	EventManager.trigger(this.id, payload);
};

module.exports = Action;
},{"./events/Manager":6,"./utils/Utils":7}],4:[function(require,module,exports){
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
	 * @param name 		{String} 	A unique name for the `Action`
	 * @returns 		{Action}
	 */
	createAction: function (name) {
		return new Action(name);
	},
	/*
	 * Helper method to instantiate multiple `Action`s at once.
	 *
	 * @param names 	{Array} 	A list of unique names
	 * @returns 		{Object} 	Containing all `Action`s with the name as key
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
	 * @param store 	{Object} 	An object with properties and methods for the `Store`
	 * @returns 		{Store}
	 */
	createStore: function (store) {
		return new Store(store);
	}
};

module.exports = SmallFlux;
},{"./Action":3,"./Store":5}],5:[function(require,module,exports){
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
},{"./events/Manager":6,"./utils/Utils":7}],6:[function(require,module,exports){
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
* @version 1.1.0
* @copyright Welcom Web i Göteborg AB 2015
*/
var EventManager = function () {

	var queue = {};

	return {
		/*
		 * Let a handler listen for an event.
		 *
		 * @param event 	{String} 	The event name
		 * @param handler 	{Function} 	The handler of the event
		 * @returns 		{Function} 	An unsubscribing function for the handler
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
		 * @param event 	{String} 	The event name
		 * @param handler 	{Function} 	The handler to be unsubscribed
		 * @returns 		{Void}
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
		 * @param event 	{String} 	The event name
		 * @param payload 	{Mixed} 	An optional payload for the event
		 * @returns 		{Void}
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
var SmallFlux = require('small-flux');

var TodoActions = SmallFlux.createActions(['create', 'remove', 'read', 'unread']);

module.exports = TodoActions;

},{"small-flux":2}],9:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
	TodoActions = require('../actions/Todo');

var TodoItemForm = React.createClass({displayName: "TodoItemForm",
	getInitialState: function () {
		return { title: '', description: '' };
	},
	onChangeTitle: function () {
		this.setState({ title: this.refs.title.getDOMNode().value });
	},
	onChangeDescription: function () {
		this.setState({ description: this.refs.description.getDOMNode().value });
	},
	doSaveTodo: function () {
		TodoActions.create.trigger({ title: this.state.title, description: this.state.description });
		var state = {};
		this.refs.title.getDOMNode().value = state.title = '';
		this.refs.description.getDOMNode().value = state.description = '';
		this.setState(state);
	},
	render: function () {

		return (
			React.createElement("div", {className: "form"}, 
				React.createElement("label", {htmlFor: "title"}, "Title"), 
				React.createElement("input", {type: "text", id: "title", ref: "title", placeholder: "Please specify a title for the todo", defaultValue: this.state.title, onChange: this.onChangeTitle}), 
				React.createElement("label", {htmlFor: "description"}, "Description"), 
				React.createElement("textarea", {id: "description", ref: "description", rows: "6", defaultValue: this.state.description, onChange: this.onChangeDescription}), 
				React.createElement("button", {type: "button", onClick: this.doSaveTodo}, "Save")
			)
		);

	}
});

module.exports = TodoItemForm;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../actions/Todo":8}],10:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
	TodoListItem = require('./TodoListItem');

var TodoItemList = React.createClass({displayName: "TodoItemList",
	render: function () {

		return (
			React.createElement("ul", null, 
				this.props.todos.map(function (todo) {
					return React.createElement(TodoListItem, {key: todo.created_at, todo: todo});
				})
			)
		);

	}
});

module.exports = TodoItemList;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./TodoListItem":11}],11:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
	TodoActions = require('../actions/Todo');

var padDate = function (value) {
	if (("" + value).length == 1) {
		return "0" + value;
	}

	return value;
};

var dateFormat = function (date) {
	return date.getFullYear() + "-" + padDate(date.getMonth()) + "-" + padDate(date.getDate()) + " @ " + padDate(date.getHours()) + ":" + padDate(date.getMinutes());
};

var TodoListItem = React.createClass({displayName: "TodoListItem",
	getInitialState: function () {
		return { open: false };
	},
	doToggleDescription: function () {
		if (this.props.todo.is_unread && !this.state.open) {
			TodoActions.read.trigger(this.props.todo);
		}

		this.setState({ open: !this.state.open });
	},
	doMarkAsUnread: function () {
		TodoActions.unread.trigger(this.props.todo);
	},
	doRemove: function () {
		TodoActions.remove.trigger(this.props.todo);
	},
	render: function () {

		var star = null,
			cssClassName = "closed";

		if (this.props.todo.is_unread) {
			star = React.createElement("span", {className: "unread"}, "*");
		}

		if (this.state.open) {
			cssClassName = "open";
		}

		return (
			React.createElement("li", {className: cssClassName}, 
				React.createElement("h3", {onClick: this.doToggleDescription}, star, this.props.todo.title, " ", React.createElement("span", {className: "created_at"}, dateFormat(this.props.todo.created_at))), 
				React.createElement("div", {className: "description"}, 
					React.createElement("p", null, this.props.todo.description)
				), 
				React.createElement("div", {className: "settings"}, 
					React.createElement("a", {href: "javascript:void(0);", onClick: this.doMarkAsUnread, className: "left"}, "Mark as unread"), 
					React.createElement("a", {href: "javascript:void(0);", onClick: this.doRemove, className: "right"}, "Delete todo"), 
					React.createElement("div", {className: "clear"})
				)
			)
		);

	}
});

module.exports = TodoListItem;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../actions/Todo":8}],12:[function(require,module,exports){
var SmallFlux = require('small-flux'),
	TodoActions = require('../actions/Todo');

var TodoStore = SmallFlux.createStore({
	initialize: function () {
		this.todos = [];

		this.observe(TodoActions.create, this.createTodo);
		this.observe(TodoActions.remove, this.removeTodo);
		this.observe(TodoActions.read, this.markTodoAsRead);
		this.observe(TodoActions.unread, this.markTodoAsUnread);
	},
	createTodo: function (payload) {
		this.todos.push({
			title: payload.title,
			description: payload.description,
			is_unread: true,
			created_at: new Date()
		});
		this.notify();
	},
	removeTodo: function (payload) {

		var index = -1;
		for (var i = 0; i < this.todos.length; i++) {
			if (this.todos[i].created_at == payload.created_at) {
				index = i;
				break;
			}
		}

		if (index >= 0) {
			delete this.todos[index];
			this.todos.splice(index, 1);
			this.notify();
		}

	},
	markTodoAsRead: function (payload) {

		for (var i = 0; i < this.todos.length; i++) {
			if (this.todos[i].created_at == payload.created_at) {
				this.todos[i].is_unread = false;
				this.notify();
				break;
			}
		}

	},
	markTodoAsUnread: function (payload) {

		for (var i = 0; i < this.todos.length; i++) {
			if (this.todos[i].created_at == payload.created_at) {
				this.todos[i].is_unread = true;
				this.notify();
				break;
			}
		}

	},

	getTodos: function () {
		return this.todos;
	}
});

module.exports = TodoStore;

},{"../actions/Todo":8,"small-flux":2}],13:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null),
	TodoStore = require('../stores/Todo'),
	TodoItemList = require('../components/TodoList'),
	TodoItemForm = require('../components/TodoItemForm');

var TodoView = React.createClass({displayName: "TodoView",
	getInitialState: function () {
		return { todos: [] };
	},
	componentWillMount: function () {
		TodoStore.attach(this.update);
	},
	update: function () {
		this.setState({ todos: TodoStore.getTodos() });
	},
	render: function () {

		var count = this.state.todos.length,
			prefix = null,
			unread = 0;

		if (count != 1) {
			prefix = "s";
		}

		unread = this.state.todos.filter(function (todo) {
			return !!todo.is_unread;
		}).length;

		var counter = React.createElement("span", null, "You have ", count, " todo", prefix, ", and ", unread, " of them are unread.");

		return (
			React.createElement("div", {className: "view"}, 
				React.createElement("div", {className: "todo-counter"}, counter), 
				React.createElement(TodoItemList, {todos: this.state.todos}), 
				React.createElement("hr", null), 
				React.createElement(TodoItemForm, null)
			)
		);

	}
});

module.exports = TodoView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../components/TodoItemForm":9,"../components/TodoList":10,"../stores/Todo":12}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYmpvcm53aWtzdHJvbS9EZXZlbG9wbWVudC9HaXRIdWIvc21hbGwtZmx1eC9leGFtcGxlcy93d3cvamF2YXNjcmlwdHMvYXBwbGljYXRpb24uanMiLCJub2RlX21vZHVsZXMvc21hbGwtZmx1eC9zbWFsbC1mbHV4LmpzIiwibm9kZV9tb2R1bGVzL3NtYWxsLWZsdXgvc3JjL0FjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9zbWFsbC1mbHV4L3NyYy9TbWFsbEZsdXguanMiLCJub2RlX21vZHVsZXMvc21hbGwtZmx1eC9zcmMvU3RvcmUuanMiLCJub2RlX21vZHVsZXMvc21hbGwtZmx1eC9zcmMvZXZlbnRzL01hbmFnZXIuanMiLCJub2RlX21vZHVsZXMvc21hbGwtZmx1eC9zcmMvdXRpbHMvVXRpbHMuanMiLCIvVXNlcnMvYmpvcm53aWtzdHJvbS9EZXZlbG9wbWVudC9HaXRIdWIvc21hbGwtZmx1eC9leGFtcGxlcy93d3cvamF2YXNjcmlwdHMvYWN0aW9ucy9Ub2RvLmpzIiwiL1VzZXJzL2Jqb3Jud2lrc3Ryb20vRGV2ZWxvcG1lbnQvR2l0SHViL3NtYWxsLWZsdXgvZXhhbXBsZXMvd3d3L2phdmFzY3JpcHRzL2NvbXBvbmVudHMvVG9kb0l0ZW1Gb3JtLmpzIiwiL1VzZXJzL2Jqb3Jud2lrc3Ryb20vRGV2ZWxvcG1lbnQvR2l0SHViL3NtYWxsLWZsdXgvZXhhbXBsZXMvd3d3L2phdmFzY3JpcHRzL2NvbXBvbmVudHMvVG9kb0xpc3QuanMiLCIvVXNlcnMvYmpvcm53aWtzdHJvbS9EZXZlbG9wbWVudC9HaXRIdWIvc21hbGwtZmx1eC9leGFtcGxlcy93d3cvamF2YXNjcmlwdHMvY29tcG9uZW50cy9Ub2RvTGlzdEl0ZW0uanMiLCIvVXNlcnMvYmpvcm53aWtzdHJvbS9EZXZlbG9wbWVudC9HaXRIdWIvc21hbGwtZmx1eC9leGFtcGxlcy93d3cvamF2YXNjcmlwdHMvc3RvcmVzL1RvZG8uanMiLCIvVXNlcnMvYmpvcm53aWtzdHJvbS9EZXZlbG9wbWVudC9HaXRIdWIvc21hbGwtZmx1eC9leGFtcGxlcy93d3cvamF2YXNjcmlwdHMvdmlld3MvVG9kby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQzVCLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFcEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxTQUFTLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDM0QsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Q0FFdEQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxRQUFRLEVBQUEsSUFBQSxDQUFHLENBQUEsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztDQUN4RSxFQUFFLEtBQUssQ0FBQzs7Ozs7QUNQVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUcsQ0FBQSxFQUFBO0lBQ3pDLG9CQUFBLElBQUcsRUFBQSxJQUFBLENBQUcsQ0FBQSxFQUFBO0lBQ04sb0JBQUMsWUFBWSxFQUFBLElBQUEsQ0FBRyxDQUFBO0dBQ1gsQ0FBQTtBQUNULElBQUk7O0VBRUY7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblx0VG9kb1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL1RvZG8nKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiBvbnBhZ2Vsb2FkKGV2ZW50KSB7XG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25wYWdlbG9hZCwgZmFsc2UpO1xuXG5cdFJlYWN0LnJlbmRlcig8VG9kb1ZpZXcgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2RvLWFwcGxpY2F0aW9uJykpO1xufSwgZmFsc2UpOyIsIi8qKlxuKiBTbWFsbC1GbHV4XG4qXG4qIFNtYWxsLUZsdXggaXMgYW4gZXZlbnQgYmFzZWQsIHJlYWxseSBzbWFsbCwgbGlicmFyeSBmb3IgRmx1eC1saWtlXG4qIGRldmVsb3BtZW50LiBJdCBoYXMgYSBzbWFsbCBmb290cHJpbnQsIHdoaWxlIHlldCBiZWluZyBhYmxlIHRvIGhhbmRsZVxuKiBtb3N0IHVzZSBjYXNlcyBmb3IgYW4gYXBwbGljYXRpb24gc3RyaXZpbmcgdG8gbWFrZSB1c2Ugb2YgRmx1eC5cbipcbiogQGF1dGhvciBCasO2cm4gV2lrc3Ryw7ZtIDxiam9ybkB3ZWxjb20uc2U+XG4qIEBsaWNlbnNlIEFwYWNoZSBMaWNlbnNlIDIuMCA8aHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0FwYWNoZS0yLjA+XG4qIEB2ZXJzaW9uIDEuMS4wXG4qIEBjb3B5cmlnaHQgV2VsY29tIFdlYiBpIEfDtnRlYm9yZyBBQiAyMDE1XG4qL1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9TbWFsbEZsdXgnKTsiLCIvKipcbiogU21hbGwtRmx1eCAtIEFjdGlvbnMgY2xhc3NcbipcbiogQW4gYEFjdGlvbmAgaXMgYW4gb2JqZWN0IGJlaW5nIHBhc3NlZCBiZXR3ZWVuIGNsYXNzZXMsXG4qIGFsbG93aW5nIGxpc3RlbmVycyB0byBoYW5kbGUgY2hhbmdlcyB3aGVuIGFuIGFjdGlvbiBpc1xuKiB0cmlnZ2VyZWQuXG4qXG4qIEBhdXRob3IgQmrDtnJuIFdpa3N0csO2bSA8Ympvcm5Ad2VsY29tLnNlPlxuKiBAbGljZW5zZSBBcGFjaGUgTGljZW5zZSAyLjAgPGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9BcGFjaGUtMi4wPlxuKiBAdmVyc2lvbiAxLjEuMFxuKiBAY29weXJpZ2h0IFdlbGNvbSBXZWIgaSBHw7Z0ZWJvcmcgQUIgMjAxNVxuKi9cbnZhciBFdmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL2V2ZW50cy9NYW5hZ2VyJyksXG5cdFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy9VdGlscycpO1xuXG4vKlxuICogQ2xhc3MgY29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0gbmFtZSBcdFx0e1N0cmluZ30gXHRUaGUgbmFtZSBvZiB0aGUgYWN0aW9uXG4gKiBAcmV0dXJucyBcdFx0e0FjdGlvbn1cbiAqL1xudmFyIEFjdGlvbiA9IGZ1bmN0aW9uIChuYW1lKSB7XG5cdHRoaXMubmFtZSA9IG5hbWU7XG5cdHRoaXMuaWQgPSBVdGlscy5ndWlkKCk7XG59O1xuLypcbiAqIFRyaWdnZXIgdGhlIGV2ZW50LCBub3RpZnlpbmcgYW55IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0gcGF5bG9hZCBcdHtNaXhlZH0gXHRBbiBvcHRpb25hbCBwYXlsb2FkIGZvciB0aGUgZXZlbnRcbiAqIEByZXR1cm5zIFx0XHR7Vm9pZH1cbiAqL1xuQWN0aW9uLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcblx0RXZlbnRNYW5hZ2VyLnRyaWdnZXIodGhpcy5pZCwgcGF5bG9hZCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbjsiLCIvKipcbiogU21hbGwtRmx1eFxuKlxuKiBgU21hbGxGbHV4YCBpcyB0aGUgb25seSBvYmplY3QgdG8gZXhwb3NlIHRvIGRldmVsb3BlcnMsXG4qIGFsbG93aW5nIGNyZWF0aW9uIG9mIGFuIGBBY3Rpb25gIG9yIGEgYFN0b3JlYC5cbipcbiogQGF1dGhvciBCasO2cm4gV2lrc3Ryw7ZtIDxiam9ybkB3ZWxjb20uc2U+XG4qIEBsaWNlbnNlIEFwYWNoZSBMaWNlbnNlIDIuMCA8aHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0FwYWNoZS0yLjA+XG4qIEB2ZXJzaW9uIDEuMS4wXG4qIEBjb3B5cmlnaHQgV2VsY29tIFdlYiBpIEfDtnRlYm9yZyBBQiAyMDE1XG4qL1xudmFyIEFjdGlvbiA9IHJlcXVpcmUoJy4vQWN0aW9uJyksXG5cdFN0b3JlID0gcmVxdWlyZSgnLi9TdG9yZScpO1xuXG52YXIgU21hbGxGbHV4ID0ge1xuXHQvKlxuXHQgKiBJbnN0YW50aWF0ZSBhbiBgQWN0aW9uYCwgd2l0aCBhIHVuaXF1ZSBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0gbmFtZSBcdFx0e1N0cmluZ30gXHRBIHVuaXF1ZSBuYW1lIGZvciB0aGUgYEFjdGlvbmBcblx0ICogQHJldHVybnMgXHRcdHtBY3Rpb259XG5cdCAqL1xuXHRjcmVhdGVBY3Rpb246IGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0cmV0dXJuIG5ldyBBY3Rpb24obmFtZSk7XG5cdH0sXG5cdC8qXG5cdCAqIEhlbHBlciBtZXRob2QgdG8gaW5zdGFudGlhdGUgbXVsdGlwbGUgYEFjdGlvbmBzIGF0IG9uY2UuXG5cdCAqXG5cdCAqIEBwYXJhbSBuYW1lcyBcdHtBcnJheX0gXHRBIGxpc3Qgb2YgdW5pcXVlIG5hbWVzXG5cdCAqIEByZXR1cm5zIFx0XHR7T2JqZWN0fSBcdENvbnRhaW5pbmcgYWxsIGBBY3Rpb25gcyB3aXRoIHRoZSBuYW1lIGFzIGtleVxuXHQgKi9cblx0Y3JlYXRlQWN0aW9uczogZnVuY3Rpb24gKG5hbWVzKSB7XG5cdFx0dmFyIGFjdGlvbnMgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRhY3Rpb25zW25hbWVzW2ldXSA9IG5ldyBBY3Rpb24obmFtZXNbaV0pO1xuXHRcdH1cblx0XHRyZXR1cm4gYWN0aW9ucztcblx0fSxcblx0Lypcblx0ICogSW5zdGFudGlhdGUgYSBgU3RvcmVgLCBpbmhlcml0aW5nIHByb3BlcnRpZXMgYW5kXG5cdCAqIG1ldGhvZHMgZnJvbSB0aGUgcGFzc2VkIHBhcmFtZXRlci5cblx0ICpcblx0ICogQHBhcmFtIHN0b3JlIFx0e09iamVjdH0gXHRBbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIGZvciB0aGUgYFN0b3JlYFxuXHQgKiBAcmV0dXJucyBcdFx0e1N0b3JlfVxuXHQgKi9cblx0Y3JlYXRlU3RvcmU6IGZ1bmN0aW9uIChzdG9yZSkge1xuXHRcdHJldHVybiBuZXcgU3RvcmUoc3RvcmUpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNtYWxsRmx1eDsiLCIvKipcbiogU21hbGwtRmx1eCAtIFN0b3JlIGNsYXNzXG4qXG4qIFRoZSBgU3RvcmVgIGlzIGEgY2VudHJhbCB1bml0IHdoZW4gdXNpbmcgRmx1eCBvciBTbWFsbC1GbHV4LFxuKiB3aGljaCBzdG9yZXMgYW5kIGhhbmRsZXMgZW50aXRpZXMuIFVzdWFsbHkgYW4gYEFjdGlvbmAgaXMgdHJpZ2dlcmluZ1xuKiBzb21lIGZvcm0gb2YgdXBkYXRlIHRvIGEgYFN0b3JlYCAoYWRkaW5nL3JlbW92aW5nL3VwZGF0aW5nIGFuIGVudGl0eSlcbiogd2hpY2ggaW4gdHVybiBub3RpZnkgYW55IGxpc3RlbmVycyBhZnRlciB0aGUgdGFzayBpcyBwZXJmb3JtZWQuXG4qXG4qIEBhdXRob3IgQmrDtnJuIFdpa3N0csO2bSA8Ympvcm5Ad2VsY29tLnNlPlxuKiBAbGljZW5zZSBBcGFjaGUgTGljZW5zZSAyLjAgPGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9BcGFjaGUtMi4wPlxuKiBAdmVyc2lvbiAxLjEuMFxuKiBAY29weXJpZ2h0IFdlbGNvbSBXZWIgaSBHw7Z0ZWJvcmcgQUIgMjAxNVxuKi9cbnZhciBFdmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL2V2ZW50cy9NYW5hZ2VyJyksXG5cdFV0aWxzID0gcmVxdWlyZSgnLi91dGlscy9VdGlscycpO1xuXG4vKlxuICogQSBTbWFsbC1GbHV4IHN0b3JlIGhhdmUgc29tZSBtZXRob2RzIHRoYXQgc2hvdWxkbid0XG4gKiBiZSBvdmVycmlkZW4sIHNvIHdlIHVzZSBhIGtleXdvcmQgZmlsdGVyIGZvciB0aGVzZS5cbiAqL1xudmFyIGtleXdvcmRzID0gWydvYnNlcnZlJywgJ2ZvcmdldCcsICdub3RpZnknLCAnYXR0YWNoJywgJ2RldGFjaCddO1xuXG4vKlxuICogQ2xhc3MgY29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0gc3RvcmUgXHR7T2JqZWN0fVx0UHJvcGVydGllcyBhbmQgbWV0aG9kcyBmb3IgdGhlIHN0b3JlXG4gKiBAcmV0dXJucyBcdFx0e1N0b3JlfVxuICovXG52YXIgU3RvcmUgPSBmdW5jdGlvbiAoc3RvcmUpIHtcblx0Lypcblx0ICogYHN0b3JlYCBjb250YWlucyBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIHRoYXQgc2hvdWxkXG5cdCAqIGJlIGF0dHJpYnV0ZWQgdG8gdGhlIGdlbmVyYXRlZCBgU3RvcmVgIGluc3RhbmNlLFxuXHQgKiBzbyBsZXRzIGFkZCB0aGVtIHVwb24gY3JlYXRpb24uXG5cdCAqL1xuXHRmb3IgKHZhciBwcm9wIGluIHN0b3JlKSB7XG5cdFx0aWYgKHN0b3JlLmhhc093blByb3BlcnR5KHByb3ApICYmIGtleXdvcmRzLmluZGV4T2YocHJvcCkgPCAwKSB7XG5cdFx0XHRpZiAodHlwZW9mIHN0b3JlW3Byb3BdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXNbcHJvcF0gPSBzdG9yZVtwcm9wXS5iaW5kKHRoaXMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpc1twcm9wXSA9IHN0b3JlW3Byb3BdO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHR0aGlzLmlkID0gVXRpbHMuZ3VpZCgpO1xuXHQhIXRoaXMuaW5pdGlhbGl6ZSA/IHRoaXMuaW5pdGlhbGl6ZSgpIDogZmFsc2U7XG59O1xuLypcbiAqIEF0dGFjaCBhIGNhbGxiYWNrIGZvciBhbiBhY3Rpb24gZXZlbnQsIHNvIHdoZW4gYW5cbiAqIGFjdGlvbiBpcyB0cmlnZ2VyZWQgLSB0aGlzIHN0b3JlIGNhbiBoYW5kbGUgaXQuXG4gKlxuICogQHBhcmFtIGFjdGlvbiBcdHtBY3Rpb259IFx0QW4gaW5zdGFuY2Ugb2YgYW4gYWN0aW9uXG4gKiBAcGFyYW0gY2FsbGJhY2tcdHtGdW5jdGlvbn0gXHRDYWxsYmFjayBoYW5kbGluZyBsb2dpY1xuICogQHJldHVybnMgXHRcdHtGdW5jdGlvbn0gXHRBIGZ1bmN0aW9uIHRoYXQgdW5zdWJzY3JpYmVzIGZyb20gdGhlIGV2ZW50XG4gKi9cblN0b3JlLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24gKGFjdGlvbiwgY2FsbGJhY2spIHtcblx0cmV0dXJuIEV2ZW50TWFuYWdlci5vbihhY3Rpb24uaWQsIGNhbGxiYWNrKTtcbn07XG4vKlxuICogRGV0YWNoIGEgY2FsbGJhY2sgZnJvbSBhbiBhY3Rpb24gZXZlbnQuXG4gKlxuICogQHBhcmFtIGFjdGlvbiBcdHtBY3Rpb259IFx0QW4gaW5zdGFuY2Ugb2YgYW4gYWN0aW9uXG4gKiBAcGFyYW0gY2FsbGJhY2sgXHR7RnVuY3Rpb259IFx0VGhlIHN1YnNjcmliaW5nIGNhbGxiYWNrXG4gKiBAcmV0dXJucyBcdFx0e1ZvaWR9XG4gKi9cblN0b3JlLnByb3RvdHlwZS5mb3JnZXQgPSBmdW5jdGlvbiAoYWN0aW9uLCBjYWxsYmFjaykge1xuXHRFdmVudE1hbmFnZXIub2ZmKGFjdGlvbi5pZCwgY2FsbGJhY2spO1xufTtcbi8qXG4gKiBBIGhlbHBlciBtZXRob2QgdG8gbm90aWZ5IGFsbCBsaXN0ZW5pbmdcbiAqIHN1YnNjcmliZXJzIG9mIGEgY2hhbmdlLlxuICpcbiAqIEByZXR1cm5zIFx0XHR7Vm9pZH1cbiAqL1xuU3RvcmUucHJvdG90eXBlLm5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcblx0RXZlbnRNYW5hZ2VyLnRyaWdnZXIodGhpcy5pZCk7XG59O1xuLypcbiAqIEF0dGFjaCBhIGxpc3RlbmVyIGZvciBjaGFuZ2VzIGluIGEgYFN0b3JlYFxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayBcdHtGdW5jdGlvbn0gXHRDYWxsYmFjayBoYW5kbGluZyBsb2dpY1xuICogQHJldHVybnMgXHRcdHtGdW5jdGlvbn0gXHRBIGZ1bmN0aW9uIHRoYXQgdW5zdWJzY3JpYmVzIHRoZSBsaXN0ZW5lclxuICovXG5TdG9yZS5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdHJldHVybiBFdmVudE1hbmFnZXIub24odGhpcy5pZCwgY2FsbGJhY2spO1xufTtcbi8qXG4gKiBEZXRhY2ggYSBsaXN0ZW5lciBmcm9tIGFueSBjaGFuZ2UgZXZlbnRzLlxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayBcdHtGdW5jdGlvbn0gXHRUaGUgc3Vic2NyaWJpbmcgY2FsbGJhY2tcbiAqIEByZXR1cm5zIFx0XHR7Vm9pZH1cbiAqL1xuU3RvcmUucHJvdG90eXBlLmRldGFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRFdmVudE1hbmFnZXIub2ZmKHRoaXMuaWQsIGNhbGxiYWNrKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmU7IiwiLyoqXG4qIFNtYWxsLUZsdXggLSBFdmVudE1hbmFnZXIgY2xhc3NcbipcbiogVGhlIGBFdmVudE1hbmFnZXJgIGhhbmRsZXMgYSBtYXAgb2YgZXZlbnQgbmFtZXMsIGVhY2hcbiogd2l0aCBpdCdzIG93biBxdWV1ZSBvZiBjYWxsYmFjayBsaXN0ZW5lcnMuIFdoZW4gYW4gZXZlbnRcbiogaXMgdHJpZ2dlcmVkLCBhbGwgbGlzdGVuaW5nIGNhbGxiYWNrcyB3aWxsIGJlIGNhbGxlZFxuKiB3aXRoIGFuIG9wdGlvbmFsIHNwZWNpZmllZCBwYXlsb2FkLlxuKlxuKiBAYXV0aG9yIEJqw7ZybiBXaWtzdHLDtm0gPGJqb3JuQHdlbGNvbS5zZT5cbiogQGxpY2Vuc2UgQXBhY2hlIExpY2Vuc2UgMi4wIDxodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQXBhY2hlLTIuMD5cbiogQHZlcnNpb24gMS4xLjBcbiogQGNvcHlyaWdodCBXZWxjb20gV2ViIGkgR8O2dGVib3JnIEFCIDIwMTVcbiovXG52YXIgRXZlbnRNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuXG5cdHZhciBxdWV1ZSA9IHt9O1xuXG5cdHJldHVybiB7XG5cdFx0Lypcblx0XHQgKiBMZXQgYSBoYW5kbGVyIGxpc3RlbiBmb3IgYW4gZXZlbnQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gZXZlbnQgXHR7U3RyaW5nfSBcdFRoZSBldmVudCBuYW1lXG5cdFx0ICogQHBhcmFtIGhhbmRsZXIgXHR7RnVuY3Rpb259IFx0VGhlIGhhbmRsZXIgb2YgdGhlIGV2ZW50XG5cdFx0ICogQHJldHVybnMgXHRcdHtGdW5jdGlvbn0gXHRBbiB1bnN1YnNjcmliaW5nIGZ1bmN0aW9uIGZvciB0aGUgaGFuZGxlclxuXHRcdCAqL1xuXHRcdG9uOiBmdW5jdGlvbiAoZXZlbnQsIGhhbmRsZXIpIHtcblx0XHRcdGlmICghcXVldWVbZXZlbnRdKSB7XG5cdFx0XHRcdHF1ZXVlW2V2ZW50XSA9IFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRxdWV1ZVtldmVudF0ucHVzaChoYW5kbGVyKTtcblx0XHRcdHJldHVybiB0aGlzLm9mZi5iaW5kKHRoaXMsIGV2ZW50LCBoYW5kbGVyKTtcblx0XHR9LFxuXHRcdC8qXG5cdFx0ICogVW5zdWJzY3JpYmUgYSBoYW5kbGVyIGZyb20gYW4gZXZlbnRcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBldmVudCBcdHtTdHJpbmd9IFx0VGhlIGV2ZW50IG5hbWVcblx0XHQgKiBAcGFyYW0gaGFuZGxlciBcdHtGdW5jdGlvbn0gXHRUaGUgaGFuZGxlciB0byBiZSB1bnN1YnNjcmliZWRcblx0XHQgKiBAcmV0dXJucyBcdFx0e1ZvaWR9XG5cdFx0ICovXG5cdFx0b2ZmOiBmdW5jdGlvbiAoZXZlbnQsIGhhbmRsZXIpIHtcblx0XHRcdGlmICghcXVldWVbZXZlbnRdKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZVtldmVudF0ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHF1ZXVlW2V2ZW50XVtpXSA9PT0gaGFuZGxlcikge1xuXHRcdFx0XHRcdGRlbGV0ZSBxdWV1ZVtldmVudF1baV07XG5cdFx0XHRcdFx0cXVldWVbZXZlbnRdLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Lypcblx0XHQgKiBUcmlnZ2VyIGFuIGV2ZW50IHdpdGggYSBwYXlsb2FkLCBhbmQgbm90aWZ5IGxpc3RlbmVyc1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIGV2ZW50IFx0e1N0cmluZ30gXHRUaGUgZXZlbnQgbmFtZVxuXHRcdCAqIEBwYXJhbSBwYXlsb2FkIFx0e01peGVkfSBcdEFuIG9wdGlvbmFsIHBheWxvYWQgZm9yIHRoZSBldmVudFxuXHRcdCAqIEByZXR1cm5zIFx0XHR7Vm9pZH1cblx0XHQgKi9cblx0XHR0cmlnZ2VyOiBmdW5jdGlvbiAoZXZlbnQsIHBheWxvYWQpIHtcblx0XHRcdGlmICghcXVldWVbZXZlbnRdKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZVtldmVudF0ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0cXVldWVbZXZlbnRdW2ldKHBheWxvYWQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50TWFuYWdlcjsiLCIvKipcbiogU21hbGwtRmx1eCAtIFV0aWxpdHkgZnVuY3Rpb25zXG4qXG4qIENvbGxlY3RpbmcgaGVscGVyIGZ1bmN0aW9ucyBpbiBhIHV0aWxpdHkgb2JqZWN0LlxuKlxuKiBAYXV0aG9yIEJqw7ZybiBXaWtzdHLDtm0gPGJqb3JuQHdlbGNvbS5zZT5cbiogQGxpY2Vuc2UgQXBhY2hlIExpY2Vuc2UgMi4wIDxodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQXBhY2hlLTIuMD5cbiogQHZlcnNpb24gMS4xLjBcbiogQGNvcHlyaWdodCBXZWxjb20gV2ViIGkgR8O2dGVib3JnIEFCIDIwMTVcbiovXG5cbi8qXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSB1bmlxdWUgaWRcbiAqXG4gKiBAcmV0dXJuc1x0XHRcdHtTdHJpbmd9XG4gKi9cbnZhciBndWlkID0gZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBzNCgpIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDEwMSkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcblx0fVxuXHRyZXR1cm4gczQoKSArIHM0KCkgKyAnLScgKyBzNCgpICsgJy0nICsgczQoKSArICctJyArIHM0KCkgKyAnLScgKyBzNCgpICsgczQoKSArIHM0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRndWlkOiBndWlkXG59OyIsInZhciBTbWFsbEZsdXggPSByZXF1aXJlKCdzbWFsbC1mbHV4Jyk7XG5cbnZhciBUb2RvQWN0aW9ucyA9IFNtYWxsRmx1eC5jcmVhdGVBY3Rpb25zKFsnY3JlYXRlJywgJ3JlbW92ZScsICdyZWFkJywgJ3VucmVhZCddKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUb2RvQWN0aW9uczsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuXHRUb2RvQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVG9kbycpO1xuXG52YXIgVG9kb0l0ZW1Gb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4geyB0aXRsZTogJycsIGRlc2NyaXB0aW9uOiAnJyB9O1xuXHR9LFxuXHRvbkNoYW5nZVRpdGxlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHRpdGxlOiB0aGlzLnJlZnMudGl0bGUuZ2V0RE9NTm9kZSgpLnZhbHVlIH0pO1xuXHR9LFxuXHRvbkNoYW5nZURlc2NyaXB0aW9uOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGRlc2NyaXB0aW9uOiB0aGlzLnJlZnMuZGVzY3JpcHRpb24uZ2V0RE9NTm9kZSgpLnZhbHVlIH0pO1xuXHR9LFxuXHRkb1NhdmVUb2RvOiBmdW5jdGlvbiAoKSB7XG5cdFx0VG9kb0FjdGlvbnMuY3JlYXRlLnRyaWdnZXIoeyB0aXRsZTogdGhpcy5zdGF0ZS50aXRsZSwgZGVzY3JpcHRpb246IHRoaXMuc3RhdGUuZGVzY3JpcHRpb24gfSk7XG5cdFx0dmFyIHN0YXRlID0ge307XG5cdFx0dGhpcy5yZWZzLnRpdGxlLmdldERPTU5vZGUoKS52YWx1ZSA9IHN0YXRlLnRpdGxlID0gJyc7XG5cdFx0dGhpcy5yZWZzLmRlc2NyaXB0aW9uLmdldERPTU5vZGUoKS52YWx1ZSA9IHN0YXRlLmRlc2NyaXB0aW9uID0gJyc7XG5cdFx0dGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiZm9ybVwiPlxuXHRcdFx0XHQ8bGFiZWwgaHRtbEZvcj1cInRpdGxlXCI+VGl0bGU8L2xhYmVsPlxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInRpdGxlXCIgcmVmPVwidGl0bGVcIiBwbGFjZWhvbGRlcj1cIlBsZWFzZSBzcGVjaWZ5IGEgdGl0bGUgZm9yIHRoZSB0b2RvXCIgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnRpdGxlfSBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZVRpdGxlfSAvPlxuXHRcdFx0XHQ8bGFiZWwgaHRtbEZvcj1cImRlc2NyaXB0aW9uXCI+RGVzY3JpcHRpb248L2xhYmVsPlxuXHRcdFx0XHQ8dGV4dGFyZWEgaWQ9XCJkZXNjcmlwdGlvblwiIHJlZj1cImRlc2NyaXB0aW9uXCIgcm93cz1cIjZcIiBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUuZGVzY3JpcHRpb259IG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlRGVzY3JpcHRpb259PjwvdGV4dGFyZWE+XG5cdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuZG9TYXZlVG9kb30+U2F2ZTwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUb2RvSXRlbUZvcm07IiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKSxcblx0VG9kb0xpc3RJdGVtID0gcmVxdWlyZSgnLi9Ub2RvTGlzdEl0ZW0nKTtcblxudmFyIFRvZG9JdGVtTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PHVsPlxuXHRcdFx0XHR7dGhpcy5wcm9wcy50b2Rvcy5tYXAoZnVuY3Rpb24gKHRvZG8pIHtcblx0XHRcdFx0XHRyZXR1cm4gPFRvZG9MaXN0SXRlbSBrZXk9e3RvZG8uY3JlYXRlZF9hdH0gdG9kbz17dG9kb30gLz47XG5cdFx0XHRcdH0pfVxuXHRcdFx0PC91bD5cblx0XHQpO1xuXG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZG9JdGVtTGlzdDsiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpLFxuXHRUb2RvQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVG9kbycpO1xuXG52YXIgcGFkRGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRpZiAoKFwiXCIgKyB2YWx1ZSkubGVuZ3RoID09IDEpIHtcblx0XHRyZXR1cm4gXCIwXCIgKyB2YWx1ZTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn07XG5cbnZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcblx0cmV0dXJuIGRhdGUuZ2V0RnVsbFllYXIoKSArIFwiLVwiICsgcGFkRGF0ZShkYXRlLmdldE1vbnRoKCkpICsgXCItXCIgKyBwYWREYXRlKGRhdGUuZ2V0RGF0ZSgpKSArIFwiIEAgXCIgKyBwYWREYXRlKGRhdGUuZ2V0SG91cnMoKSkgKyBcIjpcIiArIHBhZERhdGUoZGF0ZS5nZXRNaW51dGVzKCkpO1xufTtcblxudmFyIFRvZG9MaXN0SXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHsgb3BlbjogZmFsc2UgfTtcblx0fSxcblx0ZG9Ub2dnbGVEZXNjcmlwdGlvbjogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnRvZG8uaXNfdW5yZWFkICYmICF0aGlzLnN0YXRlLm9wZW4pIHtcblx0XHRcdFRvZG9BY3Rpb25zLnJlYWQudHJpZ2dlcih0aGlzLnByb3BzLnRvZG8pO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0U3RhdGUoeyBvcGVuOiAhdGhpcy5zdGF0ZS5vcGVuIH0pO1xuXHR9LFxuXHRkb01hcmtBc1VucmVhZDogZnVuY3Rpb24gKCkge1xuXHRcdFRvZG9BY3Rpb25zLnVucmVhZC50cmlnZ2VyKHRoaXMucHJvcHMudG9kbyk7XG5cdH0sXG5cdGRvUmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cdFx0VG9kb0FjdGlvbnMucmVtb3ZlLnRyaWdnZXIodGhpcy5wcm9wcy50b2RvKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cblx0XHR2YXIgc3RhciA9IG51bGwsXG5cdFx0XHRjc3NDbGFzc05hbWUgPSBcImNsb3NlZFwiO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMudG9kby5pc191bnJlYWQpIHtcblx0XHRcdHN0YXIgPSA8c3BhbiBjbGFzc05hbWU9XCJ1bnJlYWRcIj4qPC9zcGFuPjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5vcGVuKSB7XG5cdFx0XHRjc3NDbGFzc05hbWUgPSBcIm9wZW5cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGxpIGNsYXNzTmFtZT17Y3NzQ2xhc3NOYW1lfT5cblx0XHRcdFx0PGgzIG9uQ2xpY2s9e3RoaXMuZG9Ub2dnbGVEZXNjcmlwdGlvbn0+e3N0YXJ9e3RoaXMucHJvcHMudG9kby50aXRsZX0gPHNwYW4gY2xhc3NOYW1lPVwiY3JlYXRlZF9hdFwiPntkYXRlRm9ybWF0KHRoaXMucHJvcHMudG9kby5jcmVhdGVkX2F0KX08L3NwYW4+PC9oMz5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuXHRcdFx0XHRcdDxwPnt0aGlzLnByb3BzLnRvZG8uZGVzY3JpcHRpb259PC9wPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc1wiPlxuXHRcdFx0XHRcdDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgb25DbGljaz17dGhpcy5kb01hcmtBc1VucmVhZH0gY2xhc3NOYW1lPVwibGVmdFwiPk1hcmsgYXMgdW5yZWFkPC9hPlxuXHRcdFx0XHRcdDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIgb25DbGljaz17dGhpcy5kb1JlbW92ZX0gY2xhc3NOYW1lPVwicmlnaHRcIj5EZWxldGUgdG9kbzwvYT5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCI+PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9saT5cblx0XHQpO1xuXG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZG9MaXN0SXRlbTsiLCJ2YXIgU21hbGxGbHV4ID0gcmVxdWlyZSgnc21hbGwtZmx1eCcpLFxuXHRUb2RvQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVG9kbycpO1xuXG52YXIgVG9kb1N0b3JlID0gU21hbGxGbHV4LmNyZWF0ZVN0b3JlKHtcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMudG9kb3MgPSBbXTtcblxuXHRcdHRoaXMub2JzZXJ2ZShUb2RvQWN0aW9ucy5jcmVhdGUsIHRoaXMuY3JlYXRlVG9kbyk7XG5cdFx0dGhpcy5vYnNlcnZlKFRvZG9BY3Rpb25zLnJlbW92ZSwgdGhpcy5yZW1vdmVUb2RvKTtcblx0XHR0aGlzLm9ic2VydmUoVG9kb0FjdGlvbnMucmVhZCwgdGhpcy5tYXJrVG9kb0FzUmVhZCk7XG5cdFx0dGhpcy5vYnNlcnZlKFRvZG9BY3Rpb25zLnVucmVhZCwgdGhpcy5tYXJrVG9kb0FzVW5yZWFkKTtcblx0fSxcblx0Y3JlYXRlVG9kbzogZnVuY3Rpb24gKHBheWxvYWQpIHtcblx0XHR0aGlzLnRvZG9zLnB1c2goe1xuXHRcdFx0dGl0bGU6IHBheWxvYWQudGl0bGUsXG5cdFx0XHRkZXNjcmlwdGlvbjogcGF5bG9hZC5kZXNjcmlwdGlvbixcblx0XHRcdGlzX3VucmVhZDogdHJ1ZSxcblx0XHRcdGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKClcblx0XHR9KTtcblx0XHR0aGlzLm5vdGlmeSgpO1xuXHR9LFxuXHRyZW1vdmVUb2RvOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuXG5cdFx0dmFyIGluZGV4ID0gLTE7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAodGhpcy50b2Rvc1tpXS5jcmVhdGVkX2F0ID09IHBheWxvYWQuY3JlYXRlZF9hdCkge1xuXHRcdFx0XHRpbmRleCA9IGk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChpbmRleCA+PSAwKSB7XG5cdFx0XHRkZWxldGUgdGhpcy50b2Rvc1tpbmRleF07XG5cdFx0XHR0aGlzLnRvZG9zLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR0aGlzLm5vdGlmeSgpO1xuXHRcdH1cblxuXHR9LFxuXHRtYXJrVG9kb0FzUmVhZDogZnVuY3Rpb24gKHBheWxvYWQpIHtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHRoaXMudG9kb3NbaV0uY3JlYXRlZF9hdCA9PSBwYXlsb2FkLmNyZWF0ZWRfYXQpIHtcblx0XHRcdFx0dGhpcy50b2Rvc1tpXS5pc191bnJlYWQgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5ub3RpZnkoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0sXG5cdG1hcmtUb2RvQXNVbnJlYWQ6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0aGlzLnRvZG9zW2ldLmNyZWF0ZWRfYXQgPT0gcGF5bG9hZC5jcmVhdGVkX2F0KSB7XG5cdFx0XHRcdHRoaXMudG9kb3NbaV0uaXNfdW5yZWFkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5ub3RpZnkoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0sXG5cblx0Z2V0VG9kb3M6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy50b2Rvcztcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVG9kb1N0b3JlOyIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JyksXG5cdFRvZG9TdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9Ub2RvJyksXG5cdFRvZG9JdGVtTGlzdCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvVG9kb0xpc3QnKSxcblx0VG9kb0l0ZW1Gb3JtID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9Ub2RvSXRlbUZvcm0nKTtcblxudmFyIFRvZG9WaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4geyB0b2RvczogW10gfTtcblx0fSxcblx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG5cdFx0VG9kb1N0b3JlLmF0dGFjaCh0aGlzLnVwZGF0ZSk7XG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyB0b2RvczogVG9kb1N0b3JlLmdldFRvZG9zKCkgfSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIGNvdW50ID0gdGhpcy5zdGF0ZS50b2Rvcy5sZW5ndGgsXG5cdFx0XHRwcmVmaXggPSBudWxsLFxuXHRcdFx0dW5yZWFkID0gMDtcblxuXHRcdGlmIChjb3VudCAhPSAxKSB7XG5cdFx0XHRwcmVmaXggPSBcInNcIjtcblx0XHR9XG5cblx0XHR1bnJlYWQgPSB0aGlzLnN0YXRlLnRvZG9zLmZpbHRlcihmdW5jdGlvbiAodG9kbykge1xuXHRcdFx0cmV0dXJuICEhdG9kby5pc191bnJlYWQ7XG5cdFx0fSkubGVuZ3RoO1xuXG5cdFx0dmFyIGNvdW50ZXIgPSA8c3Bhbj5Zb3UgaGF2ZSB7Y291bnR9IHRvZG97cHJlZml4fSwgYW5kIHt1bnJlYWR9IG9mIHRoZW0gYXJlIHVucmVhZC48L3NwYW4+O1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwidmlld1wiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cInRvZG8tY291bnRlclwiPntjb3VudGVyfTwvZGl2PlxuXHRcdFx0XHQ8VG9kb0l0ZW1MaXN0IHRvZG9zPXt0aGlzLnN0YXRlLnRvZG9zfSAvPlxuXHRcdFx0XHQ8aHIgLz5cblx0XHRcdFx0PFRvZG9JdGVtRm9ybSAvPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUb2RvVmlldzsiXX0=
