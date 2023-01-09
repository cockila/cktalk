/**
 * socket.io后端连接配置
 */

let dbserver = require('./dbserver')

module.exports = app => {
  
  const server = app.listen(4001)
  const io = require('socket.io').listen(server);
  
  var users = {} // 用户id缓存区
  // 服务器地址
const baseIP = 'http://localhost:4000' 
// const baseIP = 'http://localhost:4000'

  io.on('connection', (socket)=>{

    // 接收-用户登陆注册
    socket.on('login', id => {
      // socket.emit('login', id)// 发送-回复客户端
      socket.name = id      // 以用户id为socket连接名称
      users[id] = socket.id // 每次生成唯一 socket id
    })

    // 接收-私聊消息
    socket.on('msg', (msg, fromid, toid) => {
      console.log(msg)
      // 更新好友最后聊天时间
      dbserver.updateLastMsgTime({uid: fromid,fid: toid})
      // 存储私聊消息到数据库
      if(msg.types == 1){
        msg.message = baseIP+msg.message
        dbserver.insertMsg(fromid, toid,msg.message,msg.types)
      }else {
        dbserver.insertMsg(fromid, toid,msg.msg,msg.types)
      }
      // 发送-to好友
      if(users[toid]){
        socket.to(users[toid]).emit('msg', msg, fromid, 0)
      }
      // 发送-to自己
      socket.emit('msg', msg, toid, 1)
    }) 


    // 接收-用户断开
    socket.on('disconnect', () => {
      if(users.hasOwnProperty(socket.name)){  // 每次进入时看是否有重复名称
        delete users[socket.name]
        console.log(socket.id+'离开')
      }
    
    })

  });
}
