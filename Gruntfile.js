module.exports = function (grunt) {
    'use strict';

    var istanbulTemplate;
    try {
        istanbulTemplate = require('grunt-template-jasmine-istanbul');
    } catch (error) {
        grunt.log.error(error);
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: grunt.file.readJSON('airy/assets/index.json'),
        jsonlint: {
            main: {
                src: [
                    'package.json',
                    'bower.json',
                    'airy/assets/index.json',
                ],
            },
        },
        jshint: {
            main: [
                'Gruntfile.js',
                '<%= paths.app.js %>',
                '<%= paths.specs %>',
            ],
            options: {
                multistr: true,
                eqeqeq: true,
                strict: true,
                curly: true,
            },
        },
        jscs: {
            main: '<%= jshint.main %>',
            options: {
                preset: 'yandex',
                disallowMultipleLineStrings: null,
                disallowQuotedKeysInObjects: null,
                requireTrailingComma: {
                    ignoreSingleLine: true,
                },
            },
        },
        sasslint: {
            options: {
                configFile: '.sass-lint.yml',
            },
            target: ['<%= paths.app.scss %>'],
        },
        csslint: {
            options: {
                'adjoining-classes': false,
                'ids': false,
                'important': false,
            },
            main: {
                src: '<%= paths.app.css %>',
            },
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
                    'attr-unsafe-chars': true,
                },
                src: '<%= paths.app.partials %>',
            },
        },
        uglify: {
            options: {
                mangle: false,
            },
            production: {
                src: [
                    '<%= paths.lib.js %>',
                    '<%= paths.app.js %>',
                ],
                dest: 'airy/static/js/scripts.min.js',
                nonull: true,
            },
        },
        cssmin: {
            production: {
                src: [
                    '<%= paths.lib.css %>',
                    '<%= paths.app.css %>',
                ],
                dest: 'airy/static/css/styles.min.css',
                nonull: true,
            },
        },
        copy: {
            appJs: {
                src: '<%= paths.app.js %>',
                dest: 'airy/static/js/',
                expand: true,
                flatten: true,
                filter: 'isFile',
            },
            appCss: {
                src: [
                    '<%= paths.app.css %>',
                    '<%= paths.app.cssmaps %>',
                ],
                dest: 'airy/static/css/',
                expand: true,
                flatten: true,
                filter: 'isFile',
            },
            appFonts: {
                src: '<%= paths.app.fonts %>',
                dest: 'airy/static/fonts/',
                expand: true,
                flatten: true,
                filter: 'isFile',
            },
            appPartials: {
                src: '<%= paths.app.partials %>',
                dest: 'airy/static/partials/',
                expand: true,
                flatten: true,
                filter: 'isFile',
            },
            appMisc: {
                expand: true,
                cwd: 'airy/assets',
                src: [
                    'favicon.ico',
                ],
                dest: 'airy/static/',
                filter: 'isFile',
            },
            libJs: {
                src: '<%= paths.lib.js %>',
                dest: 'airy/static/js/lib/',
                expand: true,
                flatten: true,
                filter: 'isFile',
                nonull: true,
            },
            libCss: {
                src: '<%= paths.lib.css %>',
                dest: 'airy/static/css/lib/',
                expand: true,
                flatten: true,
                filter: 'isFile',
                nonull: true,
            },
        },
        sass: {
            options: {
                indentWidth: 4,
                outputStyle: 'expanded',
                sourceMap: true,
            },
            main: {
                src: '<%= paths.app.scss %>',
                dest: 'airy/assets/css/',
                expand: true,
                flatten: true,
                ext: '.css',
            },
        },
        jasmine: {
            main: {
                src: '<%= paths.app.js %>',
                options: {
                    specs: '<%= paths.specs %>',
                    vendor: [
                        '<%= paths.lib.js %>',
                        'bower_components/angular-mocks/angular-mocks.js',
                    ],
                    template: istanbulTemplate,
                    templateOptions: {
                        coverage: '.jasmine.coverage',
                        report: {
                            type: 'text',
                        },
                    },
                },
            },
        },
        watch: {
            appCss: {
                files: ['<%= paths.app.scss %>'],
                tasks: ['sass', 'copy:appCss'],
            },
            appJs: {
                files: ['<%= paths.app.js %>'],
                tasks: ['copy:appJs'],
            },
        },
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
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.registerTask('default', []);
    grunt.registerTask('build:development', function () {
        grunt.task.run([
            'sass',
            'copy',
        ]);
    });
    grunt.registerTask('build:production', function () {
        grunt.task.run([
            'sass',
            'cssmin:production',
            'uglify:production',
            'copy:appFonts',
            'copy:appPartials',
            'copy:appMisc',
        ]);
    });
};
