import BaseConfig from './baseConfig';

const API_ROOT = BaseConfig.debug
? 'https://w3.cyqapp.com' : 'https://www.cyqapp.com';

const Network = {};

Network.API_ROOT = API_ROOT;
Network.DOWNLOAD_URL = 'http://a.app.qq.com/o/simple.jsp?pkgname=bobaikeji.cyq';
Network.APP_LOGO_URL = 'http://static.cyqapp.com/static/app_logo.png';

// auth
Network.AUTH = `${API_ROOT}/cbbauth`;

export default Network;
