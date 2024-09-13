const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');

const pkg = require('./package.json');

module.exports = {
  external: ['memoizee'],
  input: 'src/index.ts',
  output: [
    {
      file: pkg.umd,
      format: 'umd',
      name: 'DebugFabulous',
      globals: {
        memoizee: 'memoizee',
      },
    },
    {
      file: pkg.main,
      format: 'commonjs',
      name: 'DebugFabulous',
      globals: {
        memoizee: 'memoizee',
      },
    },
  ],
  plugins: [commonjs(), typescript()],
};
