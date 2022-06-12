// logs.js
const util = require('../../utils/util.js')

module.exports = wx.defPage({
  data: {
    logs: []
  },
  onLoad() {
    console.log(this.data.logs);
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
})
