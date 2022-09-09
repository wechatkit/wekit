const { defPage } = require("@wekit/core");
const { Test } = require("../../testlib");
const { testLifeEvent } = require("../common/test-life-event");

const test = new Test('pages/test-tabbar/tab1.js');
const { onLoad, onPreload } = testLifeEvent(test)

// pages/test-tabbar/tab1.js
module.exports = defPage({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onBack(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  onPreload,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    onLoad()
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