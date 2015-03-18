module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            app: {
                js: [
                    'airy/src/js/app.js',
                    'airy/src/js/controllers.js',
                    'airy/src/js/directives.js',
                    'airy/src/js/filters.js',
                    'airy/src/js/services.js'
                ],
                css: [
                    'airy/src/css/common.css',
                    'airy/src/css/login.css',
                    'airy/src/css/clients.css',
                    'airy/src/css/projects.css',
                    'airy/src/css/tasks.css',
                    'airy/src/css/report.css'
                ],
                specs: [
                    'jasmine/*_spec.js'
                ]
            },
            lib: {
                js: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/momentjs/moment.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-route/angular-route.js',
                    'bower_components/angular-named-routes/build/lib/named-routes.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',
                    'bower_components/angular-linkify/angular-linkify.js',
                    'bower_components/ngDialog/js/ngDialog.js',
                    'bower_components/angular-hotkeys/build/hotkeys.js',
                    'bower_components/angular-elastic/elastic.js'
                ],
                css: [
                    'bower_components/pure/base.css',
                    'bower_components/pure/forms.css',
                    'bower_components/pure/buttons.css',
                    'bower_components/ngDialog/css/ngDialog.css'
                ]
            },
        },
        jshint: {
            main: [
                'Gruntfile.js',
                '<%= paths.app.js %>',
                '<%= paths.app.specs %>',
            ],
            options: {
                multistr: true,
                eqeqeq: true,
                strict: true,
                curly: true
            }
        },
        csslint: {
            main: {
                src: '<%= paths.app.css %>'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            airy: {
                files: {
                    'airy/src/build/airy.min.js': '<%= paths.app.js %>'
                }
            },
            libs: {
                files: {
                    'airy/src/build/libs.min.js': '<%= paths.lib.js %>'
                }
            }
        },
        cssmin: {
            airy: {
                files: {
                    'airy/src/build/airy.min.css': '<%= paths.app.css %>'
                }
            },
            libs: {
                files: {
                    'airy/src/build/libs.min.css': '<%= paths.lib.css %>'
                }
            }
        },
        concat: {
            js: {
                src: ['airy/src/build/libs.min.js', 'airy/src/build/airy.min.js'],
                dest: 'airy/static/js/scripts.min.js'
            },
            css: {
                src: ['airy/src/build/libs.min.css', 'airy/src/build/airy.min.css'],
                dest: 'airy/static/css/styles.min.css'
            }
        },
        watch: {
            js: {
                files: '<%= paths.app.js %>',
                tasks: ['uglify:airy', 'concat:js']
            },
            css: {
                files: '<%= paths.app.css %>',
                tasks: ['cssmin:airy', 'concat:css']
            }
        },
        jasmine: {
            main: {
                src: '<%= paths.app.js %>',
                options: {
                    specs: '<%= paths.app.specs %>',
                    vendor: [
                        'airy/src/build/libs.min.js',
                        'bower_components/angular-mocks/angular-mocks.js'
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask('default', []);
    grunt.registerTask('build', 'Build task', function () {
        grunt.task.run([
            'uglify',
            'cssmin',
            'concat'
        ]);
    });
};
