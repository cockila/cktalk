<template>
	<view class="contents animate__animated animate__fadeIn animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<view class="top-bar-right">
				<view @click="toSignup" class="search">
					<view style="display: inline-block;" 
							class="animate__animated animate__bounceInDown text" >
						注册
					</view>
				</view>
			</view>
		</view>
		<!-- logo -->
		<view class="logo">
			<view class="moni-img-logo">
				<i style="display: inline-block;" 
							class="animate__animated animate__bounceInDown iconfont icon-kakao-talk-fill logo"></i>
				<view style="display: inline-block;" 
							class="animate__animated animate__bounceInDown">FakeQ</view>
				
			</view>
		</view>
		<!-- 表单 -->
		<view class="main">
			<view class="slogan">
				<!-- <span>欢迎登陆</span> -->
			</view>
			
			<view class="inputs">
				<input @focus="iserr=false" v-model="user" class="user" type="text" placeholder="用户名/邮箱" placeholder-style="color: #aaa; font-weight:400;"/>
				<form>
					<input @focus="iserr=false" v-model="psw" class="psw" type="password" placeholder="密码" placeholder-style="color: #aaa; font-weight:400;"/>
				</form>
				
			</view>
			<view v-if="iserr" class="tips">用户名或密码错误！</view>
		</view>
		<view class="submit" @click="login"  hover-class='button-hover'>登陆</view>
		
		<!-- 底部logo -->
		<view class="bot-logo">
		  <i class="iconfont icon-tengxun"></i>
		  <span> Fake云提供计算服务</span>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '',
				psw: '',
				iserr: false,
				// testToken: ''
			}
		},
		onLoad: function (e) {
			if(e.user){
				this.user = e.user	// 接收注册页用户参数
				uni.showToast({
					title: '注册成功！请登录',
					icon:'none',
					duration: 1500
				});
			}else if(e.name){
				this.user = e.name
				uni.showToast({
					title: '登陆已过期',
					icon:'none',
					duration: 2000
				});
			}else if(e.updatepsw){
				this.user = e.updatepsw
				uni.showToast({
					title: '请重新登录',
					icon:'none',
					duration: 2000
				});
			}

		},
		methods: {
			// 登录
			login () {
		
				uni.request({
				
					url: this.serverUrl+'/signin/match',
					data:{
						data: this.user,
						psw: this.psw,
					},	
					
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let result = data.data.back
						console.log('cc')
						// console.log(result)	
						if(status===200){
							// 登录成功，缓存数据+跳转到首页
							this.iserr = false
							try {
								uni.setStorageSync('user', {
									'id':result.id,
									'name':result.name,
									'imgurl':result.imgurl, 
									'token':result.token,
								})
							} catch(e) {
								console.log('数据存储错误')
							}
							uni.navigateTo({
								url:'/pages/index/index',
							})
						}else if(status===400){
							// 匹配失败
							this.iserr = true
							this.psw = ''						}else if (status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}
					}
				})
			},
			// 跳转注册页面
			toSignup() {
				uni.navigateTo({
					url:'../signup/signup'
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
		.top-bar-right {
			box-shadow: none;
			padding-right: 8rpx;
			
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
		.tips {
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 56rpx;
			float: left;
		}
	}
	.submit {
		margin: 0 auto;
		width: 85%;
		height: 96rpx;
		background: $uni-color-primary;
		
		border-radius: $uni-border-radius-base;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color;
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
