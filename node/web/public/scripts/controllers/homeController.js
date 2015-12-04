Hilary.scope('heinz').register({
    name: 'homeController',
    dependencies: ['newGidgetModule', 'GidgetRoute', 'locale', 'viewEngine', 'Products', 'jQuery'],
    factory: function ($this, GidgetRoute, locale, viewEngine, Products, $) {
        'use strict';

        $this.get['/'] = function () {
            viewEngine.setVM({
                template: 't-empty',
                data: {
                    heading: locale.pages.home.empty.heading,
                    body: locale.pages.home.empty.body
                }
            });
        };

        // GET /#/search/?q=searchterm
        // search for products
        $this.get['/search'] = new GidgetRoute({
            routeHandler: function (err, req) {
                $.ajax({
                    url: '/api/search?q=' + req.uri.query.q,
                    method: 'GET'
                }).done(function (data) {
                    var results = new Products(data);

                    if (results.products().length > 0) {
                        viewEngine.setVM({
                            template: 't-product-grid',
                            data: results
                        });
                    } else {
                        viewEngine.setVM({
                            template: 't-no-results',
                            data: { searchterm: req.uri.query.q }
                        });
                    }
                });
            }
        });

        return $this;
    }
});
