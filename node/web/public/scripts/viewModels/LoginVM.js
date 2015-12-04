Hilary.scope('heinz').register({
    name: 'LoginVM',
    dependencies: ['jQuery', 'ko', 'router'],
    factory: function ($, ko, router) {
        'use strict';

        var LoginVM;

        LoginVM = function() {
            var self = {};

            self.email = ko.observable('shopper1@95729.com');
            
            self.login = function() {
                //alert('test haha');
                //console.log(self.email());
                // console.log(self.cvc());
                // console.log(self.month());
                // console.log(self.year());
                // knockout observable -> payment controller?
                var dataToSend ={
                    email: self.email()
                }
                router.post('/loginpayment', dataToSend);
            };
            
            return self;
        };

        return LoginVM;
    }
});
