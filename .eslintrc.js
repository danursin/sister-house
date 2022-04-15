module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["react-app", "eslint:recommended", "plugin:prettier/recommended"],
    rules: {
        "sort-imports": "error"
    },
    globals: {
        google: "readonly"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
