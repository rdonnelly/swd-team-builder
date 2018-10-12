module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
        jsx: true,
        modules: true,
    },
  },
  plugins: [
    'import',
    'react',
    'react-native',
  ],
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react-native/all',
    'plugin:react/recommended',
  ],
  rules: {
    'arrow-body-style' : 'warn',
    'class-methods-use-this': ['off'],
    'import/prefer-default-export': 'off',
    'no-param-reassign': ['error', { 'props': false }],
    'operator-linebreak': ['error', 'after'],
  },
  settings: {
    react: {
      version: '16.5.0',
    },
  },
};
