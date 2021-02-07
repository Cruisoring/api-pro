module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    'semi': ['error', 'always'],
    // 'quote': ['error', 'single'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": false,
    "@typescript-eslint/no-inferrable-types": [
      "warn", {
        "ignoreParameters": true
      }
    ],
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     endOfLine: 'auto',
    //   },
    // ],
  },
};
