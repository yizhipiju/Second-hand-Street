const db = wx.cloud.database()
const data = db.collection('advertising')
const _ = db.command
var util = require('../../../util/data.js')
var TIME = util.formatTime(new Date())
const app = getApp();

Page({
  data: {
    countryIndex: 0,
    accountIndex: 0,
    phone:'',
    city:'',
    content: '', //内容
    date: TIME,
    fileList: [],
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
  },
 
  // 删除照片 &&
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },

  // 选择图片 &&&
  addPic1: function (e) {
    var imgbox = this.data.imgbox;
    console.log(imgbox)
    var that = this;
    var n = 5;
    if (5 > imgbox.length > 0) {
      n = 5 - imgbox.length;
    } else if (imgbox.length == 5) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (5 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },

  //图片
  imgbox: function (e) {
    this.setData({
      imgbox: e.detail.value
    })
  },


  //发布按钮
  formSubmit: function (e) {
    const that = this
    if (e.detail.value.title == '' || !this.data.imgbox.length) {
      wx.showModal({
        title: '提示',
        content: '没标题或没照片',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {

      let promiseArr = [];
      for (let i = 0; i < this.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.imgbox[i];
          let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {

              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              console.log(res.fileID) //输出上传后图片的返回地址
              reslove();
              wx.hideLoading();

            },
            fail: res => {
              wx.hideLoading();

            }

          })
        }));
      }
      Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({
          imgbox: []
        })

        that.fb(e)
      })

    }
  },
  //  添加数据到数据库
  fb: function (event) {
    var that = this

    wx.showLoading({
      title: '提交中...',
    })
    data.add({
      data: {
        title: event.detail.value.title,
        community: event.detail.value.community,
        time: that.data.date,
        phone: event.detail.value.phone,
        city: event.detail.value.city,
        fileList: that.data.fileIDs,
        information: event.detail.value.information,
      },
      success: function (res) {
        wx.showToast({
          title: '提交成功'
        })
        that.setData({
          fileIDs: []
        })
        wx.navigateBack({
          delta: 2
        })
      },

    })
  },

  clearInputEvent: function (e) {
    this.setData({
      title: '',
      content: '',
      community: '',
      phone:'',
      city:''
    })
  }
})