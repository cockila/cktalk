/**
 * 按需获取用户-前端逻辑需求
 *  调用CRUD APi
 *    1.getFriend 好友列表
 *    2.getLastMsg
 */

const dbserver = require('../dao/dbserver');

//获取好友列表
exports.getFriend = (req, res) =>{
  let data = req.body;
  // console.log(data)
  if(data.state == 0) dbserver.getUsers(data, res)
  else if(data.state == 1) dbserver.getUsers1(data, res)
}

// 获取最后一条消息
exports.getLastMsg = (req, res) =>{
  let data = req.body;
  dbserver.getOneMsg(data, res)
}

// 获取私聊未读消息
exports.unreadMsg = (req, res) =>{
  let data = req.body;
  dbserver.unreadMsg(data, res)
}

// 更新私聊未读消息
exports.updateMsg = (req, res) =>{
  let data = req.body;
  dbserver.updateMsg(data, res)
}
/******************************************* */
//获取群列表
exports.getGroup = (req, res) =>{
  let {uid} = req.body;
  dbserver.getGroup(uid, res)
}

// 获取最后一条群消息
exports.getOneGroupMsg = (req, res) =>{
  let {gid} = req.body;
  dbserver.getOneGroupMsg(gid, res)
}

// 更新群未读消息
exports.updateGroupMsg = (req, res) =>{
  let data = req.body;
  dbserver.updateGroupMsg(data, res)
}