/* eslint-disable */
'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[id].[chunkhash].js',
    publicPath: defaultSettings.publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false,
    inline: true,
    // proxy: {                    // 跨域
    //   '/proxyapi/*': {
    //     target: 'https://w3.cyqapp.com',
    //     changeOrigin: true,
    //     secure: true,
    //   }
    // }
  },
  resolve: {
    extensions: ['', '.web.js', '.js', '.jsx'],
    modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
    alias: {
      actions: `${defaultSettings.srcPath}/actions/`,
      components: `${defaultSettings.srcPath}/components/`,
      styles: `${defaultSettings.srcPath}/assets/styles/`,
      images: `${defaultSettings.srcPath}/assets/images/`,
      fonts: `${defaultSettings.srcPath}/assets/fonts/`,
      views: `${defaultSettings.srcPath}/views/`,
      common: `${defaultSettings.srcPath}/common/`,
      config: `${defaultSettings.srcPath}/config/`,
      sagas: `${defaultSettings.srcPath}/sagas/`,
      'react/lib/ReactMount': 'react-dom/lib/ReactMount'
    }
  },
  postcss: function () {
    return [
      require('autoprefixer'),
      require('postcss-pxtorem')({
        rootValue: 100,
        propWhiteList: [],
        // propList: [
        //   '*',
        //   '!*height*'
        // ]
      })
    ];
  }
};
