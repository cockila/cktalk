/**
 * 搜索页面-前端逻辑需求
 *  调用CRUD APi
 *    1.searchUser 用户
 *    2.isFriend
 *    3.searchGroup
 *    4.isInGroup
 */

const dbserver = require('../dao/dbserver');

// 用户搜索
exports.searchUser = (req, res) => {
  let { data } = req.body
  dbserver.searchUser(data, res)
}
// 是否为好友
exports.isFriend = (req, res) => {
  let { uid, fid } = req.body
  dbserver.isFriend(uid, fid, res)
}

// 群搜索
exports.searchGroup = (req, res) => {
  let { data } = req.body
  dbserver.searchGroup(data, res)
}
// 是否在群内
exports.isInGroup = (req, res) => {
  let { uid, gid } = req.body
  dbserver.isInGroup(uid, gid, res)
}
