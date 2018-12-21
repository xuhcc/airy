const path = require('path');
const sass = require('node-sass');
const rollup = require('rollup');
const rollupConfig = require('./rollup.config.js');

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: grunt.file.readJSON('frontend/index.json'),
        eslint: {
            main: [
                'Gruntfile.js',
                'rollup.config.js',
                'karma.conf.js',
                '<%= paths.app.js %>',
                '<%= paths.app.specs %>',
            ],
        },
        karma: {
            main: {
                configFile: 'karma.conf.js',
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
            appIndex: {
                src: '<%= paths.app.index %>',
                dest: 'airy/static/',
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
        uglify: {
            options: {
                mangle: false,
            },
            main: {
                src: [
                    '<%= paths.lib.js %>',
                ],
                dest: 'airy/static/js/vendor.min.js',
                nonull: true,
            },
        },
        cssmin: {
            main: {
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
                tasks: ['sass', 'cssmin'],
            },
            appJs: {
                files: ['<%= paths.app.js %>'],
                tasks: ['rollup'],
            },
            appPartials: {
                files: ['<%= paths.app.partials %>'],
                tasks: ['copy:appPartials'],
            },
            appIndex: {
                files: ['<%= paths.app.index %>'],
                tasks: ['copy:appIndex'],
            },
        },
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('rollup', 'Create app bundle.', function () {
        const done = this.async();
        return rollup.rollup(rollupConfig)
            .then(bundle => {
                return bundle.generate(rollupConfig.output);
            })
            .then(result => {
                grunt.file.write('airy/static/js/app.min.js', result.code);
                done();
            });
    });

    grunt.registerTask('default', []);
    grunt.registerTask('build', function () {
        grunt.task.run([
            'clean',
            'sass',
            'cssmin',
            'rollup',
            'uglify',
            'copy',
        ]);
    });
    grunt.registerTask('check:js', function () {
        grunt.task.run([
            'eslint',
            'karma',
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
