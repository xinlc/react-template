import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import storage from 'common/storage';
import Browser from 'common/browser';
import Home from '../views/Main';
import Login from '../views/auth/login';
import SMSLogin from '../views/auth/smsLogin';
import ForgetPassword from '../views/auth/forgetPassword';
import ResetPassword from '../views/auth/resetPassword';
import ChangePhone from '../views/auth/changePhone';

/**
 * 路由根组件
 * @class Root
 * @extends {Component}
 */
class Root extends Component {
  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>{this.props.children}</div>
    );
  }
}

/* eslint-disable */
const AUTHURL = {
  '/shop/detail': 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=$API_KEY&redirect_uri=https://YOUR.DOMAIN.COM/wx2/auth&response_type=code&scope=snsapi_userinfo&state=$foward#wechat_redirect',
}
/* eslint-enable */

const requireAuth = (nextState, replace, callback) => {
  if (!storage.getUser().Token || !storage.getUser().phone) {
    if (Browser.isWeChat) {  // 微信环境，去授权登陆
      const pathname = nextState.location.pathname;
      const key = Object.keys(AUTHURL).find(n => new RegExp(n).test(pathname));
      window.location.href = AUTHURL[key].replace('$foward', nextState.location.pathname.replace(/\//g, '_'));
    } else {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }
  callback(); // 必须调用 callback
};

export const ACL = (nextState, replace, callback) => {
  if (!storage.getUser().Token || !storage.getUser().phone) {
    if (Browser.isWeChat) {  // 微信环境，去授权登陆
      const pathname = nextState.location.pathname;
      const key = Object.keys(AUTHURL).find(n => new RegExp(n).test(pathname));
      window.location.href = AUTHURL[key].replace('$foward', nextState.location.pathname.replace(/\//g, '_'));
    } else {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  } else {
    callback();
  }
};

const history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;

const routes = (
  <Router history={history}>
    <Route path="/" component={Root}>
      <IndexRoute component={Home} />
      <Route path="login" component={Login} />
      <Route path="login/sms" component={SMSLogin} />
      <Route path="forgetPassword" component={ForgetPassword} />
      <Route path="resetPassword" component={ResetPassword} />
      <Route path="changePhone(/:state)" component={ChangePhone} />
    </Route>
  </Router>
);

export default routes;
