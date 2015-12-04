/*
// See the README.md for info on this module
*/
module.exports.name = 'Book';
module.exports.dependencies = ['Blueprint', 'Product', 'exceptions'];
module.exports.factory = function (Blueprint, Product, exceptions) {
    'use strict';

    var blueprint,
        Book;

    // The Product blueprint will validate the majority of the model.
    // This blueprint is meant to enforce properties that are unique to Book.
    blueprint = new Blueprint({
        metadata: new Blueprint({
            authors: 'array'
        })
    });

    Book = function (book) {
        // Inherit Product
        var self = new Product(book);

        // Validate that this meets the Book schema
        if (!book || !blueprint.syncSignatureMatches(book).result) {
            exceptions.throwArgumentException('', 'book', blueprint.syncSignatureMatches(book).errors);
            return;
        }

        return self;
    };

    return Book;
};
