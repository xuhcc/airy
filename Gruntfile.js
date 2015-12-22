module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: grunt.file.readJSON('airy/frontend/index.json'),
        jsonlint: {
            main: {
                src: [
                    'package.json',
                    'bower.json',
                    '.jshintrc',
                    '.jscsrc',
                    '.csslintrc',
                    '.htmlhintrc',
                    '.babelrc',
                    'airy/frontend/index.json',
                ],
            },
        },
        jshint: {
            main: [
                'Gruntfile.js',
                'karma.conf.js',
                'airy/frontend/system-test.conf.js',
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
            chrome: {
                browsers: ['Chrome'],
                singleRun: false,
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
                cwd: 'airy/frontend/js/',
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
                cwd: 'airy/frontend',
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
                dest: 'airy/frontend/css/',
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
                        cwd: 'airy/frontend/app/',
                        src: '**/!(*spec).js',
                        dest: 'airy/frontend/js/',
                        expand: true,
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
    grunt.registerTask('default', []);
    grunt.registerTask('build:development', function () {
        grunt.task.run([
            'babel',
            'sass',
            'copy',
        ]);
    });
    grunt.registerTask('build:production', function () {
        grunt.task.run([
            'sass',
            'babel',
            'cssmin:production',
            'uglify:production',
            'copy:appFonts',
            'copy:appPartials',
            'copy:appMisc',
        ]);
    });
};
