<template>
	<view class="contents animate__animated animate__fadeInRightBig animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<view @click="backOnePage" class="top-bar-left">
				<i class="iconfont icon-xiazai6"></i>
			</view>
			<view class="top-bar-center">
				<view class="title">{{fname}}</view>
			</view>
			<!-- <view class="top-bar-right">
				<view class="pice"></view> 
				<view class="group-img" v-if="type == 0" @tap="goUserdetials">
					<image :src="fimgurl"></image>
				
				</view>
			</view> -->
		</view>
		
		<!-- main -->
		<scroll-view class="chat" 
								 :scroll-with-animation="scrollAnimation" 
								 scroll-y="true" 
								 :scroll-into-view="scrollToView"
								 @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<!-- 加载中 -->
				<view :animation="animationData1"
							class="loading"
							:class="{displaynone:isloading}">
					<i class="iconfont icon-jiazaizhong8"></i>
				</view>
				
				<view class="chat-ls" 
						  v-for="(item, index) in msgs" 
							:key='index'
							:id="'msg'+item.id">
					
					<view v-if="item.time !== ''" class="chat-time">{{changeTime(item.time)}}</view>
					
					<!-- 好友消息 -->
					<view class="msg-m msg-left" v-if="item.fromId !== uid">
						<navigator :url="'../userhome/userhome?id='+fid">
							<image class="user-img" :src="item.imgurl" mode=""></image>
						</navigator>
						<!-- 图像消息 -->
						<view v-if="item.types == 1" class="message">
							<image @tap="previewImg(item.message)" class="msg-img" :src="item.message" mode="widthFix"></image>
						</view>
						<!-- 文字消息 -->
						<view v-if="item.types == 0" class="message animate__animated animate__fadeIn animate__faster">
							<view  class="msg-text">{{item.message}}</view>
						</view>
						<!-- 音频消息 -->
						<view v-if="item.types==2" class="message">
							<view @tap="playVoice(item.message.voice)" class="msg-text voice" :style="{width:item.message.time*3.5+'px'}">
								<i class="iconfont icon-yuyin1" :class="{'isActive':isPlay}"></i>
								<span>{{item.message.time}}″</span>
							</view>
						</view>
						<!-- 位置消息 -->
						<view v-if="item.types==3" class="message">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-addr">{{item.message.address}}</view>
								<map class="map" 
										 :markers="covers(item.message)"
										 :latitude="item.message.latitude" 
										 :longitude="item.message.longitude"></map>
							</view>
						</view>
					</view>
					
					<!-- 本人消息 -->
					<view class="msg-m msg-right" v-if="item.fromId === uid">
						<navigator :url="'../userhome/userhome?id='+uid">
							<image class="user-img" :src="item.imgurl" mode=""></image>
						</navigator>
						
						<!-- 图片消息 -->
						<view v-if="item.types == 1" class="message animate__animated animate__fadeIn animate__faster">
							<image @tap="previewImg(item.message)" class="msg-img" :src="item.message" mode="widthFix"></image>
						</view>
						<view v-if="item.types == 0" class="message">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<!-- 音频消息 -->
						<view v-if="item.types==2" class="message">
							<view  @tap="playVoice(item.message.voice)" class="msg-text voice" :style="{width:item.message.time*3.5+'px'}">
								<i class="iconfont icon-yuyin1" :class="{'isActive':isPlay}"></i>
								<span>{{item.time}}″</span>
							</view>
						</view>
						<!-- 位置消息 -->
						<view v-if="item.types==3" class="message">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-addr">{{item.message.address}}</view>
								<map class="map" 
										 :markers="covers(item.message)"
										 :latitude="item.message.latitude" 
										 :longitude="item.message.longitude"></map>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<submit @inputs='inputs' @heights="heights"></submit>
	</view>
</template>

