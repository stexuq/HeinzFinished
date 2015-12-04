var Spawner = function (options) {
    'use strict';

    var self = this,
        spawn = require('child_process').spawn,
        isWin = /^win/.test(process.platform),
        log,
        nonExecutables = ['npm', 'grunt', 'bower', 'dnu', 'dnx'],
        isNotExecutable;

    options = options || {};

    log = options.log || function (data) {
        console.log(data); // the string concat converts binary output to string; trim cuts the extra line
    };

    isNotExecutable = function (command) {
        var i;

        for (i = 0; i < nonExecutables.length; i += 1) {
            if (command === nonExecutables[i]) {
                return true;
            }
        }

        return false;
    };

    self.spawnThis = function (command, args, options, callback) {
        if (isWin && isNotExecutable(command)) {
            // windows doesn't know what to do with these,
            // move the command to the beggining of the args array and
            // set the command to be powershell
            args.unshift(command);
            command = 'powershell.exe';
        }

        var spawned = spawn(command, args, options),
            output = [],
            currentLine;

        spawned.stdout.on('data', function (stdout) {
            currentLine = (' ' + stdout).trim();
            log(currentLine);
            output.push(currentLine);
        });

        spawned.stderr.on('data', function (stderr) {
            currentLine = (' ' + stderr).trim();
            log(currentLine);
            output.push(currentLine);
        });

        spawned.on('exit', function (code) {
            callback(null, code, output);
        });
    };
};

module.exports = Spawner;
