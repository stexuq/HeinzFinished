Hilary.scope('heinz').register({
    name: 'PaymentVM',
    dependencies: ['jQuery', 'ko', 'router'],
    factory: function ($, ko, router) {
        'use strict';

        var PaymentVM;

        PaymentVM = function() {
            var self = {};

            self.card = ko.observable('');
            self.cvc = ko.observable('');
            self.month = ko.observable('');
            self.year = ko.observable('');
            
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
