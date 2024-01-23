module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: [
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    env: {
        node: true,
        jest: true,
    },
    rules: {
    }
}
