module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['plugin:vue/essential', 'google'],
    parserOptions: {
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    plugins: ['vue', '@typescript-eslint'],
    ignorePatterns: ['**/assets/*'],
    rules: {
        'semi': ['warn', 'always'],
        'quotes': ['warn', 'single'],
        'comma-dangle': ['warn', 'never'],
        'max-len': ['warn', { code: 360 }],
        'linebreak-style': ['warn', 'windows'],
        'object-curly-spacing': ['warn', 'always'],
        'arrow-parens': ['warn', 'as-needed'],
        'space-before-function-paren': 0,
        'require-jsdoc': 0,
        'valid-jsdoc': 0,
        'indent': 0
    }
};
