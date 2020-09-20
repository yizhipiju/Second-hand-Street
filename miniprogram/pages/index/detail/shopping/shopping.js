const db = wx.cloud.database()
Page({
  data: {
    shopping: [],
    map: '请添加地址...',
    phone:'请输入电话...'
  },
  onLoad: function(e) {
    var that = this
    db.collection('data').where({
        _id: e.id
      })
      .get({
        success: res => {
          that.setData({
            shopping: res.data
          })

        }
      })
  },
  onShow:function(e){
    const that = this;
    db.collection("user").where({
      _openid: wx.getStorageSync('openid')
    }).get({
      success: function (res) {
          that.setData({
            map: res.data[0].map
          })

        if (res.data[0].phone == '' || res.data[0].phone == null) {

          wx.navigateTo({
            url: 'Phone/Phone',
          })
        } else {
          that.setData({
            phone: res.data[0].phone
          })
        }


      }
    })
  },
  goMap: function(e) {
    wx.navigateTo({
      url: 'map/map'
    })
  },
  goPhone: function (e) {
    wx.navigateTo({
      url: 'Phone/Phone'
    })
  },

  right: function(e) {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定需要吗？',
      success: function(res) {
        if (res.cancel) {

        } else {
          //点击确定
          db.collection("order").add({
              data: {
                id: that.data.shopping[0]._id,
                title: that.data.shopping[0].title,
                phone: that.data.phone,
                openid: that.data.shopping[0]._openid,
                time: that.data.shopping[0].time,
                type: that.data.shopping[0].type,
                mode: that.data.shopping[0].mody,
                fileList: that.data.shopping[0].fileList,
                nickName: that.data.shopping[0].nickName,
                avatarUrl: that.data.shopping[0].avatarUrl,
                information: that.data.shopping[0].information,
              }
            }),
            console.log(e.currentTarget.dataset.shopid)

          wx.cloud.callFunction({
            name: 'updata_show',
            data: {
              _id: e.currentTarget.dataset.shopid,
              _show: 'no'
            },
            success: function () {
              console.log("成功")
            }, fail: console.error
          })
          
          wx.navigateTo({
            url: 'success/success',
          })
        }
      }
    })

  },
  goKaifa:function(e){
    wx.makePhoneCall({
      phoneNumber: '15539794266',
    })
  },
  onPullDownRefresh: function() {
    const that = this;
    wx.showNavigationBarLoading()
    setTimeout(function() {
      that.onShow();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500);

  },
})