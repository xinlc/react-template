/* eslint-disable */
// base configuration for the application

const BaseConfig = {
  debug: !(process.env.NODE_ENV === 'production'),
  appVersion: '0.0.1',
  pageSize: 10,
	timeoutMS: 60 * 1000,
  serverMessage: '请求服务器异常!',
  timeoutMessage: '请求超时，请检查你的网络！',
	HttpCode: {
    captchaError: 910003,
    captchaTimeout: 910009,
    captchaFailed: 910010,
    unauthorized: 40100,
  },
  defaultUser: {
    id: '',
    Token: '',
    hasPassword : '0',
    userName : '',
    phone : '',
    photo : '',
    lng: '116.404',
    lat: '39.915',
    city: ['210000', '167', '210201'], // 大连
    address: ''
  },
};

/**
 *  重写console.log
 *  打包发布别忘了 BaseConfig.debug 改成false
 */

(() => {
	console._log = console.log;
	if (!BaseConfig.debug) {
		console.log = () => null;
	}
})();

export default BaseConfig;
