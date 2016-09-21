module.exports = function (config) {
    'use strict';

    process.env.NODE_ENV = 'test';

    let paths = require('./airy/frontend/index.json');

    let files = [
        ...paths.lib.js,
        'bower_components/angular-mocks/angular-mocks.js',
        'airy/frontend/system-test.conf.js',
        {pattern: paths.app.es, included: false},
        {pattern: paths.specs, included: false},
    ];

    let preprocessors = {};
    preprocessors[paths.app.es] = ['babel'];
    preprocessors[paths.specs] = ['babel'];

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: files,
        exclude: [],
        preprocessors: preprocessors,
        babelPreprocessor: {
            options: {
                sourceMap: 'inline',
            },
        },
        reporters: ['mocha', 'coverage'],
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
