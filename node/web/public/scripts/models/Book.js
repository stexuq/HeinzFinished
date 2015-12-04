Hilary.scope('heinz').register({
    name: 'Book',
    singleton: true,
    dependencies: ['ko', 'Product'],
    factory: function (ko, Product) {
        'use strict';

        var Book = function (book) {
            var self = new Product(book);

            self.thumbnailLink = ko.observable(book.thumbnailLink || '/images/books/default.png');
            self.reviews = ko.observableArray();

            return self;
        };

        return Book;
    }
});
