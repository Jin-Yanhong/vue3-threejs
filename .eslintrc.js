module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:vue/essential', 'google'],
    parserOptions: {
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint'],
    ignorePatterns: ['**/assets/*'],
    rules: {
        'indent': ['warn', 4],
        'quotes': ['warn', 'single'],
        'semi': ['warn', 'always'],
        'max-len': ['warn', { code: 360 }],
        'linebreak-style': ['warn', 'windows'],
        'object-curly-spacing': ['warn', 'always'],
        'space-before-function-paren': ['warn', 'always'],
        'require-jsdoc': 0,
        'valid-jsdoc': 0,
    },
};
