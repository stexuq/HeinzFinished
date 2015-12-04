Hilary.scope('heinz').register({
    name: 'Entries',
    singleton: true,
    dependencies: ['ko', 'Product', 'Book', 'exceptions'],
    factory: function (ko, Product, Book, exceptions) {
        'use strict';

        var Entries;

        Entries = function (cart) {
            var self = {};

            self.books = ko.observableArray();
            self.amount = ko.observable();
            self.items = ko.observable();

            self.addBook = function (book) {
                if (!book) {
                    exceptions.throwArgumentException('The argument, book, must be defined to add a book', 'book');
                    return;
                }

                self.books.push(new Book(book));
            };

            // TODO: (Optimization) By adding items to the observableArray one
            // at a time, significantly more compute is required than if we
            // add them to a JS array and then set the value of self.books.
            self.addBooks = function (books) {
                if (!books) {
                    exceptions.throwArgumentException('The argument, books, must be defined to add books', 'books');
                    return;
                }

                var i;

                for (i = 0; i < books.length; i += 1) {
                    self.addBook(books[i]);
                }
            };

            // cart {book:[], amount}
            if (cart.book) {
                self.addBooks(cart.book);
            }
            self.amount = cart.amount;
            self.items = cart.items;
            
            console.log('amount is: ', self.amount);
            console.log('items is: ', self.items);

            return self;
        };

        return Entries;
    }
});
