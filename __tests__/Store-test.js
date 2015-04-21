jest.dontMock('../small-flux');
jest.dontMock('../src/events/Manager');
jest.dontMock('../src/utils/Utils');
jest.dontMock('../src/SmallFlux');
jest.dontMock('../src/Action');
jest.dontMock('../src/Store');

describe('Store', function () {
    it('can be created', function () {
        var Flux = require('../small-flux');
        var Store = Flux.createStore({});

        expect(typeof Store).not.toBe('undefined');
    })

    it('will be initialized', function () {
        var Flux = require('../small-flux');
		
        var mock = {
            initializer: function () {}
        };
        spyOn(mock, 'initializer');
        var Store = Flux.createStore({
            initialize: mock.initializer
        });

        expect(mock.initializer).toHaveBeenCalled();
    })

    it('can be attach callbacks', function () {
        var Flux = require('../small-flux');
        var Store = Flux.createStore({});

        expect(typeof Store.attach).toBe('function');
    })

    it('can be detached from callbacks', function () {
        var Flux = require('../small-flux');
        var Store = Flux.createStore({});

        expect(typeof Store.detach).toBe('function');
    })

    it('can listen to Action changes', function () {
        var Flux = require('../small-flux');
        var MyAction = Flux.createAction('myAction');

        var mock = {
            callback: function () {}
        };
        spyOn(mock, 'callback');
        var Store = Flux.createStore({
            initialize: function () {
                this.observe(MyAction, mock.callback);
            }
        });

        MyAction.trigger();

        expect(mock.callback).toHaveBeenCalled();
    })

    it('can unsubscribe from Action changes', function () {
        var Flux = require('../small-flux');
        var MyAction = Flux.createAction('myAction');

        var mock = {
            callback: function () {}
        };
        spyOn(mock, 'callback');
        var Store = Flux.createStore({
            initialize: function () {
                this.observe(MyAction, mock.callback);
            },
            unregister: function () {
                this.forget(MyAction, mock.callback);
            }
        })

        Store.unregister();
        MyAction.trigger();

        expect(mock.callback).not.toHaveBeenCalled();
    })

    it('will notify observers when an update occurs', function () {
        var Flux = require('../small-flux');
        var MyAction = Flux.createAction('myAction');
        var Store = Flux.createStore({
            initialize: function () {
                this.observe(MyAction, this.update);
            },
            update: function () {
                this.notify();
            }
        });

        var mock = {
            callback: function () {}
        };
        spyOn(mock, 'callback');
        Store.attach(mock.callback);
        MyAction.trigger();

        expect(mock.callback).toHaveBeenCalled();
    })

    it('will notify observers with a payload when an update occurs', function () {
        var Flux = require('../small-flux');
        var MyAction = Flux.createAction('myAction');
        var Store = Flux.createStore({
            initialize: function () {
                this.observe(MyAction, this.update);
            },
            update: function () {
                this.notify(MyAction);
            }
        });

        var mock = {
            callback: function (payload) {}
        };
        spyOn(mock, 'callback');
        Store.attach(mock.callback);
        MyAction.trigger();

        expect(mock.callback).toHaveBeenCalledWith(MyAction);
    })

    it('will not notify unregistered observers when an update occurs', function () {
        var Flux = require('../small-flux');
        var MyAction = Flux.createAction('myAction');
        var Store = Flux.createStore({
            initialize: function () {
                this.observe(MyAction, this.update);
            },
            update: function () {
                this.notify();
            }
        });

        var mock = {
            callback: function () {}
        };
        spyOn(mock, 'callback');
        Store.attach(mock.callback);
        Store.detach(mock.callback);
        MyAction.trigger();

        expect(mock.callback).not.toHaveBeenCalled();
    })
});