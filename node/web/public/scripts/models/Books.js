Hilary.scope('heinz').register({
    name: 'Books',
    singleton: true,
    dependencies: ['ko', 'Book', 'exceptions'],
    factory: function (ko, Book, exceptions) {
        'use strict';

        var Books;

        Books = function (books) {
            var self = {};

            self.books = ko.observableArray();

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

            if (books) {
                self.addBooks(books);
            }

            return self;
        };

        return Books;
    }
});
