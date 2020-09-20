const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    sell1: [],
  },

  onLoad: function (options) {
    var that = this ;
    db.collection("order").where({
      openid: wx.getStorageSync('openid'),
    }).get({
      success: function (res) {
        that.setData({
          sell1: res.data
        })

      }
    })
  },
  goPhone: function (e) {
    const that = this;
    console.log(e)
    db.collection("user").where({
      _openid: e.currentTarget.dataset.id
    }).get({
      success: function (res) {
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

  }
})