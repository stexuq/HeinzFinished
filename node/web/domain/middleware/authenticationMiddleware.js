module.exports.name = 'authenticationMiddleware';
module.exports.dependencies = ['User'];
module.exports.factory = function (User) {
    'use strict';

    return function (req, res, next) {
        var authCookie = req.cookies.auth;

        if (authCookie) {
            res.locals.user = new User(authCookie);
        }
        
        next();
    };
};
