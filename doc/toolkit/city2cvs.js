const city = require('./Baidu_City_L2');


// 把树状结构传list
function option2map(options, prefix) {
  const _map = {};
  for (let i = 0; i < options.length; i++) {
    if (typeof (options[i]) == 'object') {
      console.log(`${prefix}, ${options[i].value}, ${options[i].label}`);
    //   _map[(prefix || '') + options[i].value] = options[i].label;
      if (options[i].children) {
        option2map(options[i].children, prefix + 1);
        // Object.assign(_map, _childMap);
      }
    }
  }
  return _map;
}

option2map(city, 1);
// const res = option2map(city, '');
// console.log(JSON.stringify(res));

