/**
 * 修改用户信息、好友昵称-前端逻辑需求
 *  调用CRUD APi
 *    1.userDetial 用户
 *    2.userUpdate
 *    3.friendMarkName
 *    4.getMarkName
 */

const dbserver = require('../dao/dbserver');

// 用户详情
exports.userDetial = (req, res)=>{
  let { id } = req.body
  dbserver.userDetial(id, res)
}

// 用户信息修改
exports.userUpdate = (req, res)=>{
  let data = req.body   // ???? 为啥body变data了
  // console.log(data)
  dbserver.userUpdate(data, res)
}

// 获取好友昵称
exports.getMarkName = (req, res)=>{
  let data = req.body // 这可能会出问题
  dbserver.getMarkName(data, res)
}

// 修改好友昵称
exports.updateMarkName = (req, res)=>{
  let data = req.body
  dbserver.updateMarkName(data, res)
}

