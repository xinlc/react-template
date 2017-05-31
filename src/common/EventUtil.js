/* eslint-disable */

/**
 * 自定义dom 事件
 * EventUtil  全局接口
 * addEvent
 * fireEvent
 * removeEvent
 * Created by lichao on 17/03/30.
 * 主要用于框架内组件和第三方组件库进行信息传递。
 */

// Polyfill CustomEvent
(function () {
  if (typeof window.CustomEvent === 'function') 
    return false;
  
  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    let evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}());


// Event
const Event = function (el) {
  return new _Event(el);
};

const _Event = function (el) {
  this.el = (el && el.nodeType == 1)
    ? el
    : document;
};

_Event.prototype = {
  constructor: this,
  addEvent: function (type, fn, capture) {
    this.el.addEventListener(type, fn, capture);
    return this;
  },
  fireEvent: function (type) {
    const ev = new CustomEvent(type);
    this.el.dispatchEvent(ev);
    return this;
  },
  removeEvent: function (type, fn, capture) {
    this.el.removeEventListener(type, fn, capture || false);
    return this;
  }
};

window.EventUtil = Event; // 全局接口

export default Event;