var React = require('react'),
    TodoActions = require('../actions/Todo');

var TodoItemForm = React.createClass({
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
            <div className="form">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref="title" placeholder="Please specify a title for the todo" defaultValue={this.state.title} onChange={this.onChangeTitle} />
                <label htmlFor="description">Description</label>
                <textarea id="description" ref="description" rows="6" defaultValue={this.state.description} onChange={this.onChangeDescription}></textarea>
                <button type="button" onClick={this.doSaveTodo}>Save</button>
            </div>
        );

    }
});

module.exports = TodoItemForm;