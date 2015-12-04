Hilary.scope('heinz').register({
    name: 'utils',
    factory: function () {
        'use strict';

        var self = {
            getRandomString: undefined
        };

        self.getRandomString = function (length) {
            var text = '',
                possible = 'abcdefghijklmnopqrstuvwxyz',
                i;

            for (i = 0; i < (length || 5); i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        };

        return self;
    }
});
