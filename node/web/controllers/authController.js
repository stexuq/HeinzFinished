module.exports.name = 'authController';
module.exports.dependencies = ['router', 'usersRepo'];
module.exports.factory = function (router, repo) {
    'use strict';

    var authCookieExpiryDurationMinutes = 43200, // 30 days
        maxAge = authCookieExpiryDurationMinutes * 60 * 1000,
        addCookie;

    addCookie = function (user, res) {
        // normally, you wouldn't set a plain old user object as the
        // value of the cookie - it's not secure.
        res.cookie('auth', user, { maxAge: maxAge, httpOnly: true });
    };


    router.post('/register', function (req, res) {
        repo.create(req.body, function (err, result) {
            if (!err && result.insertedId) {
                repo.get(req.body.email, function (err, user) {
                    if (!err) {
                        addCookie(user, res);
                        res.redirect('/');
                    } else {
                        res.status(400);
                    }
                });
            } else {
                res.status(400);
            }
        });
    });

    router.post('/login', function (req, res) {
        console.log(req.body);
        repo.get(req.body.email, function (err, user) {
            if (!err) {
                addCookie(user, res);
                console.log(user);
                res.redirect('/'); //sho
            } else {
                res.status(400);
            }
        });
    });

    
    // check if a user is logged in
    router.get('/checklogin', function (req, res) {
        console.log('req.cookies: ', req.cookies);
        //email, if exitsted, is inside req.cookies.auth.email
        if(req.cookies.auth) {
            //console.log('req.cookies.auth.email: ',req.cookies.auth.email);
            repo.get(req.cookies.auth.email, function (err, user) {
                if (!err) {
                    //if is an authenticated user logging in
                    res.send('200');
                } else {
                    // if is not an authenticated user logging in
                    res.send('404');    
                }
            });
        }
        else {
            res.send('404');
        }
    });

    // log in for payment, merge
    router.post('/api/loginforpayment', function (req, res) {
        console.log('\n\n');
        console.log('req.session.cart: ', req.session.cart);
        console.log('req.body.email: ', req.body.email);
        repo.get(req.body.email, function (err, user) {
            if (!err) {
                repo.mergeCart(req.body.email, req.session.cart, function (err) {
                if (!err) {
                    addCookie(user, res);
                    //console.log(user);
                    res.send(user);
                } else {
                    res.status(400);
                }
                });
            } else {
                // if is not an authenticated user logging in
                res.status(400);    
            }
        }); 
    });
    
    
    return router;
};
