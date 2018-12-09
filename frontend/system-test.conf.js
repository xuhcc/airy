/* global __karma__,System */

__karma__.loaded = function () {};

System.config({
    baseURL: 'base/frontend/app/',
    meta: {
        '*.js': {format: 'register'},
    },
});

Promise
    .all(
        Object.keys(window.__karma__.files)
            .filter(onlyAppFiles)
            .map(function (moduleName) {
                return System.import(moduleName);
            }))
    .then(function () {
        __karma__.start();
    }, function (error) {
        __karma__.error(error.stack || error);
    });

function onlyAppFiles(filePath) {
    return /^\/base\/frontend\/app\/.*\.js$/.test(filePath);
}
