// pages/my/secondHand/secondHand.js
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    shopping_list: {},
  },
  onLoad: function(options) {
    wx.hideShareMenu();
    wx.showLoading({
      title: '加载中...',
    })
    this.getData();
    
  },

  // 获取商品列表
  getData: function(e) {
    var that = this;
    db.collection("data").where({
      _openid: wx.getStorageSync('openid'),
    }).count({
      success: function(res) {
        //获取所有记录条数
        that.data.totalShopping = res.total;
      }
    })
    db.collection('data').where({
      _openid: wx.getStorageSync('openid'),
    }).limit(8).orderBy('data', 'desc').get({
      success: function(res) {
        that.setData({
          shopping_list: res.data,
        })
        that.data.shopping_list = res.data;
      },
      fail: function(event) {}
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1200)
  },

  // 商品详情页
  goShoppingDetail: function(e) {
    let id = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: "/pages/index/detail/detail?id=" + id
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var temp = [];
    if (that.data.shopping_list.length < that.data.totalShopping) {
      try {
        wx.showLoading({
          title: '加载中',
        })
        db.collection('data').where({
          _openid: wx.getStorageSync('openid')
        }).skip(that.data.shopping_list.length).limit(8).orderBy('data', 'desc').get({
          
          success: function(res) {
           
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var tempshopping = res.data[i];
                temp.push(tempshopping);
              }
              var totalshopping = {};
              totalshopping = that.data.shopping_list.concat(temp);
              that.setData({
                shopping_list: totalshopping,
              })
            }
            wx.hideLoading();
          },
          fail: function(event) {
            console.log("======" + event);
          }
        })
      } catch (e) {
        console.error(e);
      }
    } else if (that.data.shopping_list.length >= that.data.totalShopping) {
      wx.showToast({
        title: '已为你加载全部',
        icon: 'none'
      })
    }
  },
})