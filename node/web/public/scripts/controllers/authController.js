Hilary.scope('heinz').register({
    name: 'authController',
    dependencies: ['newGidgetModule', 'GidgetRoute', 'locale', 'viewEngine','jQuery','LoginVM'],
    factory: function ($this, GidgetRoute, locale, viewEngine, $, LoginVM) {
        'use strict';

        // GET /#/login
        // login
        $this.get['/login'] = new GidgetRoute({
            routeHandler: function () {
                viewEngine.setVM({
                    template: 't-login',
                    data: { }
                });
            }
        });
        
        $this.get['/loginforpayment'] = new GidgetRoute({
            routeHandler: function (err, req) {
                var card = new LoginVM();
                viewEngine.setVM({
                    template: 't-login-payment',
                    data: card
                });
            }
        });
        
        $this.post['/loginpayment'] = function(err, req) {
                $.ajax({
                    //send the email collected in the loginVM to server
                    url:'api/loginforpayment',
                    data:{email:req.payload.email},
                    type:'POST'
                }).done(function(data){
                    console.log('done');
                    window.location.replace('/checkout');
                });
                //console.log('in client loginforpayment, req.payload.email: ', req.payload.email);
            };

        // POST /login
        // login
        $this.post['/login'] = new GidgetRoute({
            routeHandler: function () {
                return true; // ignore
            }
        });

        // GET /register
        // Register a new account
        $this.get['/register'] = new GidgetRoute({
            routeHandler: function () {
                viewEngine.setVM({
                    template: 't-register',
                    data: {}
                });
            }
        });

        return $this;
    }
});
