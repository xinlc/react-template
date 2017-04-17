import { takeEvery, select } from 'redux-saga/effects';

function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const newState = yield select();
    console.log('Sagas.Logger.action', action);
    console.log('Sagas.Logger.state.after', newState);
  });
}

export default watchAndLog;
