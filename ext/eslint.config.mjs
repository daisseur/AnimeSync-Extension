import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"], // Applique cette configuration à tous les fichiers JS
    languageOptions: {
      ecmaVersion: 12, // Correspond à ES2021
      sourceType: "module",
      globals: {
        ...globals.browser, // Inclut les variables globales du navigateur
        ...globals.webextensions,
        ...globals.serviceworker,
      }
    },
    rules: {
      semi: ["warn", "always"],  // Erreur si point-virgule manquant
    }
  },
  pluginJs.configs.recommended // Étend la configuration recommandée de ESLint pour JS
];
