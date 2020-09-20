let keys = 'SGXBZ-6X3K6-NYLSF-MALZD-QC6PK-BABOS';
let _page, _this;
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customItem: '全部',
    list: [],
    value: '',
    region:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    _this = this;
    wx.getLocation({
      success: function(res) {
        _this.getDistrict(res.latitude, res.longitude)
      },
    })
  },


  getDistrict(latitude, longitude) {
    _page = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.result.address_component.district, res.data.result)

        // 省
        let province = res.data.result.address_component.province;
        // 市
        let city = res.data.result.address_component.city;
        // 区
        let district = res.data.result.address_component.district;

        let community = res.data.result.address_component.street;

        let community1 = res.data.result.address_component.street_number;

        _page.setData({
            district: res.data.result.address_component.district,
            region: [province, city, district, community, community1]
          }),
          _this.getData()
      },fail:function(){
        _page.setData({
          district: res.data.result.address_component.district,
          region: [province, city, '通州区', community, community1]
        })
      }
    })
  },
  getData: function() {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function() {
      wx.hideLoading()
    }, 1000);

    db.collection("advertising").where({
      city: that.data.region[2]
    }).get({
      success: function(res) {
        that.setData({
          list: res.data.reverse()
        })
      }
    })
  },
  onChange: function(e) {
    this.setData({
      value: e.detail
    })
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    this.onPullDownRefresh()
  },
  // 搜索
  onClick: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('advertising').where({
        community: db.RegExp({
          regexp: that.data.value,
          options: 'i',
        })
      }).get({
        success: res => {
          that.setData({
            list: res.data.reverse()
          })

        }
      }),
      setTimeout(function() {
        wx.hideLoading()
      }, 1000);
  },
  onPullDownRefresh: function() {
    const that = this;
    wx.showNavigationBarLoading()
    setTimeout(function() {
      that.getData();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500);
  },
})