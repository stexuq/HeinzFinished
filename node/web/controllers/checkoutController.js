module.exports.name = 'checkoutController';
module.exports.dependencies = ['router', 'productsRepo', 'exceptions', 'Cart', 'usersRepo'];
module.exports.factory = function (router, repo, exceptions, Cart, usersRepo) {
    'use strict';

     router.get('/api/checkout', function (req, res) {
        console.log(req.cookies.auth.email);
        usersRepo.get(req.cookies.auth.email, function (err, user) {
            if (err) {
                exceptions.throwException(err);
                res.status(400);
                return;
            }

            res.send(user.cart);
        });
    });
    
    router.get('/api/getcart', function(req,res) {
        res.send(req.session.cart);
    });

    router.get('/api/books/:uid/buy', function (req, res) {
        repo.get(req.params.uid, function (err, book) {
            if (err) {
                exceptions.throwException(err);
                res.status(400);
                return;
            }
            // log in or not?
            // if this user is logged in
            if(req.cookies.auth !== undefined) {
                usersRepo.addToCart(req.cookies.auth.email, book, function (err) {
                    if (err) {
                        exceptions.throwException(err);
                        res.status(400);
                        return;
                    }
                });
                // retrive cart from MongoDB
                // insert book into cart
                // save into MongoDB
            }
            // if this user is not logged in
            else {
                // save into cache
                if (req.session.cart === undefined) {
                    req.session.cart = {};
                    req.session.cart.book = [];
                    req.session.cart.amount = 0;
                }
                //add to cache
                req.session.cart = Cart.addToCart(req.session.cart, book);
                console.log(req.session.cart);
                console.log('------------------------------')
                console.log('length: ', req.session.cart.book.length);
            }   

            res.send(book);
        });
    });
    
    router.get('/api/books/:uid/removeqty', function (req, res) {
        repo.get(req.params.uid, function (err, book) {
            if (err) {
                exceptions.throwException(err);
                res.status(400);
                return;
            }
            // log in ?
            // if the user is logged in
            if(req.cookies.auth !== undefined) {
                usersRepo.removeQty(req.cookies.auth.email, book, function (err) {
                    if (err) {
                        exceptions.throwException(err);
                        res.status(400);
                        return;
                    }
                });
            }
            // not logged in
            else {
                if (req.session.cart === undefined) {
                    req.session.cart = {};
                    req.session.cart.book = [];
                    req.session.cart.amount = 0;
                }
                req.session.cart = Cart.removeQty(req.session.cart, book);
                console.log(req.session.cart);
                console.log('------------------------------')
                console.log('length: ', req.session.cart.book.length);
            }   

            res.send(book);
        });
    });

    router.get('/api/books/:uid/removelist', function (req, res) {
        repo.get(req.params.uid, function (err, book) {
            if (err) {
                exceptions.throwException(err);
                res.status(400);
                return;
            }
            // log in ?
            // if the user is logged in
            if(req.cookies.auth !== undefined) {
                usersRepo.removeList(req.cookies.auth.email, book, function (err) {
                    if (err) {
                        exceptions.throwException(err);
                        res.status(400);
                        return;
                    }
                });
            }
            // not logged in
            else {
                if (req.session.cart === undefined) {
                    req.session.cart = {};
                    req.session.cart.book = [];
                    req.session.cart.amount = 0;
                }
                req.session.cart = Cart.removeList(req.session.cart, book);
                console.log(req.session.cart);
                console.log('------------------------------')
                console.log('length: ', req.session.cart.book.length);
            }
            res.send(book);
        });
    });


    return router;
};
