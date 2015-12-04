module.exports.name = 'searchApiController';
module.exports.dependencies = ['router', 'productsRepo', 'exceptions'];
module.exports.factory = function (router, repo, exceptions) {
    'use strict';

    router.get('/api/search', function (req, res) {
        repo.find({ query: { $text: { $search: req.query.q } } }, function (err, books) {
            if (err) {
                exceptions.throwException(err);
                res.status(400);
                return;
            }
            res.send(books);
        });
    });

    return router;
};
