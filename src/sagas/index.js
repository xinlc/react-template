import { fork } from 'redux-saga/effects';
import Logger from './Logger';
import User from './user';
import Auth from './auth';

function* index() {
  yield [
    fork(Logger),
    fork(User),
    fork(Auth),
  ];
}

export default index;
