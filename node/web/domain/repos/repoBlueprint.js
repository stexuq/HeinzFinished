/*
// See the README.md for info on this blueprint
*/
module.exports.name = 'repoBlueprint';
module.exports.singleton = true;
module.exports.dependencies = ['Blueprint'];
module.exports.factory = function (Blueprint) {
    'use strict';

    return new Blueprint({
        get: {
            type: 'function',
            args: ['uid', 'callback']
        },
        find: {
            type: 'function',
            args: ['options', 'callback']
        },
        create: {
            type: 'function',
            args: ['payload', 'callback']
        },
        update: {
            type: 'function',
            args: ['options', 'payload', 'callback']
        },
        remove: {
            type: 'function',
            args: ['uid', 'callback']
        }
    });
};
