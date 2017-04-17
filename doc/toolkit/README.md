Generate 2 level city list base on baidu citycode and city package
====

# Steps

Go to toolkit folder
```bash
cd doc/toolkit
```

## Install city package
Install [city][d439de2b] package.

  [d439de2b]: https://github.com/basecss/city "city package"

```bash
npm install -g city

```

## Generate level 2 city json

```bash
city -k label,children,value -c -p -j module.exports -o City_L2.js
```
remove the `var` in City_L2.js file.

## Download the Baidu City Code list

[百度地图城市名称-城市代码（cityCode）关系对照文本][456ca0f4]

  [456ca0f4]: http://developer.baidu.com/map/static/doc/BaiduMap_cityCode.zip "百度地图城市名称-城市代码（cityCode）关系对照文本"

## Run generate script

```bash
node generateCitylist.js
```

The 2 level city list wich baidu city code will be generated in `Baidu_City_L2.js`
