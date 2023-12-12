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
        '@typescript-eslint/no-explicit-any': 'off', // Allowing the use of 'any'
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignore unused variables starting with an underscore
        'no-console': 'error', // Disallow the use of console.log
        'no-debugger': 'error', // Disallow the use of debugger
        'no-warning-comments': ['warn', { terms: ['todo', 'fixme', 'xxx'], location: 'start' }], // Warn on specific comment terms

        // Add more rules as needed based on your coding standards
    },
};
