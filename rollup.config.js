import typescript from '@rollup/plugin-typescript';

import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

import { terser } from 'rollup-plugin-terser';
import externalGlobals from "rollup-plugin-external-globals";

import { readFileSync } from 'fs';

import pkg from './package.json';

const header = readFileSync(`${__dirname}/dist/annotations.js`)
                + '\n'
                + readFileSync('header.js', 'utf-8');

export default [
	{
        input: 'src/index.ts',
        output: [
            {
                file: `${__dirname}/dist/js/plugins/${pkg.name}.js`,
                name: pkg.namespace,
                format: 'iife',
                sourcemap: false,
                plugins: [
                    terser({
                        format: {
                            comments: false,
                            preamble: header
                        }
                    })
                ]
            },
            {
                file: `${__dirname}/../${pkg.name}.js`,
                name: pkg.namespace,
                format: 'iife',
                sourcemap: false,
                plugins: [
                    terser({
                        format: {
                            comments: false,
                            preamble: header
                        }
                    })
                ]
            },
            {
                file: `${pkg.testProjectDir || `${__dirname}/dist`}/js/plugins/${pkg.name}.debug.js`,
                name: pkg.namespace,
                format: 'iife',
                sourcemap: true,
                banner: header
            }
        ],
        plugins: [
            typescript(),
            externalGlobals({
                "rmmz": "window"
            }),
            nodeResolve({
                browser: true
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            })
        ]
	}
];