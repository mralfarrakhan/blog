import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Global ignores
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      '.wrangler/**',
      '.playwright-mcp/**',
      'worker-configuration.d.ts',
    ],
  },

  // Base JS
  eslint.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Astro
  ...eslintPluginAstro.configs.recommended,

  // Svelte
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'no-import-assign': 'off',
      'svelte/prefer-svelte-reactivity': 'off',
    },
  },

  // Environment & global rule adjustments
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Prettier (must come last to disable conflicting rules)
  eslintConfigPrettier,
];
