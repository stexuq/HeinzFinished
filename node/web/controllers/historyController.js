module.exports.name = 'historyController';
module.exports.dependencies = ['router', 'productsRepo', 'exceptions', 'Cart', 'usersRepo'];
module.exports.factory = function (router, repo, exceptions, Cart, usersRepo) {
    'use strict';

    router.get('/api/pushhistory', function (req, res) {
        console.log(req.cookies.auth.email);
        //push a shopping cart to history, and empty the cart
        usersRepo.pushHistory(req.cookies.auth.email, function (err, user) {
            if (err) {
                exceptions.throwException(err);
                res.status(400);
                return;
            }
            res.send('push successfully');
            //res.send(user.cart);
        });
    });
    

    router.get('/api/gethistory', function (req, res) {
        //console.log(req.cookies.auth.email);
        console.log("test------------------------------>", req.cookies.auth.email);
        usersRepo.get(req.cookies.auth.email, function (err, user) {
            if (err) {
                exceptions.throwException(err);
                res.status(400);
                return;
            }
            //send back history
            //console.log('\n\n\n',user);
            console.log('\n\n\n',user.history);
            res.send(user.history);
        });
    });
 


    return router;
};
