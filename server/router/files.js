/**
 * 文件处理路由
 *  用户头像、群头像、聊天图片
 */

const multer = require('multer')
const mkdir = require('../dao/mkdir')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let {url} = req.body  // 前端提供文件保存路径
    mkdir.mkdirs('../data/'+url, err=>{
      console.log(err)
    })
    cb(null, './data/'+url)  // 保存文件
  },
  filename: function (req, file, cb) {
    let {name} = req.body // 前端处理好文件名
    // console.log(name)
    // 正则匹配后缀名
    let type = file.originalname.replace(/.+\./,".")
    cb(null, name+type)
  }
})

var upload = multer({ storage: storage })

module.exports = function(app) {
  // 前端文件上传
  app.post('/files/upload', upload.array('file', 10), function (req, res, next) {
    // 路径
    let {url} = req.body
    // 获取文件名
    let name = req.files[0].filename
    
    let imgurl = '/'+url+'/'+name

    // 返回前端
    res.send(imgurl)
  })
}