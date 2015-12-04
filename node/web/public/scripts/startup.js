(function (scope, Hilary, $, Gidget, ko) {
    'use strict';

    var mainSelector = '#main',
        $main = $(mainSelector);

    Gidget.Bootstrapper(scope, {
        hilary: {
            composeLifecycle: function (err, scope, pipeline) {
                pipeline.on.error(function (err) {
                    console.log('hilary::error', err);
                    throw err;
                });
            },
            composeModules: function (err, scope) {
                scope.register({ name: 'newGidgetModule', singleton: true, factory: function () { return new Gidget.GidgetModule(); }});
                scope.register({ name: 'GidgetRoute',singleton: true, factory: function () { return Gidget.GidgetRoute; }});
                scope.register({ name: 'Blueprint',singleton: true, factory: function () { return Hilary.Blueprint; }});

                scope.register({
                    name: 'is',
                    singleton: true,
                    factory: function () {
                        return scope.getContext().is;
                    }
                });

                scope.register({
                    name: 'locale',
                    singleton: true,
                    factory: function () {
                        // TODO: Pick the locale based on the user preferences
                        // and load it separately from the web
                        return scope.resolve('locale::en_US');
                    }
                });

                scope.register({
                    name: 'exceptions',
                    singleton: true,
                    factory: function () {
                        var ExceptionHandler = scope.resolve('ExceptionHandler');
                        return new ExceptionHandler(function (exception) {
                            throw exception;
                        });
                    }
                });

                // register a single viewEngine to be used throughout the app
                scope.register({
                    name: 'viewEngine',
                    singleton: true,
                    factory: function () {
                        var ViewEngine = scope.resolve('ViewEngine');
                        return new ViewEngine($main);
                    }
                });
            }
        },
        composeLifecycle: function (err, gidgetApp, pipeline) {
            pipeline.on.error(function (err) {
                console.log('gidget::error', err);
                throw err;
            });
        },
        composeRoutes: function (err, gidgetApp) {
            scope.register({ name: 'router', singleton: true, factory: function () { return gidgetApp.routeEngine; }});

            gidgetApp.registerModule(scope.resolve('homeController'));
            gidgetApp.registerModule(scope.resolve('authController'));
            gidgetApp.registerModule(scope.resolve('booksController'));
            gidgetApp.registerModule(scope.resolve('exampleController'));
            gidgetApp.registerModule(scope.resolve('paymentController'));
            gidgetApp.registerModule(scope.resolve('checkoutController'));
            gidgetApp.registerModule(scope.resolve('historyController'));
        },
        onComposed: function (err) {
            if (err) {
                throw err;
            }

            var HomeVM = scope.resolve('HomeVM'),
                viewEngine = scope.resolve('viewEngine');

            ko.applyBindings(new HomeVM(), $('#header')[0]);
            ko.applyBindings(viewEngine.mainVM, $main[0]);
        }
    });

}(Hilary.scope('heinz'), Hilary, jQuery, Gidget, ko));
