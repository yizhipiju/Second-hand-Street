const db = wx.cloud.database();
const app = getApp();
Page({
  data: {
    value: ''
  },
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.map == '' ) {
      wx.showModal({
        title: '提示',
        content: '填写错误，请重新填写',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      wx.showLoading({
        title: '提交中...',
      })
      db.collection("user").where({ _openid: wx.getStorageSync('openid') }).get({
        success: function (res) {
          db.collection("user").doc(res.data[0]._id).update({
            data: {
              map: e.detail.value.map
            }, success: function (res) {
              wx.showToast({
                title: '修改成功',
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })

    }
  }
})