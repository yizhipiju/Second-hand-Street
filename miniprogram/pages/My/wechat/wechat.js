// pages/my/wechat/wechat.js
const db = wx.cloud.database();
const app = getApp();
Page({
  data: {

  },

  onLoad: function (options) {
    wx.hideShareMenu();
  },

  //上传自我简介
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.inputText != "") {
      db.collection("user").where({ _openid: wx.getStorageSync('openid') }).get({
        success: function (res) {
          db.collection("user").doc(res.data[0]._id).update({
            data: {
              wechat: e.detail.value.inputText
            }, success: function (res) {
              wx.showToast({
                title: '修改成功',
              })
              wx.navigateBack({
                delta: 2
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '输入为空，修改失败',
        icon: 'none',
      })
    }
  }
})