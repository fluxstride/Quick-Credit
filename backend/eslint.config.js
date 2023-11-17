const FlatCompat = require('@eslint/eslintrc').FlatCompat;
const js = require('@eslint/js');

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/**
 * @type {import('eslint').Linter.Config}
 */
const eslintConfig = {
  extends: [
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    camelcase: 'error',
    eqeqeq: 'warn',
    'no-console': 'warn',
    '@typescript-eslint/no-confusing-void-expression': 'warn',
    'import/prefer-default-export': 'off',
  },
  root: true,
  ignorePatterns: ['eslint.config.js', 'dist/'],
};

module.exports = [...compat.config(eslintConfig)];
