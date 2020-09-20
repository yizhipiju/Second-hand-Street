const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    sell: [],
  },
  onLoad: function (options) {
    var that = this;
    db.collection("data").where({
      _openid: wx.getStorageSync('openid'),
      show: 'no',
      over: 'ok'
    }).get({
      success: function (res) {
        that.setData({
          sell: res.data
        })

      }
    })
  },

})