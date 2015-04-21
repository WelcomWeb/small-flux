jest.dontMock('../small-flux');
jest.dontMock('../src/utils/Utils');
jest.dontMock('../src/SmallFlux');
jest.dontMock('../src/Action');

describe('Action', function () {
    it('can be created', function () {
        var Flux = require('../small-flux');
        var myAction = Flux.createAction('myAction');

        expect(typeof myAction).not.toBe('undefined');
    })

    it('will have a name', function () {
        var Flux = require('../small-flux');
        var myAction = Flux.createAction('myAction');

        expect(myAction.name).toBe('myAction');
    })

    it('will have a method to trigger the action', function () {
        var Flux = require('../small-flux');
        var myAction = Flux.createAction('myAction');

        expect(typeof myAction.trigger === 'function').toBe(true);
    })

    it('can be created from a list of names', function () {
        var Flux = require('../small-flux');
        var myActions = Flux.createActions(['myAction1', 'myAction2']);

        expect(myActions.myAction1.name).toBe('myAction1');
        expect(myActions.myAction2.name).toBe('myAction2');
    })
});