// import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["./src/**/*.ts", "./**/*.ts"], // Applique cette configuration à tous les fichiers TS
    languageOptions: {
      parser: "@typescript-eslint/parser",
      ecmaVersion: 12, // Correspond à ES2021
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript.configs.recommended,
    },
    rules: {
      semi: ["warn", "always"],  // Erreur si point-virgule manquant
    },
  },
  pluginJs.configs.recommended // Étend la configuration recommandée de ESLint pour JS
];

