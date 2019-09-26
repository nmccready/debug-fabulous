import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';

// @ts-ignore
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.umd,
      format: 'umd',
      sourceMap: true,
      name: 'DebugFabulous',
    },
    {
      file: pkg.module,
      format: 'esm',
      sourceMap: true,
    },
  ],
  plugins: [commonjs(), typescript()],
};
