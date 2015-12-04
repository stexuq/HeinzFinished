Hilary.scope('heinz').register({
    name: 'PaymentVM',
    dependencies: ['jQuery', 'ko', 'router'],
    factory: function ($, ko, router) {
        'use strict';

        var PaymentVM;

        PaymentVM = function() {
            var self = {};

            self.card = ko.observable('4242424242424242');
            self.cvc = ko.observable('123');
            self.month = ko.observable('10');
            self.year = ko.observable('2016');
            
            self.makePayment = function() {
                // alert('test haha');
                // console.log(self.card());
                // console.log(self.cvc());
                // console.log(self.month());
                // console.log(self.year());
                // knockout observable -> payment controller?
                var dataToSend = {
                    card:self.card(),
                    month:self.month(),
                    year:self.year(),
                    cvc:self.cvc()
                };
                router.post('/token', dataToSend);
            };
            
            return self;
        };

        return PaymentVM;
    }
});
