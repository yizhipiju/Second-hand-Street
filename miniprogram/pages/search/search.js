// pages/main/mainSon/mainSon.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label: '',
    shopping_list: [],
    goDetail: "goShoppingDetail",
    dataSum: 0,
    ff: true
  },
//下拉刷新

  onPullDownRefresh: function () {
    const that = this;
    wx.showNavigationBarLoading()
    setTimeout(function () {
      that.onLoad();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  //数据库查询数据
  onShow: function(e) {
    var that = this;

  },

  onLoad: function(e) {
    const that = this
    console.log(e)
    that.setData({
      label: e.title
    })
    if (that.data.label == '' || that.data.label == null) {
      wx.showLoading({
        title: '加载中...',
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
      }).limit(8).orderBy('title', 'desc').get({
        success: function(res) {
          that.setData({
            shopping_list: res.data,
          })
          that.data.shopping_list = res.data;
          
          wx.hideLoading();
            if (res.data.length <= 0 ) {
              that.setData({
                ff: false
              })
            }
        },
        fail: function(event) {}
      })
    } else {
      that.search();
    }
  },
  // 获取输入数据
  searchInput: function(e) {
    this.data.label = e.detail.value
  },


  // 搜索
  search: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('data').where({
      //使用正则查询，实现对搜索的模糊查询
      title: db.RegExp({
        regexp: that.data.label,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length <= 0) {
          that.setData({
            ff: false
          })
        }
        that.setData({
          shopping_list: res.data
        })
        wx.hideLoading();
      }
      
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
        db.collection('data').skip(that.data.shopping_list.length).limit(8).orderBy('title', 'desc').where({
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
  }
})