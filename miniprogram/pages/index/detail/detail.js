const app = getApp();
const db = wx.cloud.database();
var barrage_style_arr = [];
var barrage_style_obj = {};
var phoneWidth = 0;
var timers = [];
var timer;
Page({
  data: {
    shopping_list: {},
    user_list: {},
    userInfo: {},
    comment_list: {},
    shopName: '',
    shopPhoto: '',
    id: '',
    remove: false,
    openId: '',
    show: false,
    comment: '',
    comment_id: '',
    latitude: null,
    longitude: null,
    juli: '请打开位置服务',
    show1: false,
    myShoppingCount: ''
  },
  goHerShopping: function(e) {
    var that = this;
    wx.navigateTo({
      url: "HerShopping/HerShopping?openid=" + that.data.openId,
    })
  },
  onChange(event) {

    const that = this;
    console.log(event)
    wx.cloud.callFunction({
      name: 'add_love',
      data: {
        _id: event.currentTarget.dataset._id
      },
      success: function() {
        console.log("成功")
      },
      fail: console.error
    })
  },
  aiteWho: function(e) {
    console.log(e.currentTarget.dataset.name)
    const that = this;
    that.setData({
      comment: '@' + e.currentTarget.dataset.name + ','
    })
  },
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    wx.hideShareMenu();
    var that = this;
    var id = options.id;
    var that = this;
    that.data.comment_id = id;
    that.data.id = id;
    //获取用户信息
    wx.showLoading({
      title: '加载中...',
    })
    wx.getUserInfo({
        success: function(res) {
          that.setData({
            userInfo: res.userInfo
          })
        }
      }),
      db.collection('data').doc(id).get({
        success: function(res) {
          that.data.openId = res.data._openid
          console.log(res)
          that.setData({
            openId: res.data._openid,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            shopping_list: res.data,
          })
          db.collection("user").where({
            _openid: that.data.openId
          }).get({
            success: ress => {
              that.setData({
                user_list: ress.data
              })
            }
          })
          if (res.data._openid === wx.getStorageSync('openid')) {
            that.setData({
              remove: true
            })
          }
          that.getcomment(that.data.id)
          that.findXy();
          db.collection("data").where({
            _openid: that.data.openId
          }).count({
            success: function(res) {
              console.log(res)
              //获取所有记录条数
              that.setData({
                myShoppingCount: res.total
              })
            }
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 1200)

        }
      })
  },
  findXy() { //获取用户的经纬度
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res.longitude)
        console.log(res.latitude)
        _this.getDistance(res.latitude, res.longitude, _this.data.latitude, _this.data.longitude)
      }
    })
  },

  Rad: function(d) { //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },
  getDistance: function(lat1, lng1, lat2, lng2) {
    const that = this;
    // lat1用户的纬度
    // lng1用户的经度
    // lat2商家的纬度
    // lng2商家的经度
    var radLat1 = that.Rad(lat1);
    var radLat2 = that.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = that.Rad(lng1) - that.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(2) + '公里' //保留两位小数
    that.setData({
      juli: s
    })
    console.log('经纬度计算的距离:' + s)

    return s
  },
  // 预览图片
  previewImg: function(e) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var img = that.data.shopping_list.fileList;
    var current = e.target.dataset.src;
    // 给图片逐个命名
    var imgArr = [];
    var objkeys = Object.keys(img);
    for (let i = 0; i < objkeys.length; i++) {
      imgArr.push(that.data.shopping_list.fileList[i]);
    }
    wx.previewImage({
      current: current,
      urls: imgArr,
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 500)
  },
  kefu: function(e) {
    wx.makePhoneCall({
      phoneNumber: '15539794266',
    })
  },
  //下架商品
  remove: function(e) {
    var that = this;
    let fileId = e.currentTarget.dataset.fileid;
    that.data.id = e.currentTarget.dataset.shopid;
    wx.showModal({
      title: '提示',
      content: '确认下架该商品？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: 'black',
      confirmText: '下架',
      confirmColor: 'red',
      success: function(res) {
        if (res.confirm) {
          db.collection("deleteFile").add({
            data: {
              images: fileId,
            },
            success: function() {
              db.collection('data').doc(that.data.id).remove({
                success: res => {
                  wx.showToast({
                    title: '下架成功',
                  })
                  wx.navigateBack({
                    delta: 1,
                  })
                },
                fail: err => {
                  wx.showToast({
                    icon: 'none',
                    title: '下架失败',
                  })
                },
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 生成订单
  goShopping: function(e) {
    const that = this
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
          } else {
            if (that.data.shopping_list.show == 'yes') {
              wx.navigateTo({
                url: "shopping/shopping?id=" + e.currentTarget.id
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '该商品已被购买',
              })
            }
          }
        })

      }
    })
  },
  formSubmit: function(e) {

    const that = this;
    wx.showLoading({
      title: '提交中...',
    })
    console.log(e)
    console.log(that.data.shopping_list._id)
    console.log(that.data.userInfo.nickName)
    db.collection('comment').add({
        data: {
          id: that.data.shopping_list._id,
          comment: e.detail.value.comment,
          user_name: that.data.userInfo.nickName,
          user_image: that.data.userInfo.avatarUrl,
          number: 0,
          value: false
        },
        success: function(res) {
          wx.hideLoading();
          wx.showToast({
            title: '评论成功'
          })
        },
      }),
      that.getcomment()
  },
  getcomment: function(e) {
    var that = this;
    console.log(that.data.comment_id)
    db.collection('comment').where({
      id: that.data.comment_id
    }).get({
      success: function(res) {
        console.log(res)
        that.setData({
          comment_list: res.data.reverse(),
        })
        that.data.comment_list = res.data;
      },
      fail: function(event) {}
    })
  },
  clearInputEvent: function(e) {
    this.setData({
      comment: ''
    })
  },
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