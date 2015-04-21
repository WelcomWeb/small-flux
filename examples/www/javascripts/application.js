var React = require('react'),
	TodoView = require('./views/Todo');

window.addEventListener('load', function onpageload(event) {
	window.removeEventListener('load', onpageload, false);

	React.render(<TodoView />, document.getElementById('todo-application'));
}, false);