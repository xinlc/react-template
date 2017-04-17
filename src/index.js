import 'babel-polyfill';              // 解决 Uncaught ReferenceError: regeneratorRuntime is not defined
import 'normalize.css/normalize.css';
import 'styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { initUser, } from 'actions/user';
import routes from 'config/routes';
import reducers from './reducers';
import sagas from './sagas';
import './config/baseConfig';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    ...reducers,
  }),
  applyMiddleware(sagaMiddleware)
);

// then run the saga
sagaMiddleware.run(sagas);

// initial user
store.dispatch(initUser());

// Render the main component into the dom
ReactDOM.render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.getElementById('app')
);

/* eslint-disable */
// initial App
const ready = function() {
  // ...
};

const completed = function () {
  document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
  ready();
};

if ( document.readyState === "complete" ||
    ( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
    // Handle it asynchronously to allow scripts the opportunity to delay ready
    window.setTimeout( ready );
} else {
    // Use the handy event callback
    document.addEventListener( "DOMContentLoaded", completed );
    // A fallback to window.onload, that will always work
    window.addEventListener( "load", completed );
}
