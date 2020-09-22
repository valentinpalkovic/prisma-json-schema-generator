module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
      'plugin:jest/recommended',
      "plugin:eslint-comments/recommended"
    ],
    parserOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
    },
    ignorePatterns: [],
    root: true,
    env: {
      node: true,
    },
    rules: {},
    overrides: []
  };
  