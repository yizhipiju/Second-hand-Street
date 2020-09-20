const db = wx.cloud.database()
Page({
  data: {
    shopping_list: [],
    dataSum: null,
    value: ''
  },
  //数据库查询数据
  onLoad: function(e) {
    var that = this;

    wx.showShareMenu({
      withShareTicket: true
    })
    db.collection("data").where({
      over: 'no',
      show: 'yes',
      display: true
    }).count({
      success: function(res) {
        console.log(res)
        //获取所有记录条数
        that.data.dataSum = res.total;
      }
    })
    db.collection('data').where({
      over: 'no',
      show: 'yes',
      display: true
    }).limit(8).orderBy('time', 'desc').get({
      success: function(res) {
        that.setData({
          shopping_list: res.data,
        })
        that.data.shopping_list = res.data;
      },
      fail: function(event) {}
    })
  },
  // 搜索页
  goSearch: function(e) {
    let label = e.currentTarget.dataset.label;
    wx.navigateTo({
      url: "../search/search"
    })
  },
  //下拉刷新

  onPullDownRefresh: function() {
    const that = this;
    wx.showNavigationBarLoading()
    setTimeout(function() {
      that.onLoad();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  gohanfu: function(e) {
    wx.navigateTo({
      url: '../search/search?title=汉服',
    })
  },
  goshoushi: function(e) {
    wx.navigateTo({
      url: '../search/search?title=手饰',
    })
  },
  gophone: function(e) {
    wx.navigateTo({
      url: '../search/search?title=手机',
    })
  },
  gohuazhuang: function(e) {
    wx.navigateTo({
      url: '../search/search?title=化妆品',
    })
  },
  godianqi: function(e) {
    wx.navigateTo({
      url: '../search/search?title=电器',
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var temp = [];
    if (that.data.shopping_list.length < that.data.dataSum) {
      try {
        wx.showLoading({
          title: '加载中',
        })
        db.collection('data').skip(that.data.shopping_list.length).limit(8).orderBy('time', 'desc').where({
          over: 'no',
          show: 'yes',
          display: true
        }).get({

          success: function(res) {

            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var tempshopping = res.data[i];
                temp.push(tempshopping);
              }
              var dataSum = {};
              dataSum = that.data.shopping_list.concat(temp);
              that.setData({
                shopping_list: dataSum,
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
    } else if (that.data.shopping_list.length >= that.data.dataSum) {
      wx.showToast({
        title: '已为你加载全部',
        icon: 'none'
      })
    }
  },
})