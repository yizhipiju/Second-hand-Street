
App({
  
  globalData: {
    openid: '',
    cartItemNumber: ''
  },
  
  onLaunch: function() {
    var that = this
    
    wx.cloud.init({
      env: "zzlzh-jgxsb"
    })
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log(res)
        db.collection("user").where({
          _openid: res.result.openid
        }).get({
          success: function(res) {
            console.log(res)
            var o = res.data[0]._openid
            that.globalData.openid = o
            wx.setStorageSync('openid', res.data[0]._openid); //存储openid
          }

        })
      }
    })
    that.getDataNumber();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: "zzlzh-jgxsb",
        traceUser: true
      })
    }
    that.timer = setInterval(function() {
      that.scanCart(that)
      that.getDataNumber()
    }, 3000);

  },
  getDataNumber:function(e){
    const db = wx.cloud.database();
    const that = this ;
    db.collection("order").where({
      openid: wx.getStorageSync('openid'),
    }).count({
      success: function (res) {
        that.globalData.cartItemNumber = res.total.toString()
      }
    })
  },
  scanCart: function(e) {
    wx.setTabBarBadge({ //这个方法的意思是，为小程序某一项的tabbar右上角添加文本
      index: 4, //代表哪个tabbar（从0开始）
      text: e.globalData.cartItemNumber
    })
  },

})