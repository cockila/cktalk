/**
 * token解析文件
 */

const jwt = require('jsonwebtoken');
const secret = 'yoursecret'   // 自定义随机令牌

// 生成token
exports.generateToken = (id, res)=>{
  let payload = { id, time: new Date()}
  let token = jwt.sign(payload, secret, { expiresIn: 60*60*24*120 });  // 到期时间限制

  return token
}

// 解析token
exports.verifyToken = e => {

  let payload
  jwt.verify(e, secret, (err, result)=>{
    if(err){
      payload = 0
    } else {
      payload = 1
    }
  })
  return payload
}