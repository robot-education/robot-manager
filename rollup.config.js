import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/web/js/index.js',
    output: {
        file: 'dist/main.js',
        format: 'iife'
    },
    plugins: [
        commonjs(),
        resolve()
    ]
};
