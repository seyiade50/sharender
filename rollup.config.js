import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
export default [
    {
        input: 'src/render.js',
        file: 'dist/es.js',
        format: 'es'
    },
    {
        input: 'src/render.js',
        file: 'dist/cjs.js',
        format: 'cjs'
    },
    {
        input: 'src/render.js',
        file: 'dist/iife.js',
        format: 'iife',
        name: 'sharender'
    }
].map(conf => {
    return {
        input: conf.input,
        output: {
            file: conf.file,
            format: conf.format,
            name: conf.name,
            plugins: [terser()]
        },
        plugins: [
            resolve(),
        ]
    };
})
