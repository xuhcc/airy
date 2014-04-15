module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            main: [
                'Gruntfile.js',
                'airy/static/js/login.js'
            ],
            options: {
                globals: {
                    $: true
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        src: 'bower_components/jquery/dist/jquery.min.js',
                        dest: 'airy/static/lib/jquery.min.js'
                    },
                    {
                        src: 'bower_components/pure/base-min.css',
                        dest: 'airy/static/lib/pure-base-min.css'
                    },
                    {
                        src: 'bower_components/pure/forms-min.css',
                        dest: 'airy/static/lib/pure-forms-min.css'
                    },
                    {
                        src: 'bower_components/pure/buttons-min.css',
                        dest: 'airy/static/lib/pure-buttons-min.css'
                    },
                    {
                        src: 'bower_components/pure/menus-min.css',
                        dest: 'airy/static/lib/pure-menus-min.css'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', []);
};
