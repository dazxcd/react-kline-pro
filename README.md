# react-kline     [![npm version](https://badge.fury.io/js/react-kline.svg)](https://badge.fury.io/js/react-kline)

[![NPM](https://nodei.co/npm/react-kline.png)](https://www.npmjs.com/package/react-kline)

> 基于React的K线图组件

### 演示地址

* [Demo](https://lindakai2016.github.io/react-kline/index.html)

### 安装和使用

安装

```bash
$ npm install react-kline
```

* 使用

```html
    import React from 'react';
    import ReactDOM from 'react-dom';
    import ReactKline from 'react-kline';

    class App extends React.Component {

        onRequestData(param,callback){
            let data={};
            //请求数据
            //...
            callback(data);
        }

        render() {
            return (
                <ReactKline
                    width={600}
                    height={400}
                    ranges={["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"]}
                    symbol={"BTC"}
                    symbolName={"BTC/USD"}
                    intervalTime={5000}
                    depthWidth={50}
                    onRequestData={this.onRequestData}
                />
            );
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
```

### 构建选项

| 参数名称  | 参数说明         |  默认值
|:---------|:-----------------|:------------
|`width`   | 宽度 (px)         | 600
|`height` | 高度度 (px) | 400
|`theme` | 主题 dark(暗色)/light(亮色)| dark
|`language` | 语言 zh-cn(简体中文)/en-us(英文)/zh-tw(繁体中文)| zh-cn
|`ranges` | 聚合选项 1w/1d/12h/6h/4h/2h/1h/30m/15m/5m/3m/1m/line (w:周, d:天, h:小时, m:分钟, line:分时数据)| ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"]
|`symbol` | 交易代号| 
|`symbolName`  | 交易名称 | 
|`limit`  | 分页大小 | 1000
|`intervalTime`  | 请求间隔时间(ms) | 3000
|`debug` | 是否开启调试模式 true/false |  true
|`depthWidth` | 深度图宽度 | 最小50，小于50则取50，默认50


### 方法

* resize(int width, int height)

    设置画布大小

```javascript
resize(1200, 550);
```

* setSymbol(string symbol, string symbolName)

    设置交易品种

```javascript
setSymbol('usd/btc', 'USD/BTC');
```

* setTheme(string style)

    设置主题

```javascript
setTheme('dark');  // dark/light
```

* setLanguage(string lang)

    设置语言

```javascript
setLanguage('en-us');  // en-us/zh-ch/zh-tw
```

* setIntervalTime: function (intervalTime) 

    设置请求间隔时间(ms)

```javascript
setIntervalTime(5000);
```

* setDepthWidth: function (width)

    设置深度图宽度

```javascript
setDepthWidth(100);
```


### 事件

| 事件函数                 |  说明
|:-----------------------|:------------
| `onResize: function(width, height)`   | 画布尺寸改变时触发
| `onLangChange: function(lang)`   | 语言改变时触发
| `onSymbolChange: function(symbol, symbolName)`   | 交易品种改变时触发
| `onThemeChange: function(theme)`   | 主题改变时触发
| `onRangeChange: function(range)`   | 聚合时间改变时触发
| `onRequestData: function(param,callback)`| 请求数据时触发，触发时间间隔由`intervalTime`指定，`param`请求参数，`callback(res)`结果回调函数。无论请求是否成功，必须在`onRequestData`里调用`callback`,否则会中断数据请求。

### 数据请求param格式

```json
{
  "symbol": "BTC",		// 交易品种
  "range": 900000,		// range类型，毫秒
  "limit": 1000,
  "since": "1512205140000"      // 时间
}
```

### 回调函数res格式

> 数据请求成功

当success为true，请求成功。

```json
{
  "success": true,
  "data": {
    "lines": [
      [
        1.50790476E12,
        99.30597249871,
        99.30597249871,
        99.30597249871,
        99.30597249871,
        66.9905449283
      ]
    ],
    "depths": {
      "asks": [
        [
          500654.27,
          0.5
        ]
      ],
      "bids": [
        [
          5798.79,
          0.013
        ]
      ]
    }
  }
}
```

> 数据请求失败

当res为空，或者success为false，请求失败。

```json
{
  "success": false,
  "data": null,	        // success为false，则忽略data
}
```


* res参数说明:

* `lines`: K线图, 依次是: 时间(ms), 开盘价, 最高价, 最低价, 收盘价, 成交量
* `depths`深度图数据,`asks`: 一定比例的卖单列表, `bids`:一定比例的买单列表, 其中每项的值依次是 : 成交价, 成交量