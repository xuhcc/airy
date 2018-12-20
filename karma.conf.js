module.exports = function (config) {
    'use strict';

    process.env.NODE_ENV = 'test';

    const paths = require('./frontend/index.json');

    const files = [
        ...paths.lib.js,
        'node_modules/angular-mocks/angular-mocks.js',
        'frontend/system-test.conf.js',
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
        browsers: ['jsdom'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        concurrency: Infinity,
    });
};
