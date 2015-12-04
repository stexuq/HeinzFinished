module.exports.name = 'paymentController';
module.exports.dependencies = ['router','request'];
module.exports.factory = function (router,request) {
    'use strict';

    router.post('/api/payments', function (req, res) {
        //console.log(req.cookies.auth.email);
        //token is req.body.token
        console.log(req.body.token);
        //amount is req.body.amount
        console.log(req.body.amount);

        var dataToSend = {
            form: {
                amount: req.body.amount,
                currency:'usd',
                //source:req.query.q,
                source:req.body.token,
                description: 'Test 1'
            },
            auth: {
                user: 'sk_test_MNJ4UimKYlQ1ObMz42tMt2WV',
                pass:''
            },
            method: 'POST',
            url: 'https://api.stripe.com/v1/charges'
        };
        
        request(dataToSend, function(err, HttpRes, body) {
            if (!err && HttpRes.statusCode === 200) {
                res.send('200');
            }
            else {
                res.send('404');
            }
            console.log(err);
            console.log(HttpRes.statusCode);
            console.log(body);
        });
        
    });

    return router;
};
