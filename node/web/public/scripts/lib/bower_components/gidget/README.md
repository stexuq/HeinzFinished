Gidget
==========

Gidget is a Domain Service Language (DSL) and route engine for JavaScript SPAs inspired by NancyFx, Sinatra and express.

## Getting started

You can install Gidget with bower, or download the js files from the release directory. It depends on [Hilary](https://github.com/Acatar/hilaryjs), so let's install that too.

```Shell
$ bower install --save hilary
$ bower install --save gidget
```

Then add two script tags to your DOM:

```HTML
<script src="/bower_components/hilary/release/hilary.min.js"></script>
<script src="/bower_components/gidget/release/gidget.min.js"></script>
```

### Gidget Modules
Let's start by creating a controller. We do this by creating instances of ``GidgetModule``.

```JavaScript
var homeController = new Gidget.GidgetModule();

homeController.get['/'] = function (err, req) {
    console.log('Home');
};
```

Gidget has built in support for parameters:

```JavaScript
var beerController = new Gidget.GidgetModule();

beerController.get['/breweries/:brewery/beers/:beer'] = function (err, req) {
    console.log('Brewery', req.params.brewery);
    console.log('Beer', req.params.beer);
};
```

If you want to add pipeline events to a given route, it's easiest to do this with a ``GidgetRoute``.

```JavaScript
var beerController = new Gidget.GidgetModule();

beerController.get['/breweries/:brewery/beers/:beer'] = new Gidget.GidgetRoute({
    before: function (err, req) {
        console.log('before beer', req);
    },
    routeHandler: function (err, req) {
        console.log('Brewery', req.params.brewery);
        console.log('Beer', req.params.beer);
    },
    after: function (err, req) {
        console.log('after beer', req);
    }
});
```

### Starting Gidget (the Bootstrapper)
Gidget has a built in Bootstrapper to help you get started. You don't have to use it, but it's the easiest way to get started. The properties are demonstrated in the order in which they will be executed.

```JavaScript
Gidget.Bootstrapper(null, {
    composeLifecycle: function (err, gidgetApp, pipeline) {
        // compose your lifecycle events here
        pipeline.on.error(function (err) {
            console.log(err);
        });
    },
    composeRoutes: function (err, gidgetApp) {
        // add your controllers
        // usually you would not define the controllers
        // here. you would merely register them
        var controller = new Gidget.GidgetModule();

        controller.get['/'] = function (err, req) {
            console.log('Home');
        };

        controller.get['/breweries/:brewery/beers/:beer'] = function (err, req) {
            console.log('Brewery', req.params.brewery);
            console.log('Beer', req.params.beer);
        };

        gidgetApp.registerModule(controller);
    },
    onComposed: function (err, gidgetApp) {
        // when
        if (!err) {
            console.log('Gidget is Ready!', gidgetApp);
        }
    }
});
```

If you are composing your application using Hilary, there are some additional features you can take advantage of. Note that in this example, we pass our Hilary scope into the Bootstrapper as the first argument. Again, the properties are demonstrated in the order in which they will be executed.

```JavaScript
Gidget.Bootstrapper(Hilary.scope('app'), {
    hilary: {
        composeLifecycle: function (err, scope, pipeline) {
            pipeline.registerEvent('hilary::before::register', function (scope, moduleInfo) {
                console.log('app::before::register', moduleInfo);
            });
        },
        composeModules: function (err, scope) {
            var singleton = 'hello world!';
            scope.register({ name: 'someSingleton', factory: function () { return singleton; } });
        },
        onComposed: function (err, scope) {
            console.log('Hilary is Ready!', gidgetApp);
            console.log(scope.resolve('someSingleton'));
        }
    },
    // ommited for brevity
    // composeLifecycle: ...
    // composeRoutes: ...
    // onComposed: ...
});
```
