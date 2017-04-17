/* eslint-disable */
'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionWebpackPlugin = require('compression-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,
  debug: false,    // loader 不开启debug
  // devtool: '#source-map',
  devtool: false, // 生成环境不适用sourcemap
  plugins: [
    new webpack.optimize.DedupePlugin(),  //删除重复代码
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new ExtractTextPlugin('css/[name].[hash].css'),  //css单独打包
    new HtmlWebpackPlugin({         //根据模板插入css/js等生成最终HTML
      filename: '../index.html',    //生成的html存放路径，相对于 path
      template: './cfg/index.html', //html模板路径
      hash: true,                   //为静态资源生成hash值
      inject: true,                 // 自动注入
      minify: {
        removeComments: true,         //去注释
        collapseWhitespace: true,     //压缩空格
        removeAttributeQuotes: true   //去除属性引用
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      //必须通过 CommonsChunkPlugin 的依赖关系自动添加 js，css 等
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.UglifyJsPlugin({ // 代码压缩
      comments: false,        //去掉注释
      compress: {
          warnings: false    //忽略警告,要不然会有一大堆的黄色字体出现……
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),     // 为组件分配ID
    new webpack.optimize.AggressiveMergingPlugin(), //合并块
    new webpack.NoErrorsPlugin(),

    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    //gzip 压缩
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
          '\\.(js|css)$'    //压缩 js 与 css
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
