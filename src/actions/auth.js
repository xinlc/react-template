
// ==== sage ====

function loginPwd(phone, pwd, captchaImgId, captcha, callback) {
  return {
    type: 'SAGA_LOGIN_PWD_AUTH',
    phone,
    pwd,
    captcha,
    captchaImgId,
    callback,
  };
}

function getCaptcha(callback) {
  return {
    type: 'SAGA_GET_CAPTCHA_AUTH',
    callback,
  };
}

function sendSMS(phone, captcha, captchaImgId, smsType, callback) {
  return {
    type: 'SAGA_SEND_SMS_AUTH',
    phone,
    captchaImgId,
    captcha,
    smsType,
    callback,
  };
}

function loginSMS(phone, smsCode, callback) {
  return {
    type: 'SAGA_LOGIN_SMS_AUTH',
    phone,
    smsCode,
    callback,
  };
}

function resetPassword(phone, smsCode, password, callback) {
  return {
    type: 'SAGA_RESET_PASSWORD_AUTH',
    phone,
    smsCode,
    password,
    callback,
  };
}

function logout(callback) {
  return {
    type: 'SAGA_LOGOUT_AUTH',
    callback,
  };
}

export {
  loginPwd,
  getCaptcha,
  sendSMS,
  loginSMS,
  resetPassword,
  logout
};
