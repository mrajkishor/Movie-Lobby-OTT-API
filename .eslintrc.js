module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Allowing explicit return types
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignore unused variables starting with an underscore
        'no-debugger': 'error', // Disallow the use of debugger
        'no-warning-comments': ['warn', { terms: ['todo', 'fixme','// '], location: 'start' }], // Warn on specific comment terms
    },
};
