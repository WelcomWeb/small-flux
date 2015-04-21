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