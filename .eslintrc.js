module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-recommended', // Use Vue 3 recommendations
        'eslint:recommended',
    ],
    parser: '@babel/eslint-parser', // Use Babel parser
    parserOptions: {
        requireConfigFile: false, // Allows Babel parser to work without a separate Babel config file
        ecmaVersion: 2020,       // Support modern JavaScript
        sourceType: 'module',
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-undef': 'off', // Disable undefined errors for `static` fields
    },
};
