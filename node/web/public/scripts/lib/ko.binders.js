(function ($, ko) {
    'use strict';

    var numberToCurrency;

    numberToCurrency = function (value, symbol) {
        return symbol + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    };

    ko.bindingHandlers.currency = {
        update: function (element, valueAccessor, allBindings/*, viewModel, bindingContext*/) {
            // This will be called once when the binding is first applied to an element,
            // and again whenever any observables/computeds that are accessed change
            // Update the DOM element based on the supplied values here.
            var value, symbol;

            value = +(ko.unwrap(valueAccessor()) || 0);
            symbol = allBindings.get('symbol') || '$';

            $(element).text(numberToCurrency(value, symbol));
        }
    };

    ko.bindingHandlers.href = {
        update: function (element, valueAccessor/*, allBindings, viewModel, bindingContext*/) {
            // This will be called once when the binding is first applied to an element,
            // and again whenever any observables/computeds that are accessed change
            // Update the DOM element based on the supplied values here.
            $(element).attr('href', ko.unwrap(valueAccessor()));
        }
    };

    ko.bindingHandlers.src = {
        update: function (element, valueAccessor/*, allBindings, viewModel, bindingContext*/) {
            // This will be called once when the binding is first applied to an element,
            // and again whenever any observables/computeds that are accessed change
            // Update the DOM element based on the supplied values here.
            $(element).attr('src', ko.unwrap(valueAccessor()));
        }
    };
}(jQuery, ko));
