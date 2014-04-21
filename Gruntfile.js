module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            main: [
                'Gruntfile.js',
                'airy/static/js/*.js'
            ],
            options: {
                multistr: true,
                globals: {
                    $: true
                }
            }
        },
        csslint: {
            main: {
                src: ['airy/static/css/*.css']
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
                        src: 'bower_components/magnific-popup/dist/jquery.magnific-popup.min.js',
                        dest: 'airy/static/lib/jquery.magnific-popup.min.js'
                    },
                    {
                        src: 'bower_components/magnific-popup/dist/magnific-popup.css',
                        dest: 'airy/static/lib/magnific-popup.css'
                    },
                    {
                        src: 'bower_components/jquery-autosize/jquery.autosize.min.js',
                        dest: 'airy/static/lib/jquery.autosize.min.js'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', []);
};
