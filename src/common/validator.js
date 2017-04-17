/* eslint-disable */
/**
 * validator Util
 * Created by lichao on 16/11/30.
 */

var validator = {};

/**
 * 校验手机
 * @param value 手机号
 * @returns {boolean}
 */
validator.isMobileNumber = function (value) {
  let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(value);
};

/**
 * 判断非空
 * @param  value
 * @return Boolean
 */
validator.isEmpty = function (value) {
  if (value == null || !(/.?[^\s ]+/.test(value))) {
    return true;
  } else {
    return false;
  }
};

/**
 * 判断数字
 * @param  value
 * @return Boolean
 */
validator.isNumeric = function (value) {
  return toString.call(value) === '[object Number]';
};

/**
 * 非零整数
 * @param  value
 * @return Boolean
 */
validator.isInteger = function (value) {
  return /^[1-9]\d*$/.test(value);
};

/**
 * password
 * @param  value
 * @return Boolean
 */
validator.isPassword = function (value) {
  return /^[0-9A-Za-z]{6,20}$/.test(value); // 密码为6-20字符，可由字母、数字组成
};

export default validator;
