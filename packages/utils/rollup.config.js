import typescript from '@rollup/plugin-typescript';

export default [{
  input: './src/index.ts',
  output: {
    file: 'dist/util.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [typescript({
    tsconfig: '../../tsconfig.json',
  })],
}];
