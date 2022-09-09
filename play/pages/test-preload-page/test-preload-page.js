// pages/test-preload-page/test-preload-page.js
import { defPage } from "@wekit/core";
import { expect, Test } from "../../testlib";

const test = new Test('pages/test-preload-page/test-preload-page.js');

let t = 0;
let testReq = [];
const expectOnPreload = test.it('测试 onPreload 是否执行')
const expectBeforeOnload = test.it('测试 onPreload 在 onLoad 之前执行')

module.exports = defPage({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onPreload(){
    t = Date.now();
    console.log('onPreload', Date.now());
    testReq.push('preload')
    expectOnPreload();
  },

  onLoad(){
    console.log('onLoad', Date.now(), Date.now() - t);
    test.run();
    testReq.push('load')
    expectBeforeOnload(()=>{
      expect(testReq).toEqual(['preload', 'load']);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    test.recover();
    testReq = [];
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})