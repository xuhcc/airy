var paths = require('./airy/frontend/index.json');

module.exports = function (config) {
    'use strict';

    var files = [].concat(
        paths.lib.js,
        ['bower_components/angular-mocks/angular-mocks.js'],
        paths.app.js,
        [paths.specs]);

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: files,
        exclude: [],
        preprocessors: {
            'airy/frontend/app/**/!(*spec).js': ['coverage'],
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
