const db = wx.cloud.database()
Page({
  data: {
    detailList:[],
    shangjiaPhone:''
  },
  onLoad:function(e){
    const that = this ;
    console.log(e)
    db.collection("advertising").where({
      _id: e.id
    }).get({
      success: function (res) {
        console.log(res)
        that.setData({
          detailList: res.data[0],
          shangjiaPhone:res.data[0].phone
        })
      }
    })
  },
  bodaPhone:function(e){
    const that = this ;
    wx.makePhoneCall({
      phoneNumber: that.data.shangjiaPhone,
    })
  },
  // 预览图片
  previewImg: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var img = that.data.detailList.fileList;
    var current = e.target.dataset.src;
    // 给图片逐个命名
    var imgArr = [];
    var objkeys = Object.keys(img);
    for (let i = 0; i < objkeys.length; i++) {
      imgArr.push(that.data.detailList.fileList[i]);
    }
    wx.previewImage({
      current: current,
      urls: imgArr,
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
  },
  onPullDownRefresh: function () {
    const that = this;
    wx.showNavigationBarLoading()
    setTimeout(function () {
      that.onLoad();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500);
  },
})