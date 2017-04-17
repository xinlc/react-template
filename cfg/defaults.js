/**
 * Function that returns default values.
 * Used because Object.assign does a shallow instead of a deep copy.
 * Using [].push will add to the base array, so a require will alter
 * the base array output.
 */
/* eslint-disable */
'use strict';

const { existsSync } = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const srcPath = path.join(__dirname, '/../src');
const dfltPort = 8000;

const svgDirs = [ // svg-sprite-loader 配置
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
  path.join(srcPath, '/assets/fonts'),  // 2. 自己私人的 svg 存放目录
];

/**
 * Get the default modules object for webpack
 * @return {Object}
 */
function getDefaultModules(env) {

  // for customer antd theme
  const pkgPath = path.join(__dirname, '/../package.json');
  const pkg = existsSync(pkgPath) ? require(pkgPath) : {};
  
  let theme = {};
  if (pkg.theme && typeof(pkg.theme) === 'string') {
    let cfgPath = pkg.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.join(__dirname, `/../${cfgPath}`);
    }
    const getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
  } else if (pkg.theme && typeof(pkg.theme) === 'object') {
    theme = pkg.theme;
  }

  // Leo: 生产环境去掉了style加载器
  // 参考：https://github.com/ant-tool/atool-build/blob/a4b3e3eec4ffc09b0e2352d7f9d279c4c28fdb99/src/getWebpackCommonConfig.js#L131-L138
  // Update Date: 2017/03/25
  let lessLoader = ExtractTextPlugin.extract(
          'css-loader?sourceMap!' +
          'postcss!' +
          `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`
        );
  let lessModuleLoader = ExtractTextPlugin.extract(
            'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!' +
            'postcss!' +
            `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`
          );
  // end for loading customer antd theme

  let cssLoader = ExtractTextPlugin.extract('style-loader', 'css-loader');
  let scssLoader = ExtractTextPlugin.extract('style-loader', 'css?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap');
  if (env == 'dev') {
    cssLoader = 'style!css';
    scssLoader = 'style!css?modules&localIdentName=[name]_[local]_[hash:base64:5]!postcss!sass?sorceMap';
    lessLoader = 'style!css-loader?sourceMap!' + `postcss!less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`;
    lessModuleLoader = 'style!css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!' + `postcss!less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`;
  }
  // preLoaders: [
  //     {
  //       test: /\.(js|jsx)$/,
  //       include: srcPath,
  //       loader: 'eslint-loader'
  //     }
  //   ],
  return {
    loaders: [
      {
        test: /\.css$/,
        loader: cssLoader
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&indentedSyntax'
      },
      {
        test: /\.scss/,
        loader: scssLoader
      },
      {
        test(filePath) {
          // console.log('see', filePath, /\.less/.test(filePath) && !/\.module\.less/.test(filePath));
          return /\.less/.test(filePath) && !/\.module\.less/.test(filePath);
        },
        loader: lessLoader,
      },
      {
        test: /\.module\.less/,
        loader: lessModuleLoader,
      },
      {
        test: /\.(svg)$/i,
        loader: 'svg-sprite',
        include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          limit: 1024,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'url',
        query: {
          limit: 1024,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|ogg)$/,  // /\.(mp4|ogg|svg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json',
        query: {
          limit: 1024,
          name: 'json/[name].[hash:7].[ext]'
        }
      }
    ]
  };
}

module.exports = {
  srcPath: srcPath,
  // publicPath: './assets/',
  publicPath: !(process.env.REACT_WEBPACK_ENV == 'dist') ? '/assets/' : '/cybwebapp/assets/',
  port: dfltPort,
  getDefaultModules: getDefaultModules
};
