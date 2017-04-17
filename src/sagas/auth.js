import { put, call, takeEvery, select } from 'redux-saga/effects';
import { Toast, Modal } from 'antd-mobile';
import { clearUser } from 'actions/user';
import Network from 'config/network';
import Utils from 'common/utils';

const Alert = Modal.alert;

function* loginPwd(action) {
  Toast.loading('加载中...', 0, Function, false);
  const { phone, pwd, captcha, captchaImgId, callback } = action;
  try {
    const url = `${Network.AUTH}/login/verifycode?phone=${phone}&password=${pwd}&imgId=${captchaImgId}&verifyCode=${captcha}`;
    const result = yield call([Utils.Api, Utils.Api.post], url);

    callback(result);
    Toast.hide();
  } catch (error) {
    Alert(error.msg);
    Toast.hide();
  }
}

function* getCaptcha(action) {
  Toast.loading('加载中...', 0, Function, false);
  const { callback } = action;
  try {
    const url = `${Network.AUTH}/verifyImg`;
    const result = yield call([Utils.Api, Utils.Api.get], url);
    callback(result);
    Toast.hide();
  } catch (error) {
    Alert(error.msg);
    Toast.hide();
  }
}

function* sendSMS(action) {
  Toast.loading('发送中...', 0, Function, false);
  const { phone, captchaImgId, captcha, callback } = action;
  try {
    const url = `${Network.AUTH}/sms?type=loginbysms&phone=${phone}&imgId=${captchaImgId}&verifyCode=${captcha}`;
    yield call([Utils.Api, Utils.Api.post], url);
    callback('ok');
    Toast.hide();

    yield Utils.delay(800);
    Toast.info('验证码发送成功', 1.5);
  } catch (error) {
    callback('fail');
    Alert(error.msg);
    Toast.hide();
  }
}

function* loginSMS(action) {
  Toast.loading('加载中...', 0, Function, false);
  const { phone, smsCode, callback } = action;
  try {
    const url = `${Network.AUTH}/login/sms/verifycode?phone=${phone}&captcha=${smsCode}`;
    const result = yield call([Utils.Api, Utils.Api.post], url);

    callback(result);
    Toast.hide();
  } catch (error) {
    Alert(error.msg);
    Toast.hide();
  }
}

function* resetPassword(action) {
  Toast.loading('加载中...', 0, Function, false);
  const { phone, smsCode, password, callback } = action;
  try {
    const url = `${Network.AUTH}/user/resetpassword?phone=${phone}&captcha=${smsCode}&password=${password}`;
    const result = yield call([Utils.Api, Utils.Api.put], url);

    callback(result);
    Toast.hide();
  } catch (error) {
    Alert(error.msg);
    Toast.hide();
  }
}

function* logout(action) {
  Toast.loading('加载中...', 0, Function, false);
  const { callback } = action;
  try {
    const url = `${Network.SHOP}/logout`;
    yield call([Utils.Api, Utils.Api.post], url);
    yield put(clearUser());
    const { user } = yield select((state) => {
      return {
        user: { ...state.user }
      };
    });
    Utils.storage.setUser(user);
    callback();
    Toast.hide();
  } catch (error) {
    Alert(error.msg);
    Toast.hide();
  }
}


function* index() {
  yield [
    takeEvery('SAGA_LOGIN_PWD_AUTH', loginPwd),
    takeEvery('SAGA_GET_CAPTCHA_AUTH', getCaptcha),
    takeEvery('SAGA_SEND_SMS_AUTH', sendSMS),
    takeEvery('SAGA_LOGIN_SMS_AUTH', loginSMS),
    takeEvery('SAGA_RESET_PASSWORD_AUTH', resetPassword),
    takeEvery('SAGA_LOGOUT_AUTH', logout)
  ];
}

export default index;
