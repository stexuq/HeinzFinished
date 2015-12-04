/*jslint node: true*/
var Spawner = require('./Spawner'),
    async = require('async');

module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('clean', 'Removes node_modules and bower_components', function () {
        var spawner = new Spawner(),
            done = this.async(),
            isWin = /^win/.test(process.platform),
            makeAction,
            doneHandler,
            series = [];

        makeAction = function (folder, path) {
            return function (callback) {
                if (isWin) {
                    // TODO: Add support for clean on Windows
                    console.log('Sorry Windows is not yet supported');
                } else {
                    spawner.spawnThis('rm', ['-rf', folder], { cwd: path }, callback);
                }

            };
        };

        doneHandler = function (err, results) {
            var i;

            if (err) {
                console.error(err);
            } else {
                for (i = 0; i < results.length; i += 1) {
                    console.log(results[i]);
                }
            }

            done();
        };

        series.push(makeAction('node_modules', '../web'));
        series.push(makeAction('bower_components', '../web/public/scripts/lib'));

        async.series(series, doneHandler);
    });
};
