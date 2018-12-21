module.exports = function (config) {
    'use strict';

    process.env.NODE_ENV = 'test';

    const paths = require('./frontend/index.json');

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            ...paths.lib.js,
            'node_modules/angular-mocks/angular-mocks.js',
            paths.app.specs,
        ],
        exclude: [],
        preprocessors: {
            [paths.app.specs]: ['rollup'],
        },
        rollupPreprocessor: require('./rollup.config.js'),
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
