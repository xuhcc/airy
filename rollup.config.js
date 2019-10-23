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
        typescript(),
        terser.terser({mangle: false}),
    ],
};
