// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple']
        }
      ],
      'sort-keys': 'error'
    }
  }
]);
