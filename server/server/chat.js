/**
 * 分页查询-前端逻辑需求
 *  调用CRUD APi
 *    1.applyFriend 好友申请
 */

const dbserver = require('../dao/dbserver');

exports.msg = (req, res)=>{
  let data = req.body
  // console.log(data)
  dbserver.msg(data, res)
}