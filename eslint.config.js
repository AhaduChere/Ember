import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginNode from 'eslint-plugin-node';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['src/backend/**/*.js', 'src/*.js', '*.js', '*.mjs'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        __dirname: 'readonly',
        process: 'readonly',
        MAIN_WINDOW_VITE_DEV_SERVER_URL: 'readonly',
        MAIN_WINDOW_VITE_NAME: 'readonly',
      },
    },
    plugins: { node: pluginNode },
    rules: {
      'node/no-unsupported-features/es-syntax': 'off',
      'no-console': 'warn',
      'no-undef': 'off',
    },
  },

  {
    files: ['src/pages/**/*.js', 'src/pages/**/*.vue', 'src/components/**/*.vue', 'src/**/*.vue', 'src/*.vue'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        console: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'warn',
      'no-console': 'warn',
      'vue/no-mutating-props': 'error',
      'vue/no-unused-components': 'warn',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },
]);
