Hilary.scope('heinz').register({
    name: 'exampleController',
    dependencies: ['newGidgetModule', 'GidgetRoute', 'locale', 'viewEngine'],
    factory: function ($this, GidgetRoute, locale, viewEngine) {
        'use strict';

        // route with `before` and `after` pipelines, using GidgetRoute
        $this.get['/gidget/example'] = new GidgetRoute({
            routeHandler: function () {
                viewEngine.setVM({
                    template: 't-empty',
                    data: {
                        heading: locale.pages.home.empty.heading,
                        body: 'Route: "/gidget/example"'
                    },
                    after: function (vm) {
                        console.log('view model:', vm);
                    }
                });
            },
            before: function (err, req) {
                console.log('before example 1 route:', req);
            },
            after: function (err, req) {
                console.log('after example 1 route:', req);
            }
        });

        // route with parameters
        $this.get['/gidget/breweries/:brewery/beers/:beer'] = function (err, req) {
            var body = 'Route: "/gidget/breweries/:brewery/beers/:beer", Brewery: {brewery}, Beer: {beer}'
                .replace('{brewery}', req.params.brewery)
                .replace('{beer}', req.params.beer);

            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: body
                }
            });

            console.log('this is a Gidget request object:', req);
        };

        return $this;
    }
});
