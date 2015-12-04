Hilary.scope('heinz').register({
    name: 'ExceptionHandler',
    dependencies: [],
    factory: function (onError) {
        'use strict';

        var self = {
                makeException: undefined,
                argumentException: undefined,
                throwArgumentException: undefined,
                notImplementedException: undefined,
                throwNotImplementedException: undefined,
                fetchException: undefined,
                throwFetchException: undefined,
                throwException: undefined,
                throw: undefined
            },
            makeException;

        onError = (typeof onError === 'function') ? onError : function (exception) {
            console.error(exception);
            throw exception;
        };

        makeException = function (name, message, data) {
            var msg,
                err;

            if (typeof name === 'object' && typeof name.message === 'string') {
                // The name argument probably received an Error object
                msg = name.message;
                err = name;
            } else {
                msg = typeof message === 'string' ? message : name;
                err = new Error(msg);
            }

            err.message = msg;

            if (name !== msg) {
                err.name = name;
            }

            if (data) {
                err.data = data;
            }

            return err;
        };

        self.makeException = makeException;

        self.argumentException = function (message, argument, data) {
            var msg = typeof argument === 'undefined' ? message : message + ' (argument: ' + argument + ')';
            return makeException('ArgumentException', msg, data);
        };

        self.throwArgumentException = function (message, argument, data) {
            self.throw(self.argumentException(message, argument, data));
        };

        self.notImplementedException = function (message, data) {
            return makeException('NotImplementedException', message, data);
        };

        self.throwNotImplementedException = function (message, data) {
            self.throw(self.notImplementedException(message, data));
        };

        self.fetchException = function (response) {
            response = response || {};

            return makeException('FetchException', 'Server Request Failed with status: ' + response.status, response);
        };

        self.throwFetchException = function (response) {
            self.throw(self.fetchException(response));

            // In order to support fetch.throw, we have to throw a real JS Exception
            // If self.throw doesn't do that for us, this will ensure that functionality
            // is maintained
            throw new Error('Server Request Failed with status: ' + response.status);
        };

        self.throwException = function (exception) {
            self.throw(exception);
        };

        self.throw = function (exception) {
            if (typeof exception === 'string') {
                onError(makeException(exception));
            } else {
                onError(exception);
            }
        };

        return self;
    }
});
