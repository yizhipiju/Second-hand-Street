// pages/my/my.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    order: "0",
    nickName: '',
    avatarUrl: null,
    wechat: null,
    advertising: false,
    sum: false,
    // orderItems
    orderItems: [
      {
        typeId: 1,
        name: '我卖出的',
        url: '/pages/My/fahuo/fahuo',
        imageurl: '/icon/fahuo.png',
      },
      {
        typeId: 2,
        name: '我买的',
        url: '/pages/My/shouhuo/shouhuo',
        imageurl: '/icon/shouhuo.png'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        db.collection("user").where({
          _openid: res.result.openid
        }).count().then(res => {
          if (res.total == 0) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }
        })
      }
    })
    db.collection("order").where({
      openid: wx.getStorageSync('openid'),
    }).count({
      success: function (res) {
        if (res.total > 0) {
          that.setData({
            sum: true
          })
        }


      }
    })
  },
  onShareAppMessage() {
    return {
      title: '龙子湖跳蚤街',
      desc: '一款交易二手物品软件。',
      path: 'pages/index/index'
    }

  },
  onShow: function (e) {
    var that = this;
    that.getDataUser();
  },
  getDataUser: function (e) {
    // 获取个人资料
    var that = this;
    db.collection("user").where({ _openid: wx.getStorageSync('openid') }).get({
      success: function (res) {
        that.setData({
          nickName: res.data[0].nickName,
          avatarUrl: res.data[0].avatarUrl,
          wechat: res.data[0].wechat,
          advertising: res.data[0].advertising
        })
        wx.hideNavigationBarLoading();//隐藏加载
        wx.stopPullDownRefresh();//停止加载
      }
    })
  },
  addAdervertis: function () {
    wx.navigateTo({
      url: 'addAdvertising/addAdvertising',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this;
    wx.showNavigationBarLoading()
    setTimeout(function () {
      that.onShow();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500);

  },
  goadvertising: function (e) {
    wx.makePhoneCall({
      phoneNumber: '15539794266',
    })
  }
})