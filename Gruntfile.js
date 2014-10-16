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
                        src: 'bower_components/momentjs/min/moment.min.js',
                        dest: 'airy/static/lib/moment.min.js'
                    },
                    {
                        src: 'bower_components/angular/angular.min.js',
                        dest: 'airy/static/lib/angular.min.js'
                    },
                    {
                        src: 'bower_components/angular-route/angular-route.min.js',
                        dest: 'airy/static/lib/angular-route.min.js'
                    },
                    {
                        src: 'bower_components/angular-named-routes/build/lib/named-routes.js',
                        dest: 'airy/static/lib/angular-named-routes.js'
                    },
                    {
                        src: 'bower_components/angular-sanitize/angular-sanitize.min.js',
                        dest: 'airy/static/lib/angular-sanitize.min.js'
                    },
                    {
                        src: 'bower_components/angular-linkify/angular-linkify.min.js',
                        dest: 'airy/static/lib/angular-linkify.min.js'
                    },
                    {
                        src: 'bower_components/ngDialog/js/ngDialog.min.js',
                        dest: 'airy/static/lib/ngdialog.min.js'
                    },
                    {
                        src: 'bower_components/ngDialog/css/ngDialog.min.css',
                        dest: 'airy/static/lib/ngdialog.min.css'
                    },
                    {
                        src: 'bower_components/angular-hotkeys/build/hotkeys.min.js',
                        dest: 'airy/static/lib/angular-hotkeys.min.js'
                    },
                    {
                        src: 'bower_components/angular-elastic/elastic.js',
                        dest: 'airy/static/lib/angular-elastic.js'
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
