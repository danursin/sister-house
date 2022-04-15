module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["react-app", "eslint:recommended", "plugin:prettier/recommended"],
    rules: {
        "sort-imports": "error"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
