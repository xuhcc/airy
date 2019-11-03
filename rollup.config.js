const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const resolve = require('rollup-plugin-node-resolve');
const terser = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript2');

module.exports = {
    input: 'frontend/app/app.module.js',
    output: {
        file: 'airy/static/js/app.min.js',
        format: 'iife',
        name: 'airy',
    },
    plugins: [
        json(), // Needed for moment-timezone
        resolve(), // Needed for moment.js
        commonjs({
            include: 'node_modules/**',
        }),
        typescript(),
        terser.terser({mangle: false}),
    ],
};
