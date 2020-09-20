Page({
  data: {
    height:'',
    cateItems: [
      {
        cate_id: 1,
        cate_name: "电子",
        ishaveChild: true,
        children:
          [
            {
              child_id: 1,
              name: '手机配件',
              image: "https://ae01.alicdn.com/kf/Hda8dcc2406974a50888aad923c0f91fcU.jpg"
            },
            {
              child_id: 2,
              name: '电脑配件',
              image: "https://ae01.alicdn.com/kf/H8c1f1664d0ed4d6aafd2e587591b74acN.jpg"
            },
            {
              child_id: 3,
              name: '会员卡卷',
              image: "https://ae01.alicdn.com/kf/H1ca8f927f7834b9780ddd42c109854d6Q.jpg"
            },
            {
              child_id: 4,
              name: '3C配件',
              image: "https://ae01.alicdn.com/kf/H082d9f87b36045d487f7733c48eff689y.jpg"
            }
          ]
      },
      {
        cate_id: 2,
        cate_name: "生活",
        ishaveChild: true,
        children:
          [
            {
              child_id: 1,
              name: '桌椅家具',
              image: "https://ae01.alicdn.com/kf/Hf7cc566d1d6d4192a59fcd32f653967by.jpg"
            },
            {
              child_id: 2,
              name: '美妆洗护',
              image: "https://ae01.alicdn.com/kf/Ha79a3f377cad460497e96fc4d82f3591N.jpg"
            },
            {
              child_id: 3,
              name: '运动健身',
              image: "https://ae01.alicdn.com/kf/H3dcab3fbbe21499388c17046605b36ebF.jpg"
            },
            {
              child_id: 4,
              name: '代步工具',
              image: "https://ae01.alicdn.com/kf/H0b149feadf97465d9c9e250607f824fdz.jpg"
            },
            {
              child_id: 5,
              name: '蔬果食品',
              image: "https://ae01.alicdn.com/kf/H436f073cc4c549baa19039f71f0ebefcV.jpg"
            },
            {
              child_id: 6,
              name: '医药保健',
              image: "https://ae01.alicdn.com/kf/H8f16cc825c3c43b58dee5f7223302451p.jpg"
            },
            {
              child_id: 7,
              name: '乐器',
              image: "https://ae01.alicdn.com/kf/Hfade25faa3e749d4b67ca87f458e61685.jpg"
            },
            {
              child_id: 8,
              name: '居家用品',
              image: "https://ae01.alicdn.com/kf/Hf9c192f9b99b4500b3edfc74149e3ee6H.jpg"
            }
          ]
      },
      {
        cate_id: 3,
        cate_name: "学习",
        ishaveChild: true,
        children:
          [
            {
              child_id: 1,
              name: '课本资料',
              image: "https://ae01.alicdn.com/kf/H0c34253760004d48a1446f1cbc9e12a9n.jpg"
            },
            {
              child_id: 2,
              name: '课外书籍',
              image: "https://ae01.alicdn.com/kf/H819a4cfc95c14eb5a17bc5d5ef31922bV.jpg"
            },
            {
              child_id: 3,
              name: '办公用品',
              image: "https://ae01.alicdn.com/kf/H63f615008bd54fc39d58331c5d85da57L.jpg"
            }
          ]
      },
      {
        cate_id: 4,
        cate_name: "服饰",
        ishaveChild: true,
        children: [
          {
            child_id: 1,
            name: '男装',
            image: "https://ae01.alicdn.com/kf/H728198360a294fed95b35f8a583b0cfeC.jpg"
          },
          {
            child_id: 2,
            name: '女装',
            image: "https://ae01.alicdn.com/kf/H1215566568a74e2db5a667402b15cd463.jpg"
          },
          {
            child_id: 3,
            name: '鞋子',
            image: "https://ae01.alicdn.com/kf/H8283015eb39a4776b65a49f0f4d532a32.jpg"
          },
          {
            child_id: 4,
            name: '首饰',
            image: "https://ae01.alicdn.com/kf/Hef62abdfdd654fff960eed864ac8cd65f.jpg"
          },
          {
            child_id: 5,
            name: '箱包',
            image: "https://ae01.alicdn.com/kf/Hb2a796882d4f419faa1e023df1051a55H.jpg"
          }
        ]
      }
    ],
    curNav: 1,
    curIndex: 0
  },

  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight-40 + 'px'
    })
  },
}) 