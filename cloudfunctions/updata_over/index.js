// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数

const db = cloud.database()
// 云函数入口函数

// event 为调用此云函数传递的参数，传递的参数可通过event.xxx得到

exports.main = async (event, context) => {
    return await db.collection('data').doc(event._id).update({
      data: {
        over: event._over
      }
    })
}