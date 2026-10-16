import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const routeImports = ['@/app', '@/app/**', '**/app/**'];
const featureImports = ['@/features', '@/features/**', '**/features/**'];

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: routeImports,
              message:
                'Routes compose features; features must not import routes.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/{components,lib,hooks,types}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [...routeImports, ...featureImports],
              message:
                'Shared code must not depend on routes or business features.',
            },
          ],
        },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', '**/*.tsbuildinfo']),
]);
