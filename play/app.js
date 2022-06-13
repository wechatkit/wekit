// app.js
const { createApp } = require('@wekit/core')
const { ConsolePlugin } = require('@wekit/plugin-console')

createApp({
  config: require('./wekit.config'),
  plugins: [new ConsolePlugin],
  onLaunch() {
    console.log('初始化');

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  onShow(){

  },
  globalData: {
    userInfo: null
  }
})
