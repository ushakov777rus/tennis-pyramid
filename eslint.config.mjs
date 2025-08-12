// eslint.config.js
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

export default [
  // Игнор папок сборки
  { ignores: ["node_modules/**", ".next/**", "dist/**"] },

  // Базовые рекомендации ESLint v9
  js.configs.recommended,

  // Общие настройки для JS/TS/JSX/TSX
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      // Дадим все нужные глобалы: браузерные, нодовые и воркеровские
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.worker,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    rules: {
      // Рекомендованные правила хуков
      ...reactHooks.configs.recommended.rules,
      // Эквивалент next/core-web-vitals
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Твои кастомные
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Специально для TS — отключаем no-undef (во избежание ложных срабатываний по типам)
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
    },
  },

  // Для конфигов/скриптов (если есть .cjs/.mjs/.js в корне)
  {
    files: ["**/*.{cjs,mjs,js}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];