/*
// See the README.md for info on this module
*/
module.exports.name = 'Product';
module.exports.dependencies = ['Blueprint', 'ObjectID', 'exceptions'];
module.exports.factory = function (Blueprint, ObjectID, exceptions) {
    'use strict';

    var blueprint,
        Product;

    /*
    // This blueprint will be used to validate objects, and ensure that they
    // meet the minimum requirements for being a Product
    */
    blueprint = new Blueprint({
        _id: {
            type: 'object',
            required: false
        },
        uid: 'string',
        title: 'string',
        description: 'string',
        metadata: new Blueprint({
            keywords: {
                type: 'array',
                required: false
            }
        }),
        price: 'money',
        thumbnailLink: 'string',
        type: 'string'
    });

    /*
    // This is the Product constructor, which will be returned by this factory
    */
    Product = function (product) {
        // often times, we use selfies to provide a common object on which
        // to define properties. It's also common to see `var self = this`.
        var self = {};

        // Validate the the product argument passes muster with the Product blueprint
        if (!blueprint.syncSignatureMatches(product).result) {
            // If it doesn't, throw an argument exception
            exceptions.throwArgumentException('', 'product', blueprint.syncSignatureMatches(product).errors);
            // We don't know whether or not it will actually throw, so return undefined;
            return;
        }

        // define the Product properties from the product argument
        self._id = new ObjectID(product._id);
        self.uid = product.uid;
        self.title = product.title;
        self.description = product.description;
        self.metadata = product.metadata;
        self.price = product.price;
        self.thumbnailLink = product.thumbnailLink;
        self.type = product.type;

        return self;
    };

    /*
    // The db object is used to create and connect to the appropriate database
    // collection, which is similar to a table in relational storage.
    */
    Product.db = {
        // This is the name of the collection
        collection: 'products',
        // The indexes improve query performance
        indexes: [
            // This index enforces a unique uid, it allows multiple nulls
            // (sparse: true), although the Product model requires the uid property,
            // so a null should never be present.
            {
                keys: { name: 1 },
                options: { name: 'unq.products.uid', unique: true, sparse: true }
            },
            // This is the full-text index, which is used for searching
            // '$**' indicates that all text properties should be included
            // in the index. We allow this to process in the background,
            // for performance reasons.
            {
                keys: { '$**': 'text' },
                options: { name: 'idx.products.$text', background: true }
            },
            // Because we may filter our queries by product type, we index
            // the type property. We allow this to process in the background,
            // for performance reasons.
            {
                keys: { type: 1 },
                options: { name: 'unq.products.type', background: true }
            }
        ]
    };

    return Product;
};
