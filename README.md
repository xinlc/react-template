# react-template

## [Usage](https://github.com/react-webpack-generators/generator-react-webpack)
```bash
# Installation
npm install

# Start for development
npm start # or
npm run serve

# Start the dev-server with the dist version
npm run serve:dist
# Just build the dist version and copy static files
npm run dist

# Run unit tests
npm test

# Auto-run unit tests on file changes
npm run test:watch

# Lint all files in src (also automatically done AFTER tests are run)
npm run lint

# Clean up the dist directory
npm run clean

# Just copy the static assets
npm run copy
```

## Intro
项目使用：webpack + react + react-router + redux + redux-saga + antd-mobile

- [webpack 负责项目打包](https://webpack.js.org) or [中文](https://doc.webpack-china.org)
- [reac 构建UI](https://facebook.github.io/react/docs/installation.html) or [阮大神教程](http://www.ruanyifeng.com/blog/2015/03/react.html)
- [react-router 页面路由](https://github.com/ReactTraining/react-router/tree/v3/docs)
- [redux 状态管理](http://redux.js.org) or [中文](http://cn.redux.js.org)
- [redux-saga 处理业务逻辑](https://redux-saga.github.io/redux-saga/) or [中文](http://leonshi.com/redux-saga-in-chinese/index.html)
- [antd-mobile UI组件库](https://mobile.ant.design)

## 目录结构介绍
<!-- ![tree](/doc/Wiki/images/tree.png) -->

```bash
cfg                     # webpack config 一般不需要改动
├── base.js             # dev和dist 通用的配置
├── defaults.js         # 加载器，端口(dfltPor)，打包生成文件的路径（publicPat）
├── dev.js              # 开发环境配置
├── dist.js             # 生产环境配置
├── index.html          # 项目html模板，如果要添加第三方依赖（例如：阿里oss，百度地图）需要修改此文件
dist                    # 存放生产包文件
src
├── actions             # redux action creator
├── assets              # 存放静态资源
│   ├── fonts
│   ├── images
│   └── styles
│       ├── common.scss # 全局样式或通用的样式（注意：要用 ":global"）
│       └── theme.js    # 设置 antd 主题样式
├── common              # 存放util 文件
│   ├── api.js          # 请求后端API，封装的fetch
│   ├── utils.js
├── components          # 复用性高的组件
│   ├── NavBar.js
├── config
│   ├── baseConfig.js   # 配置，版本 debug defaultUser 等
│   ├── network.js      # api url配置
│   └── routes.js       # 路由配置
├── index.js            # 项目入口，主文件
├── reducers            # redux reducer
│   ├── index.js
├── sagas               # redux saga，处理业务逻辑
│   ├── index.js
└── views               # 存放UI文件
    ├── Main.js         # Index Route
deploy-stage.sh         # 打包 and 部署文件到测试服务器
deploy.sh               # 打包 and 部署文件到生产服务器
```

## action 规范说明
1. `type` 属性是必须的，表示Action的名称
2. `payload` 主要数据，如果`error`属性为`true`, `payload` 应该是个错误对象
3. `error` 为`true`表示操作错误
4. `meta` 额外信息, 例如：
``` js
{
  type: 'FETCH',
  payload: {url: '/some/thing', method: 'GET'},
  meta: {
    success: Function
    failure: Function
  }
}
```

## scss 规范说明
1. 单位应使用 `px`，postcss-pxtorem插件会自动转换rem [高清方案](https://github.com/ant-design/ant-design-mobile/wiki/antd-mobile-0.8-以上版本「高清」方案设置)
2. 不需要写浏览器前缀 `autoprefixe` 插件会自动添加
3. 宽度不应用`px`，应使用flex布局或百分比
4. 不要给高度，高度应由内容撑起，要写应该用flex或min-height，max-height
5. css 书写顺序
- 1. 位置属性(position, top, right, z-index, display, float等)
- 2. 盒子模型(width, height, padding, margin等)
- 3. 文字系列(font, line-height, letter-spacing, color- text-align等)
- 4. 背景(background, border等)
- 5. 其他(animation, transition等)
