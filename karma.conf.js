module.exports = function (config) {
    'use strict';

    process.env.NODE_ENV = 'test';

    const paths = require('./frontend/index.json');

    const files = [
        ...paths.lib.js,
        'node_modules/angular-mocks/angular-mocks.js',
        {pattern: paths.specs, included: true},
    ];

    const rollupConfig = require('./rollup.config.js');
    let preprocessors = {};
    preprocessors[paths.specs] = ['rollup'];

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
        rollupPreprocessor: rollupConfig,
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
