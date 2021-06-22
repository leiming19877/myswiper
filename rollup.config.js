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
//import bable from '@rollup/plugin-babel';
// 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import replace from 'rollup-plugin-replace';
import pk from './package.json';

const env = process.env.NODE_ENV;

const config = {
    input: 'src/main.js',
    output: {
        name:'myswiper',
        file: 'dist/myswiper-'+pk.version+'.js',
        format: 'umd',
        sourcemap:true  //生成bundle.map.js文件，方便调试
    },
    plugins: [
        resolve(),
      /*  babel({
            exclude: '**!/node_modules/!**'
        }),*/
        replace({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        commonjs(),
        json()
    ]
};
console.log("env:"+env);
if(env === 'production'){
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