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
        requireConfigFile: false,       // Prevent need for Babel config
        ecmaVersion: 2020,              // Enable modern JavaScript syntax
        sourceType: 'module',
    },
    rules: {
        'vue/no-multiple-template-root': 'off', // Allow multiple root nodes in Vue 3
        'no-unused-vars': 'warn',
        'vue/no-unused-components': 'off', // Disable "unused components" errors
        'vue/valid-v-slot': 'off', // Disable the 'valid-v-slot' error
        'no-dupe-keys': 'off', // Disable the 'duplicate key' error in Vue component definitions
    },
};
