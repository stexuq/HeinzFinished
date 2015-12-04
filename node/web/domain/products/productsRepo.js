/*
// See the README.md for info on this module
*/
module.exports.name = 'productsRepo';
module.exports.singleton = true;
//module.exports.blueprint = ['repoBlueprint'];
module.exports.dependencies = ['db', 'Product', 'Blueprint', 'exceptions', 'is'];
module.exports.factory = function (db, Product, Blueprint, exceptions, is) {
    'use strict';

    var self = {
            get: undefined,
            find: undefined,
            create: undefined,
            update: undefined,
            remove: undefined
        },
        collection = db.collection(Product.db.collection),
        findOptionsBlueprint,
        i;

    // ensure the indexes exist
    for (i = 0; i < Product.db.indexes.length; i += 1) {
        collection.createIndex(Product.db.indexes[i].keys, Product.db.indexes[i].options);
    }

    findOptionsBlueprint = new Blueprint({
        query: 'object',
        skip: {
            type: 'number',
            required: false
        },
        limit: {
            type: 'number',
            required: false
        }
    });

    /*
    // Get a single product
    */
    self.get = function (uid, callback) {
        // Blueprint isn't helpful for defending arguments, when they are
        // not objects. Here we defend the function arguments by hand.
        if (is.not.string(uid)) {
            exceptions.throwArgumentException('', 'uid');
            return;
        }

        if (is.not.function(callback)) {
            exceptions.throwArgumentException('', 'callback');
            return;
        }

        // This uses mongodb's find feature to obtain 1 document, by
        // limiting the result. `find` and `limit` return promises, so
        // the query isn't executed until `next` is called. It receives a
        // callback function so it can perform the IO asynchronously, and
        // free up the event-loop, while it's waiting.
        collection.find({ uid: uid }).limit(1).next(function (err, doc) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, new Product(doc));
        });
    };

    /*
    // Find product(s)
    */
    self.find = function (options, callback) {
        // Since options is an object, we can use Blueprint to validate it.
        if (!findOptionsBlueprint.syncSignatureMatches(options).result) {
            exceptions.throwArgumentException('', 'options', findOptionsBlueprint.syncSignatureMatches(options).errors);
            return;
        }

        // But we'll make sure a callback function was provided, by hand
        if (is.not.function(callback)) {
            exceptions.throwArgumentException('', 'callback');
            return;
        }

        // Set default skip and limit values if they weren't set
        var skip = options.skip || 0,
            limit = options.limit || 20;

        // This uses mongodb's find feature to obtain multiple documents,
        // although it still limits the result set. `find`, `skip`, and `limit`
        // return promises, so the query isn't executed until `toArray` is
        // called. It receives a callback function so it can perform the
        // IO asynchronously, and free up the event-loop, while it's waiting.
        collection.find(options.query).skip(skip).limit(limit).toArray(function (err, docs) {
            var products = [], i;

            if (err) {
                callback(err);
                return;
            }

            for (i = 0; i < docs.length; i += 1) {
                products.push(new Product(docs[i]));
            }

            callback(null, products);
        });
    };

    return self;
};
