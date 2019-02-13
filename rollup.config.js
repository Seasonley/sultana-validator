import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import {
  author, description, license, name, version, homepage,
} from './package.json'

export default {
  input: 'src/index.js',
  output: {
    file: 'sultana-validator.js',
    format: 'umd',
    name: 'sultana-validator',
    banner: `/*${name} v${version}
${description}
${license} License Copyright (c) 2018 ${author}
${homepage}*/`,
  },
  plugins: [
    json(),
    babel({
      plugins: ['@babel/plugin-external-helpers'],
      externalHelpers: true,
      exclude: 'node_modules/**',
    }),
  ],
}
