// index.js
const { defPage } = require("@wekit/core");
const { Test, expect } = require("../../testlib");

// 获取应用实例
const app = getApp()

const test = new Test('index.js');

const testReq = [];
const expectOnPreload = test.it('测试 onPreload 是否执行')
const expectBeforeOnload = test.it('测试 onPreload 在 onLoad 之前执行')

test.run();

module.exports = defPage({
  data: {

  },

  onNav(e){
    const { page, type = 'navigateTo' } = e.target.dataset;
    console.log(page)
    wx[type]({
      url: `/pages/${page}`,
    })
  },

  onPreload(){
    testReq.push('preload')
    expectOnPreload();
  },

  onLoad(){
    testReq.push('load')
    expectBeforeOnload(()=>{
      expect(testReq).toEqual(['preload', 'load']);
    })
  }
})
