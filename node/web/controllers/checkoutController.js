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
        //console.log('want to sent back: ', req.session.cart);
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
            // logged in with user name = name
            //console.log(req.cookies);
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
            // not logged in
            else {
                // save into memory
                // first time access?
                //console.log(res.locals);
                if (req.session.cart === undefined) {
                    req.session.cart = {};
                    req.session.cart.book = [];
                    req.session.cart.amount = 0;
                }
                //add to memory
                //req.session.cart.push(book);
                req.session.cart = Cart.addToCart(req.session.cart, book);
                // new model
                //req.session.cart = new Cart(req.session.cart, book);
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
            // logged in with user name = name
            //console.log(req.cookies);
            if(req.cookies.auth !== undefined) {
                usersRepo.removeQty(req.cookies.auth.email, book, function (err) {
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
            // not logged in
            else {
                // save into memory
                // first time access?
                if (req.session.cart === undefined) {
                    req.session.cart = {};
                    req.session.cart.book = [];
                    req.session.cart.amount = 0;
                }
                //add to memory
                //req.session.cart.push(book);
                req.session.cart = Cart.removeQty(req.session.cart, book);
                // new model
                //req.session.cart = new Cart(req.session.cart, book);
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
            // logged in with user name = name
            //console.log(req.cookies);
            if(req.cookies.auth !== undefined) {
                usersRepo.removeList(req.cookies.auth.email, book, function (err) {
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
            // not logged in
            else {
                // save into memory
                // first time access?
                if (req.session.cart === undefined) {
                    req.session.cart = {};
                    req.session.cart.book = [];
                    req.session.cart.amount = 0;
                }
                //add to memory
                //req.session.cart.push(book);
                req.session.cart = Cart.removeList(req.session.cart, book);
                // new model
                //req.session.cart = new Cart(req.session.cart, book);
                console.log(req.session.cart);
                console.log('------------------------------')
                console.log('length: ', req.session.cart.book.length);
            }
            res.send(book);
        });
    });


    return router;
};
