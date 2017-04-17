import 'whatwg-fetch';
import { Toast } from 'antd-mobile';
import BaseConfig from 'config/baseConfig';
import Storage from 'common/storage';

const filterUnauthorizedPage = ['login', 'register', 'forgetpassword'];

const Api = {
  // post请求
  post(url, data, onSuccess, onError) {
    const user = Storage.getUser();

    const fetchOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json,text/plain',
        'Content-Type': 'application/json',
        Token: user.Token,
      },
      body: JSON.stringify(data)
    };

    return this.request(url, fetchOptions, onSuccess, onError);
  },

  // get请求
  get(url, onSuccess, onError) {
    const user = Storage.getUser();

    const fetchOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json', // removed by Francis, as GET dosen't send any data, no need to give content-type
        Token: user.Token,
      }
    };
    return this.request(url, fetchOptions, onSuccess, onError);
  },

  // put请求
  put(url, data, onSuccess, onError) {
    const user = Storage.getUser();

    const fetchOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: user.Token,
      },
      body: JSON.stringify(data)
    };

    return this.request(url, fetchOptions, onSuccess, onError);
  },

  delete(url, data, onSuccess, onError) {
    const user = Storage.getUser();

    const fetchOptions = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: user.Token,
      },
      body: JSON.stringify(data)
    };

    return this.request(url, fetchOptions, onSuccess, onError);
  },

  request(url, fetchOptions, onSuccess = Function, onError) {
    console.info('Api.request.fetchOptions', url, fetchOptions);
    let status = null;
    let defaultOnError = null;
    if (!onError) {
      defaultOnError = function () {
      };
      onError = defaultOnError;
    }
    return new Promise(function (resolve, reject) { // eslint-disable-line
      this.timeout(BaseConfig.timeoutMS, fetch(url, fetchOptions))
      .then((response) => {
        status = response.status;
        return response.text();
      })
      .then((responseText) => {
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.info('Components.CommonUtil.request', responseText);
          // status = 202;
          data = {
            code: status,
            msg: BaseConfig.serverMessage
          };
        }
        if ([200, 201, 301, 304].includes(status)) {
          resolve(data);
          onSuccess(data);
        } else if (data.code == BaseConfig.HttpCode.unauthorized) {  // 未经授权访问
          // if (!filterUnauthorizedPage.includes(Utils.Scene.getCurrentSceneName())) {
          //   console.log('您的登录状态已失效或在别处登录，请重新登录。', data, url, fetchOptions);

          //   CommonUtil.showMsg('提示', '您的登录状态已失效或在别处登录，请重新登录。');
          //   Actions.login({ isUnauthorized: true });
          // }
          Toast.info('您的登录状态已失效或在别处登录，请重新登录。', 2);
        } else {
          reject(data);
          onError(data);
        }
      }).catch((error) => {
        if (error.message == 'timeout' || error.message == 'Network request failed') {
          const clientData = {
            code: 408,
            msg: BaseConfig.timeoutMessage
          };
          reject(error);
          if (onError === defaultOnError) {
            Toast.offline(clientData.msg, 2);
          } else {
            onError(clientData);
          }
        }
      }
    );
    }.bind(this));
  },

  timeout(ms, promise) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, ms);
      promise.then(resolve, reject);
    });
  }
};

export default Api;
