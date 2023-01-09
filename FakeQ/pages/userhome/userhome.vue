<template>
	<view>
		<!-- 顶部 -->
		<view class="top-bar">
			<view @click="backOnePage"  class="top-bar-left">
				<i class="iconfont icon-xiazai6"></i>
			</view>
			<view class="top-bar-center">
				<view class="title">资料卡</view>
				
			</view>
			<view class="top-bar-right">
				<view @tap="userDetial()" class="more" v-if="relation===0||relation===1">
					<i class="iconfont icon-gengduo"></i>
				</view>	
			</view>
		</view> 
		<!-- 背景层 -->
		<view class="bg" :class="{'bind-bg': showSend}">
			<image class="bg-img" 
						 :class="{'bind-bg-img': showSend}"
						 :src="user.imgurl" 
						 mode="aspectFill"/>
			<view class="bg-bai"></view>			 
		</view>
		<!-- 主体 -->
		<view class="main animate__animated animate__faster"
					:class="{'animate__slideInDown': !showSend}">
			<view class="user-header">
				<view class="sex">
					<i v-show="!showSend" 
						 class="iconfont "
						 :class="{'icon-xingbie3':sex,'icon-xingbie-nan':sexNan,'man-color':sexNan,' icon-xingbienv':sexNv, 'woman-color': sexNv}"></i>
				</view>
				<image :src="user.imgurl" 
							 class="user-img animate__animated"
							 :class="{'bind-user-img': showSend}"
							 mode="aspectFill"/>
			</view>
			<view class="user-info">
				<view class="name">{{markname}}</view>
				<view class="nick">昵称：{{user.name}}</view>
				<view class="intr">{{user.explain}}</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="bottom animate__animated animate__faster"
					:class="{'animate__slideInUp': !showSend}">
			<view v-if="relation===2" @click="showSend=true" class="bottom-btn">加为好友</view>
			<!-- <view v-if="relation===1 || relation===0" class="bottom-btn" @tap="toChatRoom(item)">发送消息</view> -->
		</view>
		<!-- 加好友 -->
		<view v-show="showSend">
			<view class="add-msg animate__animated animate__slideInUp animate__faster">
			<view class="name">{{user.name}}</view>
			<textarea class="add-main" v-model="msg" maxlength="120" placeholder="" />
		</view>
		<view class="add-btn animate__animated animate__slideInUp animate__faster">
			<view class="close" @click="showSend=false">取消</view>
			<view class="send" @tap="addFriendSub">确认</view>
		</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addHight: 0,
				myname: '我',
				usrArr: [],
				sexNan: false,
				sexNv: false,
				sex: false,      // 性别
				markname: '',
				showSend: false,
				id: '',		// 父组件传来的id，用来渲染该页面
				uid: '',	// 缓存id
				token: '',
				user: {},
				msg: '',
				relation: '' // 用户关系（0：自己，1：好友，2：陌生人）
			}
		},
		onReady(){
			
			this.getEleStyle()
		},
		onLoad(e) {
			this.id = e.id		
			this.getStorages()
			this.getUser()
			this.judgeFriend()
			
		},
		methods: {
			// 获取缓存数据
			getStorages() {
				try{
					const value = uni.getStorageSync('user')
					if(value) {
						this.uid = value.id	
						this.token = value.token
						this.myname = value.name
						this.imgurl = value.imgurl
						this.msg = this.myname+'请求加为好友~'
					}else {
						uni.navigateTo({
							url: '../signin/signin',
						})
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			// 获取用户信息
			getUser(){
				uni.request({
					url: this.serverUrl+'/user/detial',
					data:{
						id: this.id,	// 传参来的id
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let res = data.data.result
						if(status===200){
							// 渲染数据
							res.imgurl = this.serverUrl+ res.imgurl
							// console.log(res)
							if(res.explain===undefined){
								res.explain = '这个人很懒，啥都没写~'
							}
							// 处理markname
							if(this.markname.length===0){
								this.markname = res.name
							}
							this.sexJudge(res.sex)
							this.user = res
							// console.log(this.user)
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
			isMyFriend (item ,e){
				let tip = 0
				let exp = eval("/"+e+"/g")
				// console.log(item._id, this.uid)
				if(item._id === this.uid){
					tip = 2
					item.tip = tip
					item.imgurl=this.serverUrl+'/'+item.imgurl
					item.names = item.name.replace(exp, "<span style='color:#4AAAFF'>"+e+"</span>")
					item.emails = item.email.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>")
					this.usrArr.push(item)
				}else {
					uni.request({
					url: this.serverUrl+'/search/isfriend',
					data:{
						uid: this.uid,	// 传参来的id
						fid: item._id,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						// console.log(status)
						let arr = data.data.result
						if(status===200){	// 是好友
							tip = 1
							item.tip = tip
						}else if(status===400){	// 不是好友
							tip = 0
							item.tip = tip
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}else if(status===500){	
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}
						item.id = item._id
						item.type = 0
						item.tip = tip
						item.imgurl=this.serverUrl+'/'+item.imgurl
						item.names = item.name.replace(exp, "<span style='color:#4AAAFF'>"+e+"</span>")
						item.emails = item.email.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>")
						this.usrArr.push(item)
						console.log(this.usrArr)
					}
				})
				}
				// console.log(item.tip, tip)
				
			},
			// 性别判断
			sexJudge(e){
				if(e==='asexual'){
					this.sex = true
					this.sexNan = false
					this.sexNv = false
				} else if(e==='male'){
					this.sex = false
					this.sexNan = true
					this.sexNv = false
				} else {
					this.sex = false
					this.sexNan = false
					this.sexNv = true
				}
			},
			//窗口发送消息
			submit2(){
				uni.navigateTo({
					url: '../../chatroom/chatroom?id='+this.id,
				})
			},
			// 判断用户关系
			judgeFriend(){
				if(this.id === this.uid){	// 是本人
					this.relation = 0
					// console.log(this.relation)
				} else {	// 不是本人
					uni.request({
						url: this.serverUrl+'/search/isfriend',
						data:{
							uid: this.uid,	// 缓存数据-自己
							fid: this.id,	// 路由参数-自己/他人
							// token: this.token
						},
						method: 'POST',
						success: (data)=>{
							let status = data.data.status
							// console.log(status)
							if(status==200){// 是好友关系
								this.relation = 1	
								this.getMarkname()	// 是好友时获取昵称
							}else if(status==400){// 陌生人
								this.relation = 2	
								// console.log(this.relation)
							}else if(status==500){
								uni.showToast({
								    title: '服务器出错了...',
										icon:'none',
								    duration: 1500
								});
							}
						}
					})
				}
			},
			// 发送好友请求
			addFriendSub(fid){
				uni.request({
					url: this.serverUrl+'/friend/apply',
					data:{
						uid: this.uid,	// 传参来的id
						fid: this.id,
						msg: this.msg,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						// console.log(status)
						let arr = data.data.result
						if(status===200){
							
							this.showSend = false
							uni.showToast({
							    title: '好友请求发送成功',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}
					}
				})
			},
			// 获取好友昵称
			getMarkname(){
				uni.request({
					url: this.serverUrl+'/user/getmarkname',
					data:{
						uid: this.uid,	
						fid: this.id,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						
						if(status==200){// 是好友关系
							let	res = data.data.result
							if(res.markname !== undefined){
								this.markname = res.markname
							}
						}else if(status==400){// 陌生人
							
						}else if(status==500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}
					}
				})
			},
			// 跳转到用户详情
			userDetial(){
				uni.navigateTo({
					url:'/pages/userdetials/userdetials?id='+this.id
				})
			},
			toChatRoom(data){
				uni.navigateTo({
					url:'../chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type
				})
			},	
			// 返回上一页
			backOnePage() {
				uni.navigateBack({
					delta:1
				})
			},
			
			getEleStyle() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.bg').boundingClientRect(data=>{
					console.log(JSON.stringify(data))
					console.log(data.top)
					this.addHight = data.height-186
					console.log(this.addHight)
				})
			},
		},
		
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
	
	/* 顶部 */
	.top-bar {
		background: rgba(255, 255, 255, 0);
		box-shadow: none;
		border: none;
		.top-bar-left {
			z-index: 10000;
			width: 88rpx;
			height: 100%;
			float: left;
			i {
				display: inline-block;
				margin-top: 25rpx;
			}
		
		}
		.top-bar-right {
			float: right;
			padding-right: 8rpx;
			box-shadow: none;
			.more i{
				font-size: 56rpx;
				color: $uni-text-color;
				line-height: 40rpx;
				
			}
			
		}
	}
	/* 背景层 */
	.bg {
		z-index: -2;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		
		.bg-bai {
			width: 100%;
			height: 100%;
			
		}
		.bg-img {
			z-index: -1;
			width: 110%;
			height: 110%;
			top: -10rpx;
			left: -10rpx;
			filter: blur(16px);
			opacity: 0.6;
			
		}
		.bind-bg-img {
			z-index: 100;
			opacity: 0;
			transition: 0.4s;
			
		}
	}
	.bind-bg {
		transition: 0.5s;
		background-color: rgba(255, 228, 49, 0.8);
	}
	/* main */
	.main {
		text-align: center;
		margin-top: 300rpx;
		.user-header {
			position: relative;
			padding-top: 108rpx;
			margin: 0 auto;
			width: 410rpx;
			height: 404rpx;
			.sex {
				z-index: 1001;
				position: absolute;
				bottom: 12rpx;
				right: 12rpx;
				i {
					font-size: 28px;
					font-weight: 600;
					color: #fff;
					border-radius: 50%;
					padding: 12rpx;
				}
				.man-color {
					background-color: $uni-color-success;
				}
				.woman-color {
					background-color: $uni-color-warning;
				}
				.icon-xingbie3{
					background-color: black;
					// color: red;
				}
			}
			.user-img {
				z-index: 10;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255,255,255,1);
				box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
			}
			.bind-user-img {
				z-index: 10;
				margin-left: -300rpx;
				margin-top: 80rpx;
				width: 250rpx;
				height: 250rpx;
				box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
				// border : none;
				border-radius: 50%;
				transition: 0.4s;
				// border: 6rpx solid rgba(255, 228, 49, 0.8);
			}
		}
		.user-info {
			width: 90%;
			margin: 50rpx auto;
			padding: 62rpx 0;
			border-radius: 10rpx;
			box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
			.name {
				font-size: 52rpx;
				color: $uni-text-color;
				line-height: 74rpx;
			}
			.nick {
				font-size: $uni-font-size-base;
				line-height: 40rpx;
				color: $uni-text-color;
			}
			.intr {
				font-size: $uni-font-size-base;
				font-weight: 300;
				line-height: 48rpx;
				color: $uni-text-color;
				padding-top: 20rpx 100rpx;
				
				
			}
		}
		
	}
	
	/*  */
	.add-msg {
		position: fixed;
		top: 340rpx;
		padding: 40rpx 0rpx;
		width: 100%;
		height: 1252rpx;
		background: rgba(255,255,255,1);
		border-radius: 40rpx 40rpx 0 0;
		
		.name {
			
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
			// padding-left: 86rpx;
			padding-top: 68rpx;
			padding-bottom: 20rpx;
			text-align: center;
		}
		.add-main {
			height: 420rpx;
			
			padding: 18rpx 22rpx;
			border-radius: $uni-border-radius-base;
			background: $uni-bg-color-grey;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
			margin: 0 auto;
			box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3)
		}
		
	}
	
	/* 底部按钮2 */
	.add-btn {
		z-index: 100;
		position: fixed;
		bottom: 20rpx;
		width: 100%;
		height: 104rpx;
		box-sizing: border-box;
		padding: 12rpx $uni-spacing-col-base;
		display: flex;
		
		.close {
			// flex: auto;
			width: 172rpx;
			height: 80rpx;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
			text-align: center;
			line-height: 80rpx;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
		}
		.send {
			margin-left: $uni-spacing-col-base;
			flex: auto;
			height: 80rpx;
			background: $uni-color-primary;
			border-radius: $uni-border-radius-base;
			text-align: center;
			line-height: 80rpx;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
			}
		}
</style>
