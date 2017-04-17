
/**
 * Utils
 * Created by lichao on 16/11/30.
 */

import storage from './storage';
import validator from './validator';
import browser from './browser';
import Api from './Api';

const Utils = {};
Utils.storage = storage;
Utils.validator = validator;
Utils.browser = browser;
Utils.Api = Api;


/**
 * 辛丽超：根据生日计算星座
 * @param  {[type]} birthday [description]
 * @return {[type]}          [description]
 */
Utils.calConstellation = (birthday) => {
  if (birthday == null || birthday == '') {
    return '';
  }
  const date = new Date(birthday);// new Date(String(birthday).replace(/\-/g,'/'));
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const s = '魔羯座水瓶座双鱼座牡羊座金牛座双子座巨蟹座狮子座处女座天秤座天蝎座射手座魔羯座';
  const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
  return s.substr(month * 3 - (day < arr[month - 1] ? 3 : 0), 3);
};

/**
 * 辛丽超：计算年龄
 * @param  {[type]} birthday [description]
 * @return {[type]}          [description]
 */
Utils.calAge = (birthday) => {
  let age = 0;
  if (birthday) {
    const aDate = new Date();
    const thisYear = aDate.getFullYear();
    const thisMonth = aDate.getMonth() + 1;
    const thisDay = aDate.getDate();
    const brith = new Date(birthday);// new Date(String(birthday).replace(/\-/g,'/'));
    const brithy = brith.getFullYear();
    const brithm = brith.getMonth() + 1;
    const brithd = brith.getDate();
    if (thisYear - brithy > 0) {
      if (thisMonth - brithm > 0) {
        age = thisYear - brithy;
      } else if (thisMonth - brithm < 0) {
        age = thisYear - brithy - 1;
      } else if (thisDay - brithd >= 0) {
        age = thisYear - brithy;
      } else {
        age = thisYear - brithy - 1;
      }
    }
  }
  return String(age);
};

/**
 * 辛丽超：格式化Date
 * @param  {Date} date
 * @param  {String} fmt
 * @return {String}
 */
Utils.dateFormat = (date, fmt = 'yyyy-MM-dd') => {
  if (Object.prototype.toString.call(date) === '[object String]') {
    if (date.indexOf('-') != -1) {
      // 为了兼容ios 日期必须把 yyyy-mm-dd 转换为 yyyy/mm/dd
      date = date.replace(/\-/g, '/');  // eslint-disable-line
      if (date.lastIndexOf('.') != -1) { // 去掉毫秒
        date = date.substring(0, date.lastIndexOf('.'));
      }
    }
  }
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    date = new Date(date);
  }
  const o = {
    'M+': date.getMonth() + 1,                 // 月份
    'd+': date.getDate(),                    // 日
    'h+': date.getHours(),                   // 小时
    'm+': date.getMinutes(),                 // 分
    's+': date.getSeconds(),                 // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds()             // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
};

/**
 * date diff
 * @param {String} strInterval {y|m|w|d|h|n|s}
 * @param {String|Date} dtStart
 * @param {String|Date} dtEn
 */
Utils.dateDiff = (strInterval, start, end) => {
  const toDate = (date) => {
    if (Object.prototype.toString.call(date) === '[object String]') {
      if (date.indexOf('-') != -1) {
        // 为了兼容ios 日期必须把 yyyy-mm-dd 转换为 yyyy/mm/dd
        date = date.replace(/\-/g, '/'); // eslint-disable-line
        if (date.lastIndexOf('.') != -1) { // 去掉毫秒
          date = date.substring(0, date.lastIndexOf('.'));
        }
      }
    }
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      date = new Date(date);
    }
    return date;
  };

  const dtStart = toDate(start);
  const dtEnd = toDate(end);

  switch (strInterval) {
  case 's':
    return parseInt((dtEnd - dtStart) / 1000);
  case 'n':
    return parseInt((dtEnd - dtStart) / 60000);
  case 'h':
    return parseInt((dtEnd - dtStart) / 3600000);
  case 'd':
    return parseInt((dtEnd - dtStart) / 86400000);
  case 'w':
    return parseInt((dtEnd - dtStart) / (86400000 * 7));
  case 'm':
    return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
  // return dtEnd.getMonth() - dtStart.getMonth();
  case 'y':
    return dtEnd.getFullYear() - dtStart.getFullYear();
  default:
    return null;
  }
};

// 支持4个字节 emoji
Utils.StringToArray = function (str) {
  let index = 0;
  const length = str.length;
  const output = [];
  while (index < length) {
    const charCode = str.charCodeAt(index);
    const character = str.charAt(index);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      output.push(character + str.charAt(++index));
    } else {
      output.push(character);
    }
    index++;
  }
  return output;
};

Utils.limitStr = (str = '', length) => {
  str = str.trim().replace('\n', '');
  const arr = Utils.StringToArray(str);
  return arr.length > length ? `${arr.splice(0, length).join('')}...` : str;
};

Utils.getByteLen = (str) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};

Utils.generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);  // eslint-disable-line
  });
  return uuid;
};

/**
 * 对象深拷贝
 */
Utils.deepCopy = (p, _c) => {
  const c = _c || {};
  for (const i in p) {
    if (!p.hasOwnProperty(i)) { // eslint-disable-line
      continue; // eslint-disable-line
    }
    if (typeof p[i] === 'object') {
      c[i] = (p[i].constructor === Array) ? [] : {};
      Utils.deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
};

// 延迟
// @param { Number } ms
Utils.delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default Utils;
