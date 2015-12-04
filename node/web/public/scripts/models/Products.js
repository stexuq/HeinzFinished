Hilary.scope('heinz').register({
    name: 'Products',
    singleton: true,
    dependencies: ['ko', 'Product', 'exceptions'],
    factory: function (ko, Product, exceptions) {
        'use strict';

        var Products = function (products) {
            var self = {};
            self.products = ko.observableArray();

            self.addProduct = function (product) {
                if (!product) {
                    exceptions.throwArgumentException('The argument, product, must be defined to add a product', 'product');
                    return;
                }

                self.products.push(new Product(product));
            };

            // TODO: (Optimization) By adding items to the observableArray one
            // at a time, significantly more compute is required than if we
            // add them to a JS array and then set the value of self.books.
            self.addProducts = function (products) {
                if (!products) {
                    exceptions.throwArgumentException('The argument, products, must be defined to add products', 'products');
                    return;
                }

                var i;

                for (i = 0; i < products.length; i += 1) {
                    self.addProduct(products[i]);
                }
            };

            if (products) {
                self.addProducts(products);
            }

            return self;
        };

        return Products;

    }
});
