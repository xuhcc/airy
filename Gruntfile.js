module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            app: {
                js: 'airy/assets/js/*.js',
                css: 'airy/assets/css/*.css',
                partials: 'airy/assets/partials/*.html'
            },
            lib: grunt.file.readJSON('airy/assets/libs.json'),
            specs: 'tests/jasmine/test_*.js'
        },
        jshint: {
            main: [
                'Gruntfile.js',
                '<%= paths.app.js %>',
                '<%= paths.specs %>'
            ],
            options: {
                multistr: true,
                eqeqeq: true,
                strict: true,
                curly: true
            }
        },
        jscs: {
            main: '<%= jshint.main %>',
            options: {
                preset: 'yandex',
                disallowMultipleLineStrings: null,
                disallowQuotedKeysInObjects: null
            }
        },
        csslint: {
            options: {
                'adjoining-classes': false,
                'ids': false,
            },
            main: {
                src: '<%= paths.app.css %>'
            }
        },
        htmlhint: {
            partials: {
                options: {
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'attr-no-duplication': true,
                    'tag-pair': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'src-not-empty': true,
                    'doctype-html5': true,
                    'space-tab-mixed-disabled': true,
                    'id-class-ad-disabled': true,
                    'attr-unsafe-chars': true
                },
                src: '<%= paths.app.partials %>'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            production: {
                src: [
                    '<%= paths.lib.js %>',
                    '<%= paths.app.js %>'
                ],
                dest: 'airy/static/js/scripts.min.js',
                nonull: true
            }
        },
        cssmin: {
            production: {
                src: [
                    '<%= paths.lib.css %>',
                    '<%= paths.app.css %>'
                ],
                dest: 'airy/static/css/styles.min.css',
                nonull: true
            }
        },
        copy: {
            production: {
                expand: true,
                cwd: 'airy/assets',
                src: [
                    'fonts/*',
                    'partials/*',
                    'favicon.ico',
                ],
                dest: 'airy/static/',
                filter: 'isFile'
            },
            dev_lib_js: {
                src: '<%= paths.lib.js %>',
                dest: 'airy/assets/lib/js/',
                expand: true,
                flatten: true,
                filter: 'isFile',
                nonull: true
            },
            dev_lib_css: {
                src: '<%= paths.lib.css %>',
                dest: 'airy/assets/lib/css/',
                expand: true,
                flatten: true,
                filter: 'isFile',
                nonull: true
            },
        },
        jasmine: {
            main: {
                src: '<%= paths.app.js %>',
                options: {
                    specs: '<%= paths.specs %>',
                    vendor: [
                        '<%= paths.lib.js %>',
                        'bower_components/angular-mocks/angular-mocks.js'
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask('default', []);
    grunt.registerTask('build:development', function () {
        grunt.task.run([
            'copy:dev_lib_js',
            'copy:dev_lib_css'
        ]);
    });
    grunt.registerTask('build:production', function () {
        grunt.task.run([
            'copy:production',
            'uglify:production',
            'cssmin:production'
        ]);
    });
};
