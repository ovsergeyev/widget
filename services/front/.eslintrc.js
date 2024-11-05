module.exports = {
  root: true,
  env: {
    node: true,
  },
  // extends: [
  //   '@vue/typescript/recommended',
  // ],
  extends: [
    // 'plugin:vue/vue3-essential',
    // '@vue/airbnb',
    // 'plugin:prettier/recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console':
      process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger':
      process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'max-len': [
      'error',
      {
        code: 80,
      },
    ],
  },
};
