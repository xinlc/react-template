const fs = require('fs');

const city_l2 = require('./City_L2.js');

const fb = fs.readFileSync('./baiduCityCode.txt');
const baidu_city_string = fb.toString();
const baidu_city_array = baidu_city_string.split('\n');
console.log(baidu_city_array.length);

const baidu_city_obj = {};

for (let i in baidu_city_array) {
  const tmp = baidu_city_array[i].split(' ');
  if (tmp.length > 1) {
    baidu_city_obj[tmp[1]] = tmp[0];
  }
}

for (var i in baidu_city_obj) {
  console.log(`${i} : ${baidu_city_obj[i]}`);
}

// console.log(city_l2);
for (let i = 0; i < city_l2.length; i++) {
  console.log(city_l2[i].label);
  if (baidu_city_obj[city_l2[i].label]) {
    city_l2[i].value = baidu_city_obj[city_l2[i].label];
  }
  if (city_l2[i].children) {
    for (let j = 0; j < city_l2[i].children.length; j++) {
      console.log(`>${city_l2[i].children[j].label}`);
      if (baidu_city_obj[city_l2[i].children[j].label]) {
        city_l2[i].children[j].value = baidu_city_obj[city_l2[i].children[j].label];
      }
    }
  }
}

fs.writeFile('Baidu_City_L2.js', JSON.stringify(city_l2, null, 2), (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('The file was saved!');
});

for (var i in city_l2) {
  console.log(`${city_l2[i].label} : ${city_l2[i].value}`);
  for (var j in city_l2[i].children) {
    console.log(`>${city_l2[i].children[j].label} : ${city_l2[i].children[j].value}`);
  }
}
