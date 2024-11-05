const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
// const path = require('path');

let publicPath = '/';
// if (process.env.MODE === 'PROD') {
//   publicPath = 'https://fit.by-link.ru/';
// }
// if (process.env.MODE === 'STAGE') {
//   publicPath = 'https://demo.fit.by-link.ru/';
// }

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
  configureWebpack: {
    output: {
      filename: 'js/fit-[name].js',
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ]
  },
  css: {
    extract: {
      filename: 'css/[name].css',
    },
  },
});
