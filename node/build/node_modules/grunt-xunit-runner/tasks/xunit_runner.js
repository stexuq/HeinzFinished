/*
 * grunt-xunit-runner
 * https://github.com/reharik/grunt_xunit_runner
 *
 * Copyright (c) 2014 Raif Harik
 * Licensed under the MIT license.
 */


'use strict';

module.exports = function (grunt) {
    var exec = require('child_process').exec;
    var util = require('util');
    var path = require("path");
    var async = require('async');
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('xunit_runner', 'Grunt task for running multiple xunit dlls with all the options that xunit console provides', function () {

        var asyncCallback = this.async();
        var output = [];
        var done = this.async();
        var assemblies = [];
        var testResult = {
            total: 0,
            failed: 0,
            skipped: 0,
            time: 0
        };
        var options = this.options({
            stdout: true,
            stderr: true,
            workingDir:'',
            xUnit: "xunit.console.exe",
            silent:'true',
            teamcity:'false',
            trait:'',
            notrait:'',
            noshadow:'',
            xml:'',
            html:'',
            nunit:''
        });

        grunt.verbose.writeln('Using Options: ' + JSON.stringify(options, null, 4).cyan);

        if(this.data && this.data.TestAndConfig) {
            assemblies = this.data.TestAndConfig.map(function (dll) {
                return function (cb) {
                    build(path.resolve(dll.file), path.resolve(dll.config), options, output, cb);
                }
            });
        }

        assemblies = assemblies.concat(this.filesSrc.map(function(file){
            return function(cb){
                build(file,'',options,output, cb);
            }
        }));

        assemblies.push(function (cb) { cb(); });

        // calls all the assemblies synchonously then expresses the output
        async.series(assemblies, function (err, callback) {
            asyncCallback();
            output.forEach(function (outputObj) {
                testResult.total += outputObj.total;
                testResult.failed += outputObj.failed;
                testResult.skipped += outputObj.skipped;
                testResult.time += outputObj.time;
            });

            grunt.log.writeln('-----------------------------Final-----------------------------------');
            var text = testResult.total + ' total, ' + testResult.failed + ' failed , ' + testResult.skipped + ' skipped , ' + 'took ' + testResult.time + ' seconds';
            text = testResult.failed > 0 ? text.magenta : text.green;
            grunt.log.writeln(text);
            if(testResult.failed>0){
                grunt.fail.fatal(testResult.failed +" tests failed");
            }
        });
    });

    function build(src, config, options, output, cb) {
        var  data =[];
        var cmd = buildCmdLine(src, config, options);
        grunt.verbose.writeln('Using Command:' + cmd.cyan);

        var cp = exec(cmd, {cwd:path.resolve(options.workingDir)}, function (err, stdout, stderr) {});
        cp.stdout.on('data', function (chunk) {
            data.push(chunk);
        });
        cp.stdout.on('end',function(){
            processFinalLine(data, output);
            grunt.log.writeln(src.cyan);
            cb();
        });

        if (options.stdout || grunt.option('verbose')) {
            cp.stdout.pipe(process.stdout);
        }
        if (options.stderr || grunt.option('verbose')) {
            cp.stderr.pipe(process.stderr);
        }
    }

    function processFinalLine(data, output) {
        var lastChunk = data.pop();
        var lastLineArray = lastChunk ?lastChunk.match(/^[0-9]*\stotal.*$/m)||'':'';

        var line = lastLineArray[0];
        if(line && line.length>0){
            var parts = line.split(',');
            output.push({
                total: parseInt(parts[0].split(' ')[0], 10 ),
                failed: parseInt(parts[1].split(' ')[1], 10),
                skipped: parseInt(parts[2].split(' ')[1], 10),
                time: parseFloat(parts[3].split(' ')[2], 10)
            });
        }
    }

    function buildCmdLine(src, config, options) {
        var arg = config  ?config+' ':'';
        arg += options.silent==='true' ? '/silent  ': '';
        arg += options.teamcity==='true' ? '/teamcity ' : '';
        arg += options.trait.length>0 ? '/trait "' + options.trait+'"' : '';
        arg += options.notrait.length>0 ? '/notrait "' + options.notrait +'"': '';
        arg += options.noshadow.length>0 ? '/noshadow' + options.noShadow : '';
        arg += options.xml.length>0 ? '/xml '+ options.xml : '';
        arg += options.html.length>0 ? '/html '+ options.html : '';
        arg += options.nunit.length>0 ? '/nunit '+ options.nunit : '';

        return util.format("%s %s ", options.xUnit, src, arg);
    }
};

