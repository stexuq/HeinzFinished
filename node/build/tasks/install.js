/*jslint node: true*/
var Spawner = require('./Spawner'),
    async = require('async');

module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('install', 'installs dependencies (i.e. node modules and bower components)', function () {
        var spawner = new Spawner(),
            done = this.async(),
            makeAction,
            doneHandler,
            series = [];

        makeAction = function (path) {
            return function (callback) {
                spawner.spawnThis('npm', ['start'], { cwd: path }, callback);
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

        series.push(function (callback) {
            spawner.spawnThis('npm', ['install'], { cwd: '../web' }, callback);
        });

        series.push(function (callback) {
            spawner.spawnThis('bower', ['install'], { cwd: '../web/public/scripts/lib' }, callback);
        });

        async.parallel(series, doneHandler);
    });
};
