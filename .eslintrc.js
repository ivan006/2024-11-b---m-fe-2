module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'plugin:vue/vue3-recommended', // Vue 3-specific rules
        'eslint:recommended',
    ],
    parser: 'vue-eslint-parser', // Ensure the correct parser is set
    parserOptions: {
        parser: '@babel/eslint-parser', // Use Babel parser for `<script>` section
        requireConfigFile: false, // Prevent need for Babel config
        ecmaVersion: 2020, // Enable modern JavaScript syntax
        sourceType: 'module',
    },
    rules: {
        'vue/no-multiple-template-root': 'off', // Allow multiple root nodes in Vue 3
        'no-unused-vars': 'warn', // Warn about unused vars
        'no-empty': 'off', // Disable no-empty rule
        'no-console': 'off', // Disable no-console rule
        'no-debugger': 'off', // Disable no-debugger rule
        'no-empty-function': 'off', // Disable no-empty-function rule
        'no-dupe-keys': 'off', // Disable duplicate keys in object literals
        'vue/no-unused-components': 'off', // Disable unused components rule
        'vue/valid-v-slot': 'off', // Disable the 'valid-v-slot' error
        'vue/require-default-prop': 'off', // Disable the rule for requiring default value type to be a function
    },
};
