var React = require('react'),
    TodoStore = require('../stores/Todo'),
    TodoItemList = require('../components/TodoList'),
    TodoItemForm = require('../components/TodoItemForm');

var TodoView = React.createClass({
    getInitialState: function () {
        return { todos: [] };
    },
    componentWillMount: function () {
        TodoStore.attach(this.update);
    },
    componentWillUnMount: function () {
        TodoStore.detach(this.update);
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

        var counter = <span>You have {count} todo{prefix}, and {unread} of them are unread.</span>;

        return (
            <div className="view">
                <div className="todo-counter">{counter}</div>
                <TodoItemList todos={this.state.todos} />
                <hr />
                <TodoItemForm />
            </div>
        );

    }
});

module.exports = TodoView;