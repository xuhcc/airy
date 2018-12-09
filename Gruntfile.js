const sass = require('node-sass');

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: grunt.file.readJSON('frontend/index.json'),
        jsonlint: {
            main: {
                src: [
                    'package.json',
                    '.jshintrc',
                    '.jscsrc',
                    '.csslintrc',
                    '.htmlhintrc',
                    '.babelrc',
                    'frontend/index.json',
                ],
            },
        },
        jshint: {
            main: [
                'Gruntfile.js',
                'karma.conf.js',
                'frontend/system-test.conf.js',
                '<%= paths.app.es %>',
                '<%= paths.specs %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },
        jscs: {
            main: '<%= jshint.main %>',
            options: {
                config: '.jscsrc',
            },
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
            },
            phantomjs: {
                browsers: ['PhantomJS'],
            },
            jsdom: {
                browsers: ['jsdom'],
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
                csslintrc: '.csslintrc',
            },
            main: {
                src: '<%= paths.app.css %>',
            },
        },
        htmlhint: {
            partials: {
                options: {
                    htmlhintrc: '.htmlhintrc',
                },
                src: '<%= paths.app.partials %>',
            },
        },
        copy: {
            appJs: {
                cwd: 'frontend/js/',
                src: '**/*',
                dest: 'airy/static/js/',
                expand: true,
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
                cwd: 'frontend',
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
                implementation: sass,
                indentWidth: 4,
                outputStyle: 'expanded',
                sourceMap: true,
            },
            main: {
                src: '<%= paths.app.scss %>',
                dest: 'frontend/css/',
                expand: true,
                flatten: true,
                ext: '.css',
            },
        },
        babel: {
            options: {
                sourceMap: true,
            },
            main: {
                files: [
                    {
                        cwd: 'frontend/app/',
                        src: '**/!(*spec).js',
                        dest: 'frontend/js/',
                        expand: true,
                    },
                ],
            },
        },
        systemjs: {
            options: {
                sfx: false,
                baseURL: 'frontend/js/',
                minify: true,
                build: {
                    mangle: false,
                },
            },
            main: {
                files: [
                    {
                        src: 'app.module.js',
                        dest: 'airy/static/js/',
                        expand: true,
                        nonull: true,
                    },
                ],
            },
        },
        uglify: {
            options: {
                mangle: false,
            },
            production: {
                src: [
                    '<%= paths.lib.js %>',
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
        clean: {
            static: ['airy/static'],
            js: ['frontend/js'],
            css: ['frontend/css'],
        },
        watch: {
            appCss: {
                files: ['<%= paths.app.scss %>'],
                tasks: ['sass', 'copy:appCss'],
            },
            appJs: {
                files: ['<%= paths.app.es %>'],
                tasks: ['babel', 'copy:appJs'],
            },
            appPartials: {
                files: ['<%= paths.app.partials %>'],
                tasks: ['copy:appPartials'],
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
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-systemjs-builder');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', []);
    grunt.registerTask('build:development', function () {
        grunt.task.run([
            'clean',
            'babel',
            'sass',
            'copy',
        ]);
    });
    grunt.registerTask('build:production', function () {
        grunt.task.run([
            'clean',
            'sass',
            'cssmin:production',
            'babel',
            'uglify:production',
            'systemjs',
            'copy:appFonts',
            'copy:appPartials',
            'copy:appMisc',
        ]);
    });
    grunt.registerTask('check:js', function () {
        grunt.task.run([
            'jsonlint',
            'jshint',
            'jscs',
            'karma:jsdom',
        ]);
    });
    grunt.registerTask('check:css', function () {
        grunt.task.run([
            'sasslint',
            'sass',
            'csslint',
        ]);
    });
    grunt.registerTask('check:html', function () {
        grunt.task.run([
            'htmlhint',
        ]);
    });
};
