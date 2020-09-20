const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    order: [],
  },
  onLoad: function (options) {
    var that = this;
    db.collection("order").where({
      _openid: wx.getStorageSync('openid')
    }).orderBy('date', 'desc').get({
      success: function (res) {
        that.setData({
          order: res.data
        })
        wx.hideNavigationBarLoading(); //隐藏加载
        wx.stopPullDownRefresh(); //停止加载
      }
    })
  },

  // 查看订单
  goOrder: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/index/detail/detail?id=' + id,
    })
  },

  // 确认收货
  over: function (e) {
    var that = this;
    that.data.id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '请确认是否已经收货',
      showCancel: true,
      cancelText: '未收货',
      cancelColor: '',
      confirmText: '确认收货',
      confirmColor: '#0bb199',
      complete: function (res) {
        if (res.confirm) {
          db.collection("order").doc(that.data.id).get({
            success: function (ress) {
              console.log(ress)
              db.collection("data").where({
                _id: ress.data.id
              }).get({
                success: function (resss) {
                  console.log(resss.data[0]._id)
                  wx.cloud.callFunction({
                    name: 'updata_over',
                    data: {
                      _id: resss.data[0]._id,
                      _over: 'ok'
                    },
                    success: function () {
                      console.log("成功")
                      db.collection('order').doc(that.data.id).remove({
                        success: function () {
                          that.onPullDownRefresh();
                          wx.showToast({
                            title: '订单完成',
                          })
                        }
                      })
                    },
                    fail: console.error
                  })
                }
              })
            }
          })
        }
      },
    })
  },
  gorelation: function (e) {
    var that = this;
    that.setData({
      openId: e.currentTarget.dataset.id
    })
    db.collection("user").where({
      _openid: that.data.openId
    }).get({
      success: function (res) {
        console.log(res.data[0].wechat)
        that.setData({
          relation: res.data[0].wechat
        })
        if (that.data.relation == null || that.data.relation == '') {
          wx.showModal({
            title: '提示',
            content: '该发布者未提供联系方式，请留言联系发布者提供联系方式',
          })
        } else {
          wx.showModal({
            title: '电话或微信号如下',
            content: that.data.relation,
            confirmText: '复制',
            success(res) {
              if (res.confirm) {
                wx.setClipboardData({
                  data: that.data.relation,
                  success: function (res) {
                    wx.showToast({
                      title: '已复制联系方式',
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  },
})