/**
 * 检查token是否有效
 */

const jwt = require('../dao/jwt')

module.exports = function(app) {
  app.use((req, res, next) => {
    if(typeof(req.body.token) != 'undefined') {
      // 处理token匹配
      let  token  = req.body.token
      let tokenMatch = jwt.verifyToken(token)
      if(tokenMatch === 1) {
        next(); // 通过验证
      } else {
        res.send({status: 300}) // 不通过
      }
      console.log("测试："+tokenMatch)
      res.send({result: tokenMatch})

    }else {
      next()
    }
  })
}
