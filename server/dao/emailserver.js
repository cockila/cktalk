/**
 * 邮箱
 */

// 引入插件
const nodeMailer = require('nodemailer')
// 证书文件
const credentials = require('../config/credential')

// 创建传输方式
const transporter = nodeMailer.createTransport({
  service: 'qq',
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass
  }
})

exports.emailSignUp = (email, res)=>{
  // 发送内容
  let options = {
    from: '2421662954@qq.com',
    to: email,
    subject: '注册通知',
    html: '<span>您已在italk注册账号成功，快开始使用吧！</span><br/><a href="http://localhost:8080">点击登录</a>'
  }

  // 发送邮件
  transporter.sendMail(options, (err, msg)=>{
    if(err) {
      res.send('发送邮件失败')
    } else {
      res.send('发送邮件成功！')
    }
  })
}