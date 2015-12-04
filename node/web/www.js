module.exports.name = 'www';
module.exports.dependencies = ['expressApp', 'http', 'environment'];
module.exports.factory = function (app, http, env) {
    'use strict';

    var port,
        server,
        onError,
        onListening;
    //isWin = /^win/.test(process.platform);

    /*
    // Get port from environment and store in Express.
    */
    port = process.env.PORT || env.get('port') || 3000;
    app.set('port', port);


    /*
    // Create HTTP server.
    */
    server = http.createServer(app);


    /*
    // Event listener for HTTP server "error" event.
    */
    onError = function (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        // handle specific listen errors with friendly messages
        switch (error.code) {
        case 'EACCES':
            console.error('Port ' + port + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error('Port ' + port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
        }
    };


    /*
    // Event listener for HTTP server "listening" event.
    */
    onListening = function () {
        console.log('startup::listening on port ' + port);
    };


    /*
    // Listen on provided port, on all network interfaces.
    */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    return server;
};
