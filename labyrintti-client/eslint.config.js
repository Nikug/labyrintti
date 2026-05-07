import js from "@eslint/js";
import solid from "eslint-plugin-solid/configs/recommended";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended, // replaces eslint:recommended
  tseslint.configs.recommended,
  solid,
  eslintConfigPrettier,
]);
