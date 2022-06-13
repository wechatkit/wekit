# Wekit

励志做一个改善小程序开发体验的工具套装。

## 特性

- [x] 轻量的体积，整个核心代码大概有 5.9KB
- [x] 更好的性能，对 `setData` 的操作进行合并、并且增加一个比 `onLoad` 更早执行的页面事件 `onPreload`
- [x] 强大的插件，该框架非常核心的地方就是拥有插件系统，我们可以使用插件系统提供的事件来增强 wekit 的功能
- [ ] 混入复用，一个用来提高代码复用的特性
- [ ] 更好的提示，在写代码的时候提供更舒服的提示
- [ ] 计算属性，类似于 vue 的计算属性
- [ ] 路由钩子，类似于 VueRouter 的路由钩子、
- [ ] 开发调试工具，支持查看页面的属性、状态、事件流、性能
- [ ] 自动化的 E2E 测试支持
- [ ] Jest 单元测试的支持

## 安装

```bash
npm i @wekit/core
```

然后选择 `【工具】` -> `【构建npm】`

## 使用

> 具体例子请查看 `packages/play` 文件夹

```js
// app.js
const { createApp } = require("@wekit/core");
const { ConsolePlugin } = require("@wekit/plugin-console");

createApp({
  config: require("./wekit.config"),
  plugins: [new ConsolePlugin()],
  onLaunch() {
    console.log("初始化");

    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
  },
  onShow() {},
  globalData: {
    userInfo: null,
  },
});
```

创建 `webkit.config.js` 用来写入配置信息。

```js
module.exports = {
  require: require, // 这里必须这样写，因为小程序构建npm的限制，所以在包内部的 require 和外部的 require 方法不一样
  debug: true, // 开启调试模式，会打印一些事件信息，上线建议关闭此选项
};
```

创建 index 页面

```js
// /pages/index/index.js
const { defPage } = require("@wekit/core");
const util = require("../../utils/util.js");

module.exports = defPage({
  data: () => ({
    // 这里可以使用对象，但是更好的方式是使用函数返回
    logs: [],
  }),
  onLoad() {
    console.log(this.data.logs);
    this.setData({
      logs: (wx.getStorageSync("logs") || []).map((log) => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log,
        };
      }),
    });
  },
});
```

## 插件

> 插件可以用来增强整个框架的功能，而且按需使用

## 配置

## 参考

### createApp

### defPage

### defComponent

### Plugin

## 关于

- 开发一个 Wekit 插件...

MIT License
