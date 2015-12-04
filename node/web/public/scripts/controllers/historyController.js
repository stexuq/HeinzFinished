Hilary.scope('heinz').register({
    name: 'historyController',
    dependencies: ['newGidgetModule', 'GidgetRoute', 'locale', 'viewEngine', 'Books', 'jQuery'],
    factory: function ($this, GidgetRoute, locale, viewEngine, Books, $) {
        'use strict';

        $this.get['/history'] = new GidgetRoute({
            routeHandler: function (err, req) {
                //console.log('req.cookies', req.cookies);
                $.ajax({
                    url: '/api/gethistory'
                }).done(function (history) {
                    console.log('data sent back to /history:', history);
                    // data == 200 means is authenticated user
                    // retrive shopping cart from the data base
                    var data = new Books(history);
                    viewEngine.setVM({
                        template: 't-history',
                        data: data
                    });
                });
            }
        });

        return $this;
    }
});
