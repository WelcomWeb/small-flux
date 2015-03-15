# FluxByEvents

FluxByEvents is an event based, really small, library for Flux-like development. It has a small footprint, while yet being able to handle most use cases for an application striving to make use of the Flux pattern.

## Actions
An `Action` is simply just a payload being passed around between components and `Store`s.

    var MyAction = Fluxions.createAction('myAction');
    // trigger the action and notify listeners to the action (payload is optional)
    MyAction.trigger({ payload: 'payload' });

    // or create multiple actions at once;
    var MyActions = Fluxions.createActions(['myActionOne', 'myAcionTwo']);
    // access myActionOne:
    MyActions.myAction1.trigger();

## Stores
A `Store` is a central unit which keeps track of `Action`s, and is a data layer for sharing data between components.

	var MyStore = Fluxions.createStore({

		// `initialize` is automatically invoked, directly when the `Store` is set up
		initialize: function () {

			// Tell FluxByEvents that this store should observe the `MyAction` Action.
			this.observe(MyAction, this.handler);

		},

		// Instance method, attached to the observable set up in `initialize`
		handler: function (payload) {

			// Notify any listeners for this `Store`, letting them know something has changed
			this.notify();

		}
	});

	// Set up a listener for changes in `MyStore`
	var MyStoreListener = function () {
		// Something has been changed in `MyStore`!
	};
	// Attach it;
	MyStore.attach(MyStoreListener);
	// And later you can detach it, so no changes are reported to `MyStoreListener`
	MyStore.detach(MyStoreListener);