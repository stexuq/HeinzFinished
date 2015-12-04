Hilary.scope('heinz').register({
    name: 'checkoutController',
    dependencies: ['newGidgetModule', 'GidgetRoute', 'locale', 'viewEngine', 'Products', 'jQuery', 'Entries'],
    factory: function ($this, GidgetRoute, locale, viewEngine, Products, $, Entries) {
        'use strict';

        $this.get['/checkout'] = new GidgetRoute({
            routeHandler: function (err, req) {
                //console.log('req.cookies', req.cookies);
                $.ajax({
                    url: '/checklogin',
                }).done(function (data) {
                    console.log('data sent back to /checkout:', data);
                    // data == 200 means is authenticated user
                    // retrive shopping cart from the data base
                    if(data === '200') {
                       $.ajax({
                                url: '/api/checkout/' 
                            }).done(function (cart) {
                                //var results = new Products(data);
                                //cart.amount = cart.amount;
                                var entries = new Entries(cart);
                                viewEngine.setVM({
                                    template: 't-shopping-cart',
                                    data: entries
                                });
                            });
                        }
                    // if it is not an authenticated user, retrive from req.session
                    else {
                        $.ajax({
                            url: '/api/getcart'
                        }).done(function(cart) {
                            //console.log('in client, cart is: ', cart);
                            var entries = new Entries(cart);
                                viewEngine.setVM({
                                    template: 't-shopping-cart',
                                    data: entries
                                });
                        });
                    }
                });
            }
        });

        
        $this.get['/book/:uid/buy'] = new GidgetRoute({
            
            routeHandler: function (err, req) {
                
                $.ajax({
                    url: '/api/books/' + req.params.uid + '/buy'
                }).done(function (data) {
                    //console.log('hehehehe');
                    
                    console.log(data);
                    //window.location.replace('/checkout');
                    var number = $(".cart-number").text()
                    if (number == "")
                        $(".cart-number").text("1");
                    else {
                       var new_number = parseInt(number) + 1;
                       $(".cart-number").text(new_number.toString());
                    }
                });
            }
        });

        $this.get['/book/:uid/buyincart'] = new GidgetRoute({
            
            routeHandler: function (err, req) {
                
                $.ajax({
                    url: '/api/books/' + req.params.uid + '/buy'
                }).done(function (data) {
                    //console.log('hehehehe');
                    console.log(data);
                    window.location.replace('/checkout');
                });
            }
        });


        $this.get['/book/:uid/removeqty'] = new GidgetRoute({
            
            routeHandler: function (err, req) {
                
                $.ajax({
                    url: '/api/books/' + req.params.uid + '/removeqty'
                }).done(function (data) {
                    //console.log('hehehehe');
                    console.log(data);
                    // router.navigate('/')

                    // $.ajax({
                    //     url: '/api/checkout/' 
                    // }).done(function (cart) {
                    // //var results = new Products(data);
                    //     var entries = new Entries(cart);
                    //     viewEngine.setVM({
                    //         template: 't-shopping-cart',
                    //         data: entries
                    //     });
                    // });
                    window.location.replace('/checkout');
                });
            }
        });

        $this.get['/book/:uid/removelist'] = new GidgetRoute({
            
            routeHandler: function (err, req) {
                
                $.ajax({
                    url: '/api/books/' + req.params.uid + '/removelist'
                }).done(function (data) {
                    //console.log('hehehehe');
                    console.log(data);
                    // $.ajax({
                    //     url: '/api/checkout/' 
                    // }).done(function (cart) {
                    // //var results = new Products(data);
                    //     var entries = new Entries(cart);
                    //     viewEngine.setVM({
                    //         template: 't-shopping-cart',
                    //         data: entries
                    //     });
                    // });
                    window.location.replace('/checkout');
                });
            }
        });


        return $this;
    }
});
