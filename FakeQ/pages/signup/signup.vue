<template>
	<view class="contents animate__animated animate__fadeIn animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<view @click="backOnePage" class="top-bar-left">
				<i class="iconfont icon-xiazai6"></i>
			</view>
			<view class="top-bar-right">
				<view class="search">
					<view class="text">
						取消
					</view>
				</view>
			</view>
		</view>
		<!-- logo --> 
		<view class="logo">
			<view class="moni-img-logo">
				<view style="display: inline-block;"
							class="animate__animated animate__bounceInDown"></view>
				<i class="iconfont icon-kakao-talk-fill logo"></i>
			</view>
		</view>
		<!-- 表单 -->
		<view class="main">
			<view class="title">注册中心</view>
			<view class="inputs">
				
				<view class="inputs-div">
					<input @blur="matchUser" class="user" type="text" value="" placeholder="用户名" placeholder-style="color: #aaa; font-weight:400;"/>
					<view v-if="employ" class="employ">用户已存在</view>
					<i v-if="isuser" class="iconfont icon-profile ok"></i>
				</view>
				
				<view class="inputs-div">
					<input @blur="isEmail" class="email" type="text" value="" placeholder="邮箱" placeholder-style="color: #aaa; font-weight:400;"/>
					<view v-if="invalid" class="invalid">无效邮箱</view>
					<i v-if="isemail" class="iconfont icon-atsign ok"></i>
				</view>
				
				<view class="inputs-div">
					<input @input="getPsw"
								class="psw" 
								:type="type" 
								maxlength="140" 
								stepautocomplete="off" 
								value="" 
								placeholder="密码" 
								placeholder-style="color: #aaa; font-weight:400;"/>
					<view v-if="ispwd" class="employ">已存在</view>
					<i @click="looks" v-if="!look" class="iconfont icon-yanjing ok" style="color: #808080;"></i>
					<i @click="looks" v-if="look" class="iconfont icon-yanjing ok" style="color: rgba(255, 228, 49, 1);"></i>
				</view>
				
			</view>
		</view>
		<view @tap="signUp" :class="{submit:isok, submit1: !isok}">点击注册</view>
		<!-- 底部logo -->
		<view class="bot-logo">
		  <i class="iconfont icon-tengxun"></i>
		  <span> 腾讯云提供计算服务</span>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'password',
				isuser: false,	// 用户是否占用
				employ: false,	// 用户是否存在（文字）
				isemail: false,	// 邮箱是否可用
				invalid: false,	// 邮箱是否无效（文字）
				look: false,		// 是否显示密码
				ispwd: false,
				email: '',
				isok: false,				// 注册信息是否完整
				user: '',
				psw: '',
				
			}
		},
		computed:{
			// 判断按钮变色
			isOk(){
				// console.log(this.isuser, this.isemail,this.psw)
				if(this.isuser && this.isemail && this.psw.length>5) 
					return this.isok = true
				return this.isok = false
			}
		},
		methods: {
			// 密码是否显示
			looks() {
				if (this.look) {
					this.type = 'password'
					this.look = !this.look
				}else{
					this.type = 'text'
					this.look = !this.look
				}
			},
			// 邮箱格式是否正确
			isEmail(e) {
				// 正则匹配邮箱格式
				this.email = e.detail.value
				let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-z0-9]+\.([a-zA-z]{2,4})$/
				if(this.email) {
					if(reg.test(this.email)) {
						this.invalid = false
						this.matchEmail()
					}else {
						this.isemail = false
						this.invalid = true
					}
					
				}else {
					this.invalid = false
					this.isemail = false
					this.isOk
				}
			},
			// 匹配后端用户名
			matchUser(e) {
				this.user = e.detail.value
				if(this.user.length>0){
					uni.request({
						url: this.serverUrl+'/signup/judge',
						data:{
							data: this.user,
							type: 'name'
						},
						method: 'POST',
						success: (data)=>{
							let status = data.data.status
							if(status===200){
								let res = data.data.result
								if(res>0){
									this.employ = true	// 用户名已存在
									this.isuser = false	
								}else {
									this.employ = false	// 用户名不存在
									this.isuser = true	
								}
								this.isOk
							}else if(status===500){
								uni.showToast({
								    title: '服务器出错了...',
										icon:'none',
								    duration: 1500
								});
							}
						}
					})
				}
				else {
					this.employ = false
					this.isuser = false
					this.isOk
				}
			},
			// 匹配邮箱
			matchEmail() {
				uni.request({
					url: this.serverUrl+'/signup/judge',
					data:{
						data: this.email,
						type: 'email'
					},
					method: 'POST',
					success: (data)=>{
						// console.log(data.data)
						let status = data.data.status
						if(status===200){
							let res = data.data.result
							if(res>0){
								this.invalid = true	// 已存在
								this.isemail = false
							}else {
								this.invalid = false	// 不存在
								this.isemail = true
							}
							this.isOk
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
			getPsw(e) {
				this.psw = e.detail.value
				this.isOk
			},
			// 注册提交
			signUp(){
				if(this.isOk) {
					uni.request({
						url: this.serverUrl+'/signup/add',
						data:{
							name: this.user,
							mail: this.email,
							psw: this.psw,
						},
						method: 'POST',
						success: (data)=>{
							let status = data.data.status
							if(status===200){
								// 注册成功跳转到登录页
								uni.navigateTo({
									url:'/pages/signin/signin?user='+this.user,
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
				}
			},
			// 返回上一页
			backOnePage() {
				uni.navigateBack({
					delta:1
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
	
	/* 顶部 */
	.top-bar {
		box-shadow: none;
		border-bottom: none;
		.top-bar-left {
			width: 88rpx;
			height: 100%;
			float: left;

			.text {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			i {
				display: inline-block;
				margin-top: 25rpx;
			}
		
		}
		.top-bar-right {
			float: right;
			padding-right: 8rpx;
			margin-top: 4rpx;
			.text {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			
		}
	}
	
	/* logo */
	.logo .moni-img-logo{
		padding-top: 256rpx;
		width: 194rpx;
		height: 92rpx;
		font-size: 60rpx;
		margin: 0 auto;
		text-align: center;
		color: $uni-color-primary;
		i {
			color: $uni-color-primary;
			font-size: 100rpx;
		}
	}
	/* 主体 */
	.main {
		padding: 54rpx $uni-spacing-row-lg 120rpx;
		.title {
			text-align: center;
			font-size: 44rpx;
			color: $uni-text-color;
			line-height: 56rpx;
		}
		.slogan {
			text-align: center;
			font-size: 40rpx;
			color: $uni-text-color-grey;
			line-height: 56rpx;
			span {
				font-size: 50rpx;
				color: $uni-color-primary;
			}
		}
		.inputs {
			padding-top: 48rpx;
			
			input {
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				fonf-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1rpx solid $uni-border-color;
			}
			
		}
		.inputs-div {
			position: relative;
		}
		.employ,.invalid {
			position: absolute;
			top: 40rpx;
			right: 0;
			font-size: $uni-font-size-base;
			fonf-weight: 500;
			color: $uni-color-warning;
			line-height: 88rpx;
		}
		.ok {
			position: absolute;
			right: 0;
			top: 70rpx;
			width: 42rpx;
			height: 32rpx;
			color: $uni-color-success;
		}
		
		
	}
	.submit {
		margin: 0 auto;
		width: 85%;
		height: 96rpx;
		background: $uni-color-primary;
		box-shadow: 0px 5rpx 32rpx -36rpx rgba(255, 220, 49, 0.4);
		border-radius: $uni-border-radius-base;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
		box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
	}
	.submit1 {
		margin: 0 auto;
		width: 85%;
		height: 96rpx;
		background: rgba(39,40, 50,0.2);
		box-shadow: 0px 5rpx 32rpx -36rpx rgba(255, 220, 49, 0.4);
		border-radius: $uni-border-radius-base;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: #ffffff;
		line-height: 96rpx;
		text-align: center;
		box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
	}
	/* 底部logo */
	.bot-logo {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		position:fixed; 
		bottom:15rpx; 
		right: 0;
		color: $uni-text-color-grey;
		font-size:0.8rem;
		
		i {
			display: inline-block;
			font-size:1.1rem; 
			margin-right: 1rpx;
			margin-top: -3rpx;
		}
	}
</style>
