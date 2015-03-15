jest.dontMock('../src/events/Manager');

describe('events', function () {
	it('has a method to attach callbacks for an event', function () {
		var EventManager = require('../src/events/Manager');
		expect(typeof EventManager.on === 'function').toBe(true);
	})

	it('has a method to detach callback for an event', function () {
		var EventManager = require('../src/events/Manager');
		expect(typeof EventManager.off === 'function').toBe(true);
	})

	it('has a method to trigger an event', function () {
		var EventManager = require('../src/events/Manager');
		expect(typeof EventManager.trigger === 'function').toBe(true);
	})

	it('can attach a callback to an event, and listen for it', function () {
		var EventManager = require('../src/events/Manager');
		
		var mock = {
			callback: function () {}
		};

		spyOn(mock, 'callback');
		EventManager.on('test1', mock.callback);
		EventManager.trigger('test1');

		expect(mock.callback).toHaveBeenCalled();
	})

	it('can detach a callback from an event', function () {
		var EventManager = require('../src/events/Manager');

		var mock = {
			callback: function () {}
		};

		spyOn(mock, 'callback');
		EventManager.on('test2', mock.callback);
		EventManager.off('test2', mock.callback);
		EventManager.trigger('test2');

		expect(mock.callback).not.toHaveBeenCalled();
	})

	it('can attach a callback to an event, and be sent the action payload', function () {
		var EventManager = require('../src/events/Manager');

		var mock = {
			callback: function (payload) {}
		};

		spyOn(mock, 'callback');
		EventManager.on('test3', mock.callback);
		EventManager.trigger('test3', 'payload');

		expect(mock.callback).toHaveBeenCalledWith('payload');
	})
});