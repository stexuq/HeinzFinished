module.exports.name = 'expressStartup';
module.exports.dependencies = [
    'expressSingleton',
    'path',
    'cookieParser',
    'bodyParser',
    'serve-static',
    'less',
    'hbs',
    'favicon',
    'express-session'
];
module.exports.factory = function (app, path, cookieParser, bodyParser, serveStatic, less, hbs, favicon, session) {
    'use strict';

    var before,
        after;

    before = function () {
        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'hbs');

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(less(path.join(__dirname, 'public')));
        app.use(serveStatic(path.join(__dirname, 'public')));
        app.use(favicon(__dirname + '/public/favicon.ico'));
        app.use(session({
          genid: function(req) {
              function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
              }
              return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
          },
          secret: 'keyboard cat'
        }));

        hbs.registerPartials(__dirname + '/views/templates');
    };

    after = function () {
        // make 404's a greedy index route for the SPA
        app.use(function (req, res) {
            res.render('index', { title: 'web' });
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res) {
                res.status(err.status || 500);
                res.render('error', { title: 'error', message: err.message, error: err });
            });
        } else {
            // production error handler
            // no stacktraces leaked to user
            app.use(function (err, req, res) {
                res.status(err.status || 500);
                res.render('error', { title: 'error', message: err.message, error: {} });
            });
        }
    };

    return {
        init: function (applicationLifecycle, next) {
            before();

            if (typeof applicationLifecycle === 'function') {
                applicationLifecycle(app);
            }

            after();

            if (typeof next === 'function') {
                next(app);
            }

            return app;
        }
    };
};
