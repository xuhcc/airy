module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            main: [
                'Gruntfile.js',
                'airy/src/js/*.js'
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
                src: ['airy/src/css/*.css']
            }
        },
        concat: {
            css: {
                src: [
                    'bower_components/pure/base.css',
                    'bower_components/pure/forms.css',
                    'bower_components/pure/buttons.css',
                    'bower_components/ngDialog/css/ngDialog.css',
                    'airy/src/css/common.css',
                    'airy/src/css/login.css',
                    'airy/src/css/clients.css',
                    'airy/src/css/projects.css',
                    'airy/src/css/tasks.css',
                    'airy/src/css/report.css'
                ],
                dest: 'airy/src/build/styles.css'
            },
            js: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-route/angular-route.js',
                    'bower_components/angular-named-routes/build/lib/named-routes.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',
                    'bower_components/angular-linkify/angular-linkify.js',
                    'bower_components/ngDialog/js/ngDialog.js',
                    'bower_components/angular-hotkeys/build/hotkeys.js',
                    'bower_components/angular-elastic/elastic.js',
                    'bower_components/momentjs/moment.js',
                    'airy/src/js/app.js',
                    'airy/src/js/controllers.js',
                    'airy/src/js/directives.js',
                    'airy/src/js/filters.js',
                    'airy/src/js/services.js'
                ],
                dest: 'airy/src/build/scripts.js',
                options: {
                    separator: ';'
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            main: {
                files: {
                    'airy/static/js/scripts.min.js': ['airy/src/build/scripts.js']
                }
            }
        },
        cssmin: {
            main: {
                files: {
                    'airy/static/css/styles.min.css': ['airy/src/build/styles.css']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', []);
};
