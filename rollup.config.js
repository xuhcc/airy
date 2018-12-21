const babel = require('rollup-plugin-babel');

module.exports = {
    input: 'frontend/app/app.module.js',
    output: {
        file: 'airy/static/js/app.min.js',
        format: 'iife',
        name: 'airy',
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
    ],
};
