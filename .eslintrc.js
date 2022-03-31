module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {
      packageDir: ['./', './packages/yz-ui'],
      devDependencies: ['./packages/**/*.config.ts', './packages/**/*.config.js'],
    }],
    '@typescript-eslint/no-unsafe-call': 'off',
    'import/extensions': ['error',
      'ignorePackages',
      { vue: 'always' },
    ],
  },
};
