import BaseConfig from './baseConfig';

const API_ROOT = BaseConfig.debug
? 'https://w3.cyqapp.com' : 'https://production.domain.com';

const Network = {};

Network.API_ROOT = API_ROOT;

// auth
Network.AUTH = `${API_ROOT}/auth`; // the authentication 

export default Network;
