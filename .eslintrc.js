module.exports = {
    extends: ['plugin:vue/vue3-recommended'],
    rules: {
        'vue/no-undef': 'off', // Disable error for defineOptions
        'no-unused-vars': 'warn', // Warn instead of error for unused variables
    },
};
