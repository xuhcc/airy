const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const typescript = require('rollup-plugin-typescript2');

module.exports = {
    input: 'frontend/app/app.module.js',
    output: {
        file: 'airy/static/js/app.min.js',
        format: 'iife',
        name: 'airy',
    },
    plugins: [
        typescript({
            // No the same as 'include' in tsconfig.json
            include: ['*.js', '**/*.js'],
        }),
        uglify.uglify({
            mangle: false,
        }),
    ],
};
