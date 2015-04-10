# SmallFlux

[![Build Status](https://travis-ci.org/WelcomWeb/small-flux.svg?branch=master)](https://travis-ci.org/WelcomWeb/small-flux)

SmallFlux is an event based, really small, library for Flux-like development. It has a small footprint, while yet being able to handle most use cases for an application striving to make use of the Flux pattern.

## Installation

    npm install --save-dev small-flux

## Usage

    var SmallFlux = require('small-flux');

## Actions
An `Action` is simply just a payload being passed around between components and `Store`s.

    var MyAction = SmallFlux.createAction('myAction');

    // Trigger the action and notify listeners
    // to the action (payload is optional)
    MyAction.trigger({ payload: 'payload' });

    // or create multiple actions at once;
    var MyActions = SmallFlux.createActions(['myActionOne', 'myAcionTwo']);
    // access myActionOne:
    MyActions.myActionOne.trigger();

## Stores
A `Store` is a central unit which keeps track of `Action`s, and is a data layer for sharing data between components.

	var MyStore = SmallFlux.createStore({

		// `initialize` is automatically invoked,
		// directly when the `Store` is set up
		initialize: function () {

			// Tell SmallFlux that this store should
			// observe the `MyAction` Action.
			this.observe(MyAction, this.handler);

		},

		// Instance method, attached to the observable
		// set up in `initialize`
		handler: function (payload) {

			// Notify any listeners for this `Store`,
			// letting them know something has changed
			this.notify();

		}
	});

	// Set up a listener for changes in `MyStore`
	var MyStoreListener = function () {
		// Something has been changed in `MyStore`!
	};
	// Attach it;
	MyStore.attach(MyStoreListener);
	// And later you can detach it, so no changes are reported to `MyStoreListener`
	MyStore.detach(MyStoreListener);

## Working example

*index.html*

	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<title>Small-Flux example</title>
		</head>
		<body>
			<section id="application"></section>
			<script src="application.js"></script>
		</body>
	</html>

*application.js*

	var React = require('react'),
		SmallFlux = require('small-flux');

	var TodoActions = SmallFlux.createActions(['add', 'remove']);

	var TodoItemStore = SmallFlux.createStore({
		initialize: function () {
			this.items = [];
			this.observe(TodoActions.add, this.addTodoItem);
			this.observe(TodoActions.remove, this.removeTodoItem);
		},
		addTodoItem: function (todo) {
			this.items.push(todo);
			this.notify();
		},
		removeTodoItem: function (todo) {
			var index = -1;
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i] == todo) {
					index = i;
					break;
				}
			}

			if (index >= 0) {
				delete this.items[index];
				this.items.splice(index, 1);

				this.notify();
			}
		},
		get: function () {
			return this.items;
		}
	});

	var TodoItem = React.createClass({
		remove: function () {
			TodoActions.remove.trigger(this.props.todo);
		},
		render: function () {

			return <li>{this.props.todo} <em><span onClick={this.remove}>(remove)</span></em></li>;

		}
	});

	var TodoList = React.createClass({
		getInitialState: function () {
			return { items: TodoItemStore.get() };
		},
		componentDidMount: function () {
			TodoItemStore.attach(this.update);
		},
		componentWillUnmount: function () {
			TodoItemStore.detach(this.update);
		},
		update: function () {
			this.setState({ items: TodoItemStore.get() });
		},
		render: function () {

			return (
				<ul>
					{this.state.items.map(function (item) {
						return <TodoItem key={item.todo} todo={item} />;
					})}
				</ul>
			);

		}
	});

	var TodoForm = React.createClass({
		getInitialState: function () {
			return { todo: '' };
		},
		add: function () {
			TodoActions.add.trigger(this.state.todo);
			this.setState({ todo: '' });
			this.refs.todo.getDOMNode().value = '';
		},
		onTodoChange: function () {
			this.setState({ todo: this.refs.todo.getDOMNode().value });
		},
		render: function () {

			return (
				<div>
					<input type="text" ref="todo" placeholder="Todo" onChange={this.onTodoChange} defaultValue={this.state.todo} />
					<button type="button" onClick={this.add}>Add</button>
				</div>
			);
		}
	});

	var Application = React.createClass({
		getInitialState: function () {
			return { todoCount: TodoItemStore.get().length };
		},
		componentDidMount: function () {
			TodoItemStore.attach(this.update);
		},
		componentWillUnmount: function () {
			TodoItemStore.detach(this.update);
		},
		update: function () {
			this.setState({ todoCount: TodoItemStore.get().length });
		},
		render: function () {

			return (
				<div>
					<h1>Todo List</h1>
					<h5>Current item count is {this.state.todoCount}</h5>
					<TodoList />
					<hr />
					<TodoForm />
				</div>
			);

		}
	});

	window.onload = function () {
		React.render(<Application />, document.getElementById('application'));
	}
