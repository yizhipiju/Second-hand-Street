Page({
  data: {
    height: '0px'
    


  },
  
  
  onLoad: function (e) {
     this.setData({
       height: wx.getSystemInfoSync().windowHeight + 'px'
     })
   }
})
