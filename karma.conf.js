var paths = require('./airy/frontend/index.json');

module.exports = function (config) {
    'use strict';

    var files = [].concat(
        paths.lib.js,
        [
            'bower_components/angular-mocks/angular-mocks.js',
            'airy/frontend/system-test.conf.js',
        ]);
    paths.app.es.forEach(function (path) {
        files.push({
            pattern: path,
            included: false,
        });
    });
    files.push({
        pattern: paths.specs,
        included: false,
    });

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: files,
        exclude: [],
        preprocessors: {
            'airy/frontend/app/**/!(*spec).js': ['babel', 'coverage'],
            'airy/frontend/app/**/*.spec.js': ['babel'],
        },
        babelPreprocessor: {
            options: {
                sourceMap: 'inline',
            },
        },
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            type: 'text-summary',
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        concurrency: Infinity,
    });
};
