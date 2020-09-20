// pages/My/map/map.js
Page({
  data: {
    height: '0px'
  },
  onLoad: function (e) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight + 'px'
    })
  }
})