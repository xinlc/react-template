import BaseConfig from 'config/baseConfig';

function updateUser(payload) {
  return {
    type: 'UPDATE_USER',
    payload,
  };
}

function clearUser() {
  return updateUser(BaseConfig.defaultUser);
}

// ========== sagas ========


function initUser(payload) {
  return {
    type: 'SAGA_INIT_USER',
    payload,
  };
}

function updateUserLocation(payload) {
  return {
    type: 'SAGA_UPDATE_USER_LOCATION',
    payload,
  };
}

function updateUserSaga(payload) {
  return {
    type: 'SAGA_UPDATE_USER',
    payload,
  };
}

function resetPhone(phone, smsCode, callback) {
  return {
    type: 'SAGA_RESET_PHONE_USER',
    phone,
    smsCode,
    callback,
  };
}

export {
  updateUser,
  initUser,
  updateUserLocation,
  updateUserSaga,
  resetPhone,
  clearUser
};
