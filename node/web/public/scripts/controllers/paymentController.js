Hilary.scope('heinz').register({
    name: 'paymentController',
    dependencies: ['newGidgetModule', 'GidgetRoute', 'locale', 'viewEngine', 'Products', 'jQuery', 'PaymentVM', 'Stripe'],
    factory: function ($this, GidgetRoute, locale, viewEngine, Products, $, PaymentVM, Stripe) {
        'use strict';

        
        // publishable key
        Stripe.setPublishableKey('pk_test_WEsJAyH876BQwlSCRYw3HoXM');
        
        // create Stripe token on what event?

        //old version - default: authenticated user
        $this.get['/payment'] = function () {
            $.ajax({
                url: '/checklogin'
            }).done(function(data) {
                if(data === '200') {
                    // if already log in, proceed to payment with view engine
                    console.log(data);
                    var card = new PaymentVM();
                    viewEngine.setVM({
                        template: 't-payment',
                        data: card
                    }); 
                }
                else {
                    //force to log in
                    console.log(data);
                    window.location.replace('/loginforpayment');
                    //merge shopping cart into mongoDB
                    //
                }
            });
        };
        
        $this.post['/token'] = function (err, req) {
            $.ajax({
                    url: '/api/checkout/' 
                }).done(function (cart) {
                    //var amount = Math.floor(cart.amount * 100);
                    var amount = Math.floor(cart.amount * 100);
                    Stripe.createToken({
                        number:req.payload.card,
                        exp_month:req.payload.month,
                        exp_year:req.payload.year,
                        cvc:req.payload.cvc
                    }, 
                    function(err, token) {
                        console.log('---');
                         $.ajax({
                            url: '/api/payments',
                            data: {
                                token: token.id,
                                amount: amount
                            },
                            type:'POST'
                        }).done(function (data) {
                           console.log('done');
                           console.log('payment response data:', data);
                           if (data === '200') {
                                $.ajax({
                                    //push the cart to history by GET and empty the cart
                                    url:'api/pushhistory'
                                }).done(function(data){
                                    console.log('done pushing to history');
                                    alert('Your order has been paid successfully. Click OK to retrive your books.')
                                    window.location.replace('/history');
                                });
                           }
                           else{
                            alert('payment failed, please try again.');
                            window.location.replace('/payment');
                           }
                        });
                    }
                  );
                });
        };
     
        return $this;
    }
});
