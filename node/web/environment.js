module.exports.name = 'environment';
module.exports.dependencies = ['nconf'];
module.exports.factory = function (nconf) {
    'use strict';

    var useMemory;

    nconf.env().file('../environment/environment.json');

    // check to see if the configuration turns memory off (default is true)
    useMemory = nconf.get('storeThisConfigInMemory');
    useMemory = useMemory !== undefined ? useMemory : true;

    if (useMemory) {
        nconf.use('memory');
    }

    return nconf;
};
