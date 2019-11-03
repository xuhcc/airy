const terser = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
    input: 'frontend/app/app.module.js',
    output: {
        file: 'airy/static/js/app.min.js',
        format: 'iife',
        name: 'airy',
    },
    plugins: [
        commonjs({
            include: 'node_modules/**',
        }),
        typescript(),
        terser.terser({mangle: false}),
    ],
};
