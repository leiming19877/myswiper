/*
 * Copyright (c) 2021.
 * leiming.
 *
 */
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
// 将非ES6语法的包转为ES6可用
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import {uglify} from 'rollup-plugin-uglify'
// rollup 的 babel 插件，ES6转ES5
//import babel from 'rollup-plugin-babel';
import { babel }  from '@rollup/plugin-babel';
// 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import replace from 'rollup-plugin-replace';
import pk from './package.json';

const env = process.env.NODE_ENV;
const banner =
    '/*!\n' +
    ` * Vue.js v${pk.version}\n` +
    ` * (c) 2021-${new Date().getFullYear()} leiming\n` +
    ' * Released under the MIT License.\n' +
    ' */';
const builds = {
    // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
    'dev': {
        name:'myswiper',
        file: 'dist/myswiper-'+pk.version+'.js',
        format: 'umd',
        sourcemap:true,  //生成bundle.map.js文件，方便调试
        env: 'development',
        banner:banner
    },
    'prod': {
        name:'myswiper',
        file: 'dist/myswiper-'+pk.version+'.min.js',
        format: 'umd',
        sourcemap:true,  //生成bundle.map.js文件，方便调试
        env: 'production',
        banner:banner
    }
};
const config = {
    input: 'src/main.js',
    output: {
        banner:banner,
        name:'myswiper',
        file: 'dist/myswiper-'+pk.version+'.js',
        format: 'umd',
        sourcemap:true  //生成bundle.map.js文件，方便调试
    },
    onwarn: (msg, warn) => {
        if (!/Circular/.test(msg)) {
            warn(msg)
        }
    },
    plugins: [
        resolve(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        commonjs(),
        babel({
            babelHelpers:'external',
            exclude: 'node_modules/**'  // 排除node_module下的所有文件
        }),
        json()
    ]
};
console.log("env:"+env);
if(env === 'production'){
    config.output = builds.prod;
    config.plugins.push(
        uglify({
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true
            }
        })
    )
}
export default config;