var SmallFlux = require('small-flux');

var TodoActions = SmallFlux.createActions(['create', 'remove', 'read', 'unread']);

module.exports = TodoActions;