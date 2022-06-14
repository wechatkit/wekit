// app.js
const { createApp } = require('@wekit/core')
class ConsolePlugin{
  install(ctx){
      const eventFlow = [];
      console.log('ConsolePlugin',ctx)
      const addEventFlow = (data)=>{
          eventFlow.push(data);
      }
      ctx.pageEventEmitter.on('onLoad', (instance)=>{
          addEventFlow({
              event: 'onLoad',
              page: instance.route
          });
      });
      ctx.pageEventEmitter.on('onReady', (instance)=>{
          addEventFlow({
              event: 'onReady',
              page: instance.route
          });
      });
      ctx.pageEventEmitter.on('setData', (instance, data)=>{
          addEventFlow({
              event: 'setData',
              page: instance.route,
              data
          });
      });
      ctx.pageEventEmitter.on('flushView', (instance, data)=>{
          addEventFlow({
              event: 'flushView',
              page: instance.route,
              data
          });
      });

      wx.wekit = {
          getEventFlow(){
              console.table(eventFlow)
          }
      }
  }
}
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
