import { put, call, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { Toast, Modal } from 'antd-mobile';
import { updateUser } from 'actions/user';
import Network from 'config/network';
import Utils from 'common/utils';

const Alert = Modal.alert;

function* initUser() {
  try {
    // const url = '';
    // const result = yield call([Utils.Api, Utils.Api.get], url);
    // TODO: fetch user
    const result = Utils.storage.getUser();
    yield put(updateUser(result));

    Utils.storage.setUser(result);
  } catch (error) {
    console.log('error.appinit', error);
  }
}

function* updateLocation(action) {
  try {
    // TODO: 更新用户坐标
    yield put(updateUser(action.payload));
    const { user } = yield select((state) => {
      return {
        user: { ...state.user }
      };
    });
    Utils.storage.setUser(user);
  } catch (error) {
    console.log('error.updateLocation', error);
  }
}

function* updateUserSaga(action) {
  try {
    yield put(updateUser(action.payload));
    const { user } = yield select((state) => {
      return {
        user: { ...state.user }
      };
    });
    Utils.storage.setUser(user);
  } catch (error) {
    console.log('error.updateUserSaga', error);
  }
}

function* fetchUserByToken(action) {
  try {
    console.log('fetchUserByToken.action', action);
    // if there is a token in the action, update user token
    if (action && action.payload && action.payload.token) {
      yield updateUserSaga({
        type: 'SAGA_UPDATE_USER',
        payload: { Token: action.payload.token }
      });
    }
    const user = yield call([Utils.Api, Utils.Api.get], Network.PROD_USER);
    console.log('fetchUsierByToken.action', action);
    console.log('fetchUserByToken.user', user);
    if (!user.phone)user.phone = ''; // if user phone is null, set phone is ''
    yield put({
      type: 'SAGA_UPDATE_USER',
      payload: { ...user }
    });
  } catch (e) {
    console.log('error.fetchUserByToken', e);
    if (e.code === 40009) {
      yield put({
        type: 'SAGA_UPDATE_USER',
        payload: { uid: (new Date()).getTime(), phone: '' }
      });
    }
  }
}

function* resetPhone(action) {
  Toast.loading('加载中...', 0, Function, false);
  const { phone, smsCode, callback } = action;
  try {
    const url = `${Network.AUTH}/phone?phone=${phone}&captcha=${smsCode}`;
    const result = yield call([Utils.Api, Utils.Api.put], url);
    // fetch user info again
    yield fetchUserByToken();
    callback(result);
    Toast.hide();
  } catch (error) {
    Alert(error.msg);
    Toast.hide();
  }
}


function* index() {
  yield [
    takeEvery('SAGA_INIT_USER', initUser),
    takeEvery('SAGA_UPDATE_USER_LOCATION', updateLocation),
    takeEvery('SAGA_UPDATE_USER', updateUserSaga),
    takeLatest('SAGA_FETCH_USER_BY_TOKEN', fetchUserByToken),
    takeEvery('SAGA_RESET_PHONE_USER', resetPhone),
  ];
}

export default index;
