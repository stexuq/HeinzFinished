module.exports.name = 'usersRepo';
module.exports.singleton = true;
//module.exports.blueprint = ['repoBlueprint'];
module.exports.dependencies = ['db', 'User', 'Blueprint', 'exceptions', 'is','Cart', 'History'];
module.exports.factory = function (db, User, Blueprint, exceptions, is, Cart, History) {
    'use strict';

    var self = {
            get: undefined,
            find: undefined,
            create: undefined,
            update: undefined,
            remove: undefined
        },
        collection = db.collection(User.db.collection),
        i;

    // ensure the indexes exist
    for (i = 0; i < User.db.indexes.length; i += 1) {
        collection.createIndex(User.db.indexes[i].keys, User.db.indexes[i].options);
    }

    /*
    // Get a single user
    */
    self.get = function (email, callback) {
        if (is.not.string(email)) {
            exceptions.throwArgumentException('', 'uid');
            return;
        }

        if (is.not.function(callback)) {
            exceptions.throwArgumentException('', 'callback');
            return;
        }

        collection.find({ email: email }).limit(1).next(function (err, doc) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, new User(doc));
        });
    };

    /*
    // Create a user
    */
    self.create = function (payload, callback) {
        if (is.not.object(payload)) {
            exceptions.throwArgumentException('', 'payload');
            return;
        }

        if (is.not.function(callback)) {
            exceptions.throwArgumentException('', 'callback');
            return;
        }

        collection.insertOne(payload, callback);
    };

    // add to Mongo DB
    self.addToCart = function (email, book, callback) {
        self.get(email, function (err, user) {
            user.cart = Cart.addToCart(user.cart, book);
            collection.updateOne(
            { "email": email }, 
            {
                $set: { "cart": user.cart },
            }, function(err, results) {
              //console.log(results);
              callback(err);
            });
        });
    };
    
    // merge an old cart and a local cart in req.session 
    self.mergeCart = function (email, localCart, callback) {
        self.get(email, function (err, user) {
            // merge 
            user.cart = Cart.mergeCart(user.cart, localCart);
            collection.updateOne(
            { "email": email }, 
            {
                $set: { "cart": user.cart },
            }, function(err, results) {
                //console.log(results);
              callback(err);
            });
        });
    };

    // remove one qty from Mongo DB
    self.removeQty = function (email, book, callback) {
        self.get(email, function (err, user) {
            user.cart = Cart.removeQty(user.cart, book);
            collection.updateOne(
            { "email": email }, 
            {
                $set: { "cart": user.cart },
            }, function(err, results) {
              //console.log(results);
              callback(err);
            });
        });
    };

    // remove one book (entire book item) from Mongo DB
    self.removeList = function (email, book, callback) {
        self.get(email, function (err, user) {
            user.cart = Cart.removeList(user.cart, book);
            collection.updateOne(
            { "email": email }, 
            {
                $set: { "cart": user.cart },
            }, function(err, results) {
              //console.log(results);
              callback(err);
            });
        });
    };
    
    // push cart to history means to clear the shopping cart
    self.pushHistory = function (email, callback) {
        self.get(email, function (err, user) {
            console.log("test---------" ,user);
            user.history = History.pushCart(user.history, user.cart);
            collection.updateOne(
            { "email": email }, 
            {
                $set: { 
                    "history": user.history,
                    "cart": {"book":[], amount:0}
                },
            }, function(err, results) {
              //console.log(results);
              callback(err);
            });
        });
    };
    
    return self;
};
