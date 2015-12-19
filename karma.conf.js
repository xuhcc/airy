module.exports = function (config) {
    'use strict';

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [],
        exclude: [],
        preprocessors: {},
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            type: 'text-summary',
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
        concurrency: Infinity,
    });
};
