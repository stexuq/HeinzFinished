module.exports = function (grunt) {
    'use strict';

    var os;

    // arguments
    os = grunt.option('os') || 'osx';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadTasks('tasks');
    grunt.registerTask('default', ['start']);
};
