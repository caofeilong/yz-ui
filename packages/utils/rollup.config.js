import typescript from '@rollup/plugin-typescript';

export default [{
  input: './index.ts',
  output: {
    file: 'dist/util.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [typescript()],
}];
