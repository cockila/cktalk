/**
 * 登陆页面-前端逻辑需求
 *  调用CRUD APi
 *    1.userMatch 查询验证用户
 *    
 */

const dbserver = require('../dao/dbserver');
const jwt = require('../dao/jwt')

// 验证登陆
exports.signIn = (req, res) => {
  let { data, psw } = req.body;
  dbserver.userMatch(data, psw, res)
}

// // 匹配token
// exports.testToken = (req, res) => {
//   let { token } = req.body
//   let jg = jwt.verifyToken(token)
//   res.send(jg)
// }
