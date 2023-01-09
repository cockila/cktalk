/**
 * 密码加密与解密
 */

const bcrypt = require('bcryptjs')

/**
 * 生成加密
 * @param {用户输入密码} e 
 * @returns 
 */
exports.encryption = e => {
  // 生成随机salt
  let salt = bcrypt.genSaltSync(10)
  // 生成hash密码
  let hash = bcrypt.hashSync(e, salt)
  return hash
}

/**
 * 解密方法
 * @param {用户输入密码} e 
 * @param {数据库密码} hash 
 * @returns 解密密码
 */
exports.verification = (e, hash) => {
  let verify = bcrypt.compareSync(e, hash)
  return verify
}