const { defineConfig } = require('@vue/cli-service');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = defineConfig({
  transpileDependencies: true,

  // Extend Webpack configuration
  configureWebpack: {
    plugins: [
      new VueLoaderPlugin(), // Explicitly add VueLoaderPlugin if necessary
    ],
  },
});
