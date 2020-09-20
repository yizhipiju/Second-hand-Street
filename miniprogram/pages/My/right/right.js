const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    order: [],
    sell: [],
    sell1: [],
    openId: '',
    openId1: '',
    relation: null,
    phone: null
  },
  onLoad: function(options) {
    wx.hideShareMenu();
    this.getOrder();
  },

  // 获取我的订单
  getOrder: function() {
    var that = this;
    db.collection("order").where({
      _openid: wx.getStorageSync('openid')
    }).orderBy('date', 'desc').get({
      success: function(res) {
        that.setData({
          order: res.data
        })
        wx.hideNavigationBarLoading(); //隐藏加载
        wx.stopPullDownRefresh(); //停止加载
      }
    })
    db.collection("data").where({
        _openid: wx.getStorageSync('openid'),
        show: 'no',
        over: 'ok'
      }).get({
        success: function(res) {
          that.setData({
            sell: res.data
          })

        }
      }),
      db.collection("order").where({
        openid: wx.getStorageSync('openid'),

      }).get({
        success: function(res) {
          that.setData({
            sell1: res.data
          })

        }
      })
  },

  // 查看订单
  goOrder: function(e) {
    var id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/index/detail/detail?id=' + id,
    })
  },

  // 确认收货
  over: function(e) {
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
      complete: function(res) {
        if (res.confirm) {
          db.collection("order").doc(that.data.id).get({
            success: function(ress) {
              console.log(ress)
              db.collection("data").where({
                _id: ress.data.id
              }).get({
                success: function(resss) {
                  console.log(resss.data[0]._id)
                  wx.cloud.callFunction({
                    name: 'updata_over',
                    data: {
                      _id: resss.data[0]._id,
                      _over: 'ok'
                    },
                    success: function() {
                      console.log("成功")
                      db.collection('order').doc(that.data.id).remove({
                        success: function() {
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
  goPhone: function(e) {
    const that = this;
    console.log(e)
    db.collection("user").where({
      _openid: e.currentTarget.dataset.id
    }).get({
      success: function(res) {
        console.log(res.data)
        that.setData({
          phone: res.data[0].phone
        })
        if (that.data.phone == null || that.data.phone == '') {
          wx.showModal({
            title: '提示',
            content: '该发布者未提供联系电话，请留言联系发布者提供联系方式',
          })
        } else {
          wx.showModal({
            title: '电话号码如下',
            content: that.data.phone,
            confirmText: '拨打',
            success(res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: that.data.phone,
                })
              }
            }
          })
        }
      }
    })

  },
  gorelation: function(e) {
    var that = this;
    that.setData({
      openId: e.currentTarget.dataset.id
    })
    db.collection("user").where({
      _openid: that.data.openId
    }).get({
      success: function(res) {
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
                  success: function(res) {
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    const that = this;
    wx.showNavigationBarLoading()
    setTimeout(function() {
      that.onLoad();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500);

  },
})