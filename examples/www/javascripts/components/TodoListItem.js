var React = require('react'),
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

var TodoListItem = React.createClass({
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
			star = <span className="unread">*</span>;
		}

		if (this.state.open) {
			cssClassName = "open";
		}

		return (
			<li className={cssClassName}>
				<h3 onClick={this.doToggleDescription}>{star}{this.props.todo.title} <span className="created_at">{dateFormat(this.props.todo.created_at)}</span></h3>
				<div className="description">
					<p>{this.props.todo.description}</p>
				</div>
				<div className="settings">
					<a href="javascript:void(0);" onClick={this.doMarkAsUnread} className="left">Mark as unread</a>
					<a href="javascript:void(0);" onClick={this.doRemove} className="right">Delete todo</a>
					<div className="clear"></div>
				</div>
			</li>
		);

	}
});

module.exports = TodoListItem;