/**
 * 新建文件目录
 */

const fs = require('fs')
const path = require('path')

exports.mkdirs = function (pathname, callback) {
  // 判断是否为绝对路径
  pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname)
  // 获取相对路径
  pathname = path.relative(__dirname, pathname)
  let floders = pathname.split(path.sep)
  let pre = ''
  floders.forEach(floder=>{
    try {
      let _stat = fs.statSync(path.join(__dirname, pre, floder))
      let hasMKdir = _stat && _stat.isDirectory()
      if (hasMKdir) {
        callback
      } 
    } catch (error) {
      try {
        fs.mkdirSync(path.join(__dirname, pre, floder))
        callback && callback(null)
      } catch (error) {
        callback && callback(error)
      }
    }
    pre = path.join(pre, floder)
  })
}