<script>
	import submit from '../../components/submit/submit.vue'
	import datas from '../../commons/js/datas.js'
	import myfun from '../../commons/js/myfun.js'
	
	const innerAudioContext = uni.createInnerAudioContext()
	export default {
		data() {
			return {
				msgs: [],
				msgImgArr: [],
				
				oldTime: 0,
				scrollToView: '',
				inputh: '60',
				isPlay: false,
				animationData1: {},
				animation: {},
				loading: '',
				isloading: true,
				scrollAnimation: true,
				beginLoading: true,
				
				uid: '',	// 缓存数据
				uimgurl: '',
				token: '',
				uname: '',
				
				fid: '',	// 路由参数
				fname: '',
				type: '',	// 1:群、2：好友
				fimgurl: '',
				
				pageSize: 10, // 每页消息数
				nowPage: 0,
			};
		},
		components:{
			submit,
		},
		onLoad:function(e) {
			this.fid = e.id
			this.fname = e.name
			this.type = e.type	// 私聊/群聊
			this.fimgurl = e.img

			this.getStorages()
			this.getMsg()
			// this.receiveSocketMsg()
			this.receiveSocketMsg()
			// this.grouSocket()
			// this.nextPage()
		
		},
		methods:{
			// 获取缓存数据
			getStorages:function() {
				try{
					const value = uni.getStorageSync('user')
					if(value) {
						this.uid = value.id
						this.uimgurl = this.serverUrl+'/'+ value.imgurl
						this.token = value.token
						this.uname = value.name
					}else {
						uni.navigateTo({
							url: '../signin/signin',
						})
					}
					
					// console.log(value)
				}catch(e){
					//TODO handle the exception
				}
			},
			// 获取聊天数据
			getMsg () {
				uni.request({
					url: this.serverUrl+'/chat/msg',
					data:{
						uid: this.uid,	
						fid: this.fid,
						nowPage: this.nowPage,
						pageSize: this.pageSize,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						
						if(status===200){
							let msg = data.data.result
							msg.reverse()
							
							if(msg.length>0){
								let oldtime = msg[0].time
								let imgarr = []
								
								msg[0].imgurl = this.serverUrl+msg[0].imgurl
								for(let i=1; i<msg.length ;i++){
									let item = msg[i]
									// 时间间隔处理
									if(i<msg.length-1) 
									{
										let t=myfun.spacTime(oldtime,item.time)
										if(t) {
											oldtime = t
										}
										item.time = t
									}
									// 匹配最大时间
									if(this.nowPage===0){
										if(item.time>this.oldTime){
											this.oldTime = item.time
										}
									}
									// 补充图片地址
									if(item.types === 1) {
										item.message = this.serverUrl+item.imgurl
										// imgarr.push(item.message)
										this.msgImgArr.unshift(item.message)
									}
									// if(item.types === 2) {
									// 	item.message = this.serverUrl+item.time
									// 	// imgarr.push(item.message)
									// 	this.msgImgArr.unshift(item.message)
									// }
									// json字符还原
									if(item.types === 3) {
										item.message = JSON.parse(item.message)
									}
									
									item.imgurl = this.serverUrl+item.imgurl
									
									// 倒序放入
									// this.msgs.unshift(item)
								}
								console.log("1111")
								this.msgs = msg.concat(this.msgs)
								this.msgImgArr = imgarr.concat(this.msgImgArr)
							}
							// console.log(this.msgs)
							// 计算当前页消息数,更新当前页数
							if(msg.length === 10){
								this.nowPage++ // 下一页
							} else {
								this.nowPage = -1 //获取完毕
							}
							
							// 页数加一
							this.$nextTick(function(){
								this.scrollAnimation = false
								this.scrollToView = 'msg' + this.msgs[msg.length-1].id
							})
							clearInterval(this.loading)
							this.loading = true
							this.beginLoading = true // 可加载
							// console.log(res)
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})

			},
			
			// 下拉刷新
			nextPage () {
				if(this.nowPage>0 && this.beginLoading){
					this.loading = false	// loading图标显示
					this.beginLoading = false // 禁止重复加载
					
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'ease',
					})
			
					this.animation = animation
					this.animationData1 = animation.export()
					let i=1
					this.loading=setInterval(function() {
						animation.rotate(i*20).step()
						this.animationData1 = animation.export()
						i++
						// 下拉加载
						this.getMsg(this.nowPage)
						
						
					}.bind(this), 60)
				}
				
			},
			// 地图位置标点
			covers(e){
				return [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/pos.png'
				}]
				
			},
			// 点击地图
			openLocation(e) {
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name: e.name,
					address:e.address,
					success: function () {
						console.log('success');
					}
				});
			},
			// 处理时间
			changeTime(date){
				return myfun.dataTime1(date)
			},
			// 预览图片
			previewImg(e){
				let thisIndex = 0
				
				this.msgImgArr.map((item, index)=> {
					
					if(this.msgImgArr[index]===e) {
						thisIndex = index
					}
				})
				// console.log(this.msgImgArr, this.msgs)
				// 预览图片
				uni.previewImage({
					
					current: thisIndex,
					urls: this.msgImgArr,
					longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏'],
							success: function(data) {
									// console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							},
							fail: function(err) {
									// console.log(err.errMsg);
							}
					}
				});
			},
			// 接收输入框内容
			inputs(e) {
				this.receiveMsg(e, this.uid, this.uimgurl, 0)
				
				this.ToBottom()
			}	,
			// 接收输入框消息
			receiveMsg(e, id, img, tip) {
				// tip:0自己发送， 1 好友发的
				
				// socket提交
				if(e.types === 0 || e.types===3){	// 发送-文字/地图消息
					this.sendSocket(e)
				}
				if(e.types === 1) {	// 发送-图片消息
					this.msgImgArr.push(e.msg)
					// 提交图片
					let url = myfun.fileName(new Date())	// 当天的文件夹名
					const uploadTask = uni.uploadFile({
							url: this.serverUrl+'/files/upload', //仅为示例，非真实的接口地址
							filePath: e.msg,
							name: 'file',
							formData: {
								'url': url,	// 每天建一个文件夹
								name: new Date().getTime()+this.uid+Math.ceil(Math.random()*10)		//文件名
							},
							success: (uploadFileRes) => {
								let data = {	// 存储到服务器的图片消息数据
									message: uploadFileRes.data,
									types: e.types
								}
								
								this.sendSocket(data)
							}
						});
				}
				if(e.types === 2) {	// 发送-音频消息
					let url = myfun.fileName(new Date())	// 当天的文件夹名
					const uploadTask = uni.uploadFile({
							url: this.serverUrl+'/files/upload', //仅为示例，非真实的接口地址
							filePath: e.msg.voice,
							name: 'file',
							formData: {
								'url': url,	// 每天建一个文件夹
								name: new Date().getTime()+this.uid+Math.ceil(Math.random()*10)		//文件名
							},
							success: (uploadFileRes) => {
								let data = {	// 存储到服务器的图片消息数据
									message: uploadFileRes.data,
									types: e.types,
									time:nowTime
								}
								
								this.sendSocket(data)
							}
						});
				}
				
				// console.log(e)
				this.scrollAnimation = true
				// 时间间隔处理
				let nowTime = new Date()
				let t=myfun.spacTime(this.oldTime, nowTime)
				if(t) {
					this.oldTime = t
				}
				
				nowTime = t
				if(e.types == 3){
					e.msg = JSON.parse(e.msg)
				}
				let newMsg = {
							fromId: id,
							types: e.types,
							imgurl: img,
							id: this.msgs.length,
							time: nowTime,
							message: e.msg
				}
				this.msgs.push(newMsg)

			}	,
			// 聊天数据发送到后端-socket
			sendSocket(e){
				if(this.type == 0){	// 私聊
					this.socket.emit('msg', e, this.uid, this.fid)
				}else {		// 群聊
					this.socket.emit('groupMsg', e,this.uid, this.fid,this.uname,this.uimgurl)
				}
			},
			// 接收好友发来的消息-socket
			receiveSocketMsg(){
				this.socket.on('msg', (msg, fromid, toWho)=>{
				// toWho: 0，好友接收
					if(fromid == this.fid && toWho == 0){
						this.scrollAnimation = true
						// 时间间隔处理
						let nowTime = new Date()
						let t=myfun.spacTime(this.oldTime, nowTime)
						let newMsg
						if(t) {
							this.oldTime = t
						}
						nowTime = t
						newMsg = {
									fromId: fromid,
									types: msg.types,
									imgurl: this.fimgurl,
									id: this.msgs.length,
									time: nowTime,
									message: msg.msg
						}
						if(msg.types == 1 || msg.types == 2){
							// console.log("接收的消息为",msg)
							newMsg = {
										fromId: fromid,
										types: msg.types,
										imgurl: this.fimgurl,
										id: this.msgs.length,
										time: nowTime,
										message: msg.message
							}
							
							if(msg.types == 1){
								console.log(msg)
								this.msgImgArr.push(msg.message)
							}
							
						}
						// console.log('插入的消息为:',newMsg)
						this.msgs.push(newMsg)
						this.ToBottom()	// 刷新高度
					}
					
				})
			},
			//群聊天数据接收
			groupSocket(){
				this.socket.on('groupmsg', (msg, fromid, name,img)=>{
				// toWho: 0，好友接收
					if(fromid == this.fid){
						this.scrollAnimation = true
						// 时间间隔处理
						let nowTime = new Date()
						let t=myfun.spacTime(this.oldTime, nowTime)
						let newMsg
						if(t) {
							this.oldTime = t
						}
						nowTime = t
						newMsg = {
									fromId: fromid,
									types: msg.types,
									imgurl: img,
									id: this.msgs.length,
									time: nowTime,
									message: msg.msg
						}
						if(msg.types == 1 || msg.types == 2){
							// console.log("接收的消息为",msg)
							newMsg = {
										fromId: fromid,
										types: msg.types,
										imgurl: this.fimgurl,
										id: this.msgs.length,
										time: nowTime,
										message: msg.message
							}
							
							if(msg.types == 1){
								console.log(msg)
								this.msgImgArr.push(msg.message)
							}
						}
						// console.log('插入的消息为:',newMsg)
						this.msgs.push(newMsg)
						this.ToBottom()	// 刷新高度
					}
					
				})
			},
			// 播放音频
			playVoice(e){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = e
				innerAudioContext.onPlay(() => {
				  // this.isPlay = true
				});
			
			},
			// 接收输入框高度
			heights(e) {
				this.inputh = e
				this.ToBottom()
			},
			// 消息自动定位到（最后一条）
			ToBottom () {
				this.scrollAnimation = true
				this.scrollToView=''
				this.$nextTick(function(){
					this.scrollToView = 'msg' + this.msgs[this.msgs.length-1].id
				})
			},
			// 返回上一页
			backOnePage() {
				// uni.navigateBack({
				// 	delta:1
				// })
				uni.navigateTo({
					url:'../index/index?gid=' + this.fid + '&gimg='+this.fimgurl
				})
			},
			goGroupHome:function(){
				uni.navigateTo({
					url:'../grouphome/grouphome?gid=' + this.fid + '&gimg='+this.fimgurl
				})
			},
			goUserdetials:function(){
				uni.navigateTo({
					url:'../userdetials/userdetials?gid=' + this.fid + '&gimg='+this.fimgurl
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
	
	// page {
	// 	height: 100%;
	// 	background: rgba(244,244,244,1);
	// }
	.contents {
		height: 100vh;
		background: rgba(244,244,244,1);
	}
	/* 顶部 */
	.top-bar {
		background: $uni-color-primary;
		.top-bar-left {
			width: 88rpx;
			height: 100%;
			float: left;
			// padding-left: 10rpx;
			// background-color: #ff2;
			.text {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			i {
				display: inline-block;
				margin-top: 30rpx;
			}
		
		}
		.top-bar-right {
			float: right;
			padding-right: 8rpx;
			margin-top: 4rpx;
			box-shadow: none;
			
			image {
				width: 68rpx;
				height: 68rpx;
				margin-top: 9rpx;
				border-radius: 16rpx;
				
			}
			
		}
	}
	
	/* chat-room */
	.chat {
		height: 100%;
		
		.loading {
			margin: 20rpx 0;
			text-align: center;
			i {
				font-size: 50rpx;
			}
		}
		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			// padding-bottom: 120rpx;
			
			display: flex;
			flex-direction: column;
		}
		.chat-ls {
			
			.chat-time {
				font-size: $uni-font-size-sm;
				line-height: 34rpx;
				color: rgba(39,40,50,0.3);
				padding: 20rpx 0;
				text-align: center;
			}
			// 公用
			.msg-m {
				display: flex;
				padding: 20rpx 0;
				
				.user-img {
					flex: none;
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
					
				}
				.message {
					// flex: auto;
					max-width: 480rpx;

				}
				.msg-text {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx;
				}
				.msg-img {
					max-width: 400rpx;
					border-radius: $uni-border-radius-base;
				}
				.voice {
					
					min-width: 120rpx;
					max-width: 350rpx;
					height: 44rpx;
					text-align: center;
					span {
						float: right;
					}
					i{
						float: left;
						padding-right: 13rpx;
						font-size: 35rpx;
						font-weight: 600;
					}
				}
				.msg-map {
					background: #fff;
					width: 462rpx;
					height: 284rpx;
					overflow: hidden;
					.map-name {
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
					}
					.map-addr {
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						padding: 0 24rpx;
						
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1; // 一行溢出则省略号
						overflow: hidden;
					}
					.map {
						padding-top: 8rpx;
						width: 462rpx;
						height: 190rpx;
					}
				}
				
			}
			// 收-发
			.msg-left {
				flex-direction: row;
				.msg-text {
					margin-left: 18rpx;
					background-color: #FFFFFF;
					border-radius: 0 20rpx 20rpx 20rpx;
				}
				.msg-img {
					margin-left: 18rpx;
				}
				.msg-map {
					margin-left: 18rpx;
					border-radius: 0 20rpx 20rpx 20rpx;
				}
			}
			.msg-right {
				flex-direction: row-reverse;
				.msg-text {
					margin-right: 18rpx;
					background-color: $uni-color-primary;
					border-radius: 20rpx 0 20rpx 20rpx;
				}
				.msg-img {
					margin-right: 18rpx;
				}
				.msg-map {
					margin-right: 18rpx;
					border-radius: 20rpx 0 20rpx 20rpx;
				}
			}
		}
		
	}

	// 工具类
	.isActive {
		color: $uni-text-color-grey;
	}
	.displaynone {
		display: none;
	}
</style>
