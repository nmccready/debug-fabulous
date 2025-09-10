import globals from "globals";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import jestPlugin from "eslint-plugin-jest";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  // TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx", "*.ts", "*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...jestPlugin.environments.globals.globals,
      },
    },
    plugins: {
      js,
      jest: jestPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "no-unused-vars": "warn",
      "comma-dangle": ["error", "always-multiline"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
    },
    ignores: [
      'node_modules',
      'node_modules/**/*.js',
      'dist',
      'lib',
      'tmp',
    ]
  },
  // JavaScript files
  {
    files: ["**/*.js", "**/*.jsx", "*.js", "*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...jestPlugin.environments.globals.globals,
      },
    },
    plugins: {
      js,
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      "no-unused-vars": "warn",
      "comma-dangle": ["error", "always-multiline"],
      "jest/no-done-callback": "off",
      "jest/no-identical-title": "off",
    },
    ignores: [
      'node_modules',
      'node_modules/**/*.js',
      'dist',
      'lib',
      'tmp',
    ]
  },
]);
