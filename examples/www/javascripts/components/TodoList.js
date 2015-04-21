var React = require('react'),
	TodoListItem = require('./TodoListItem');

var TodoItemList = React.createClass({
	render: function () {

		return (
			<ul>
				{this.props.todos.map(function (todo) {
					return <TodoListItem key={todo.created_at} todo={todo} />;
				})}
			</ul>
		);

	}
});

module.exports = TodoItemList;