/**
 * 好友申请、消息-前端逻辑需求
 *  调用CRUD APi
 *    1.applyFriend 好友申请
 *    2.userUpdate
 *    3.friendMarkName
 *    4.getMarkName
 */

const dbserver = require('../dao/dbserver');

// 好友申请
exports.applyFriend = (req, res)=>{
  let data = req.body
  dbserver.applyFriend(data, res)
}

// 好友状态更新（同意）
exports.updateFriendState = (req, res)=>{
  let data = req.body
  dbserver.updateFriendState(data, res)
}

// 好友状态更新（拒绝/删除）
exports.deleteFriend = (req, res)=>{
  let data = req.body
  dbserver.deleteFriend(data, res)
}

