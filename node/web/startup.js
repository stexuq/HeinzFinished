'use strict';

var Hilary = require('hilary'),
    async = require('async'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    exceptions,
    composeExpress,
    configureApplicationLifecycle;

// composition helpers
// These are wrapped in an iife, for code folding only
(function () {
    var configureRoutes;

    /*
    // Configures the express app and adds common middleware
    */
    composeExpress = function (scope) {
        var express = require('express'),
            expressSingleton = express(),
            router = express.Router(),
            favicon = require('serve-favicon'),
            logger = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            less = require('less-middleware'),
            debug = require('debug')('expressdefault:server'),
            serveStatic = require('serve-static');
            //isWin = /^win/.test(process.platform);

        /*
        // we'll use Hilary to wire up the node dependencies, for simplicity.
        // Note that we're creating parameterless factories that return the result of
        // node's require function, instead of just registering the modules themselves.
        // This approach reduces memory overhead in Hilary, and allows node to behave as it
        // normally would when using the service-location anti-pattern (i.e. node will to do it's
        // own caching and GC, as normal)
        */

        scope.register({ name: 'express',               factory: function () { return express; }});          // lib
        scope.register({ name: 'expressSingleton',      factory: function () { return expressSingleton; }}); // single instance used for app
        scope.register({ name: 'router',                factory: function () { return router; }});           // route engine
        scope.register({ name: 'favicon',               factory: function () { return favicon; }});
        scope.register({ name: 'logger',                factory: function () { return logger; }});
        scope.register({ name: 'cookieParser',          factory: function () { return cookieParser; }});
        scope.register({ name: 'bodyParser',            factory: function () { return bodyParser; }});
        scope.register({ name: 'less',                  factory: function () { return less; }});
        scope.register({ name: 'debug',                 factory: function () { return debug; }});
        scope.register({ name: 'serve-static',          factory: function () { return serveStatic; }});
        //scope.register({ name: 'request',               factory: function () { return request; }});

        /*
        // Alternatively, you can let Hilary gracefully degrade to node's require function.
        // If you don't define a dependency, and the name is resolvable via node's require function,
        // the result of that require function will be returned.
        //
        // The commented out definitions below serve as an example in this project
        */
        //scope.define('http', function () { return require('http'); });
        //scope.define('path', function () { return require('path'); });

        scope.register(require('./expressStartup.js'));         // configures middleware and controllers
        scope.register(require('./www.js'));                    // the HTTP server
    };

    /*
    // Where the routes (controllers) are registered
    // This will auto-resolve any controllers that are included in controller/index.js
    */
    configureRoutes = function (scope, expressApp) {
        scope.autoResolve(require('./controllers'));    // execute the controller modules to register routes
        scope.autoResolve(require('./api'));            // execute the api modules to register routes
        expressApp.use(scope.resolve('router'));        // use the router, after the controllers are all registered
    };

    /*
    // Last chance to add before and after handlers.
    // Executes configureRoutes - so all controllers get registered.
    */
    configureApplicationLifecycle = function (scope) {
        return function (expressApp) {
            // BEFORE
            (function () {
                expressApp.use(scope.resolve('authenticationMiddleware'));
            }());

            configureRoutes(scope, expressApp);

            // AFTER
            (function () {

            }());
        };
    };
}());

Hilary.scope('heinz').Bootstrapper({
    composeLifecycle: function (err, scope, pipeline) {
        console.log('startup::@' + new Date().toISOString());
        console.log('startup::composing application lifecycle');

        pipeline.on.error(function (err) {
            try {
                // try, in case this is triggered before exceptions are registered
                if (!exceptions) {
                    exceptions = scope.resolve('exceptions');
                }

                exceptions.throw(err);
            } catch (e) {
                console.log(e);
                console.log(err);
            }
        });
    },
    composeModules: function (err, scope) {
        // perform composition tasks (register modules here)
        console.log('startup::composing application modules');

        scope.register(require('./environment.js'));
        scope.register(require('./ExceptionHandler.js'));
        scope.autoRegister(require('./domain'));

        scope.register({
            name: 'exceptions',
            factory: function () {
                if (!exceptions) {
                    var ExceptionHandler = scope.resolve('ExceptionHandler');
                    exceptions = new ExceptionHandler(function (exception) {
                        console.error(exception);
                    });
                }

                return exceptions;
            }
        });

        scope.register({ name: 'ObjectID', singleton: true, factory: function () { return ObjectID; } });
        scope.register({ name: 'Blueprint', singleton: true, factory: function () { return Hilary.Blueprint; } });
        scope.register({ name: 'is', singleton: true, factory: function () { return scope.getContext().is; } });

        composeExpress(scope);
    },
    onComposed: function (err, scope) {
        var exceptions = scope.resolve('exceptions'),
            env = scope.resolve('environment'),
            connectionString = env.get('db:connx-string'),
            tasks = [];

        // database connection
        tasks.push(function (callback) {
            MongoClient.connect(connectionString, function (err, db) {
                if (err) {
                    exceptions.throwException(exceptions.makeException(err));
                }

                scope.register({ name: 'db', singleton: true, factory: function () { return db; } });
                callback();
            });
        });

        tasks.push(function (callback) {
            scope.resolve('expressStartup').init(configureApplicationLifecycle(scope), function (app) {
                var server;

                scope.register({
                    name: 'expressApp',
                    factory: function () {
                        return app;
                    }
                });

                scope.register({
                    name: 'server',
                    factory: function () {
                        return server;
                    }
                });

                // start the HTTP services
                server = scope.resolve('www');

                console.log('startup::application running');

                callback();
            });
        });




        console.log('startup::starting application');

        async.series(tasks, function (err) {
            if (err) {
                console.log(err);
            }
        });
    } // /onComposed
});
