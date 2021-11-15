module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: "module"
  },
  plugins: [
    'prettier',
    '@typescript-eslint'
  ],
  extends: [
    "eslint:recommended",
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint'
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        'semi': false,
        'trailingComma': "all"
      }
    ]
  },
}