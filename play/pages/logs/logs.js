// logs.js
const { defPage } = require("@wekit/core");
const util = require("../../utils/util.js");

module.exports = defPage({
  data: () => ({
    logs: [],
    // inpVal: "x",
  }),
  onPreload() {
    console.log("onPreload", this.data.logs);
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
