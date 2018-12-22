const babel = require('rollup-plugin-babel');
const istanbul = require('rollup-plugin-istanbul');
const paths = require('./frontend/index.json');

module.exports = function (config) {
    'use strict';

    process.env.NODE_ENV = 'test';

    const rollupConfig = {
        output: {
            format: 'iife',
        },
        plugins: [
            istanbul({exclude: [paths.app.specs]}),
            babel(),
        ],
    };

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
