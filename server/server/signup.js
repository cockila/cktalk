/**
 * 注册页面-前端逻辑需求
 *  调用CRUD APi
 *    1.buildUser 注册用户
 *    2.countDocument 匹配用户/邮箱是否存在
 */

const dbserver = require('../dao/dbserver');
const emailserver = require('../dao/emailserver')

// 注册用户
exports.signUp = (req, res)=>{
  let { name, mail, psw } = req.body
  // res.send({name,mail, pwd})
  emailserver.emailSignUp(mail,res) // 发送邮件
  dbserver.buildUser(name, mail, psw, res) 
}

// 用户邮箱是否存在匹配
exports.judgeValue = (req, res)=>{
  let { data, type } = req.body
  // res.send({data,type})
  dbserver.countUserValue(data, type, res)
}