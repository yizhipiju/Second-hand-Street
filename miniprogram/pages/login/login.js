// pages/login/login.js
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    height: "0rpx"
  },
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight + 'px'
    })
  },



  // 获取授权
  getUserInfo: function (e) {
    wx.showLoading({
      title: '正在登录',
    })
    console.log(e.detail.userInfo);
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        db.collection("user").where({
          _openid: res.result.openid
        }).count().then(res => {
          wx.showToast({
            title: '登录成功',
          })
          wx.switchTab({
            url: '../index/index',
          })

          if (res.total == 0) {
            db.collection("user").add({
              data: e.detail.userInfo
            }).then(res => {
            }).catch(err => {
              wx.showToast({
                title: '登录失败',
              })
              wx.switchTab({
                url: '../index/index'
              })
            })

          } else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        })
      }
    })
  },
  notLogin:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})