<template>
	<view class="contents animate__animated animate__fadeInRightBig animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<view  @click="backOnePage" class="top-bar-left">
				<i class="iconfont icon-xiazai6"></i>
			</view>
			<view class="top-bar-center">
				<view class="title">详情</view>
			</view>
			
		</view>
		<!-- main -->
		<view class="main">
			<view class="column heads">
				
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head" v-if="id === uid">
						<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
						
						<image :src="cropFilePath" @tap="upload" class=" user-img"></image>
					</view>
					<view class="more" v-if="id === uid">
						<i class="iconfont icon-jiantou1"></i>
					</view>
					<image :src="user.imgurl" v-if="id !==uid" class=" user-img"></image>
				</view>
				
				<view class="row head">
					<view class="title">签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
					<view class="more" v-if="id === uid"  @click="modifyData('explain','签名',user.explain,false)">
						<i class="iconfont icon-jiantou1"></i>
					</view>
				</view>
				
				<view class="row head">
					<view class="title">注册</view>
					<view class="cont">
						{{timeChange(user.time) }}
					</view>
					<view class="more">
						
					</view>
				</view>
			</view>
			
			<view class="column heads">
				<!-- 自己昵称 -->
				<view class="row"  v-if="id === uid">
					<view class="title">昵称</view>
					<view class="cont">
						{{(id === uid) ? user.name : markname}}
					</view>
					<view class="more" @click="modifyData('name','昵称',user.name,false)">
						<i class="iconfont icon-jiantou1"></i>
					</view>
				</view>
				<!-- 好友昵称 -->
				<view class="row" v-else>
					<view class="title">昵称</view>
					<view class="cont">
						{{(id === uid) ? user.name : markname}}
					</view>
					<view class="more" @click="modifyData('markname','昵称',markname,false)">
						<i class="iconfont icon-jiantou1"></i>
					</view>
				</view>
				
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker :disabled='id !== uid' @change="bindPickerChange" :value="index" :range="sexArr">
								<view class="uni-input">{{sexArr[index]}}</view>
						</picker>
					</view>
					<view class="more" v-if="id === uid">
						<i class="iconfont icon-jiantou1"></i>
					</view>
				</view>
				
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker :disabled="id !== uid" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{user.birth}}</view>
						</picker>
					</view>
					<view class="more" v-if="id === uid">
						<i class="iconfont icon-jiantou1"></i>
					</view>
				</view>
				
				<view class="row">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
					<view class="more" v-if="id === uid" @click="modifyData('phone','联系电话',user.phone,false)">
						<i class="iconfont icon-jiantou1"></i>
					</view>
				</view>
				
				<view class="row">
					<view class="title">邮箱</view>
					<view class="cont">
						{{user.email}}
					</view>
					<view class="more" v-if="id === uid" @click="modifyData('email','邮箱',user.email,true)">
						<i class="iconfont icon-jiantou1"></i>
					</view>
				</view>
				
				<view class="row"  v-if="id === uid">
					<view class="title">密码</view>
					<view class="cont">
						*******
					</view>
					<view class="more" @click="modifyData('psw','密码',data , true)">
						<i class="iconfont icon-jiantou1"></i>
					</view>
				</view>
				 
			</view>
			
			<view @tap="quit" class="btn1 my-btn" v-if="id == uid">退出登陆</view>
			<view @tap="deleteFriend" class="btn1 my-btn" v-if="id != uid">删除好友</view>
		</view>
		
		<!-- 弹出层 -->
		<view v-show="showModify" class="modify animate__animated animate__slideInUp animate__faster">
			<view class="modify-header ">
				<view class="close" @click="showModify=false">退出</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifySub">保存</view>
			</view>
			<view class="modify-main">
				<input v-if="haspwd" type="password" v-model="psw" class="modify-pwd" placeholder="原密码" placeholder-style="color:#aaa;font-weight:400" />
				
				<textarea v-model="data"
									class="modify-content" 
									:class="{'modify-pwd-bar': haspwd}"/>
			</view>
		</view>
	
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import myfun from '@/commons/js/myfun.js'
	
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				sexArr: ['男', '女','密'],
				index: 0,
				date: currentDate,
				time: '12:01',
				cropFilePath: '../../static/images/img/avatar1.jpg',
				tempFilePath: "",
				
				data: '',		// 修改内容
				psw: undefined,
				type: '',							// 修改类型
				
				olddata: '',
				showModify: false,
				psw: '',
				modifyTitle: '',			// 修改标题
				type: '',
				haspwd: false,
				
				myname: '',
				id:'',
				uid: '',
				token: '',
				imgurl: '',
				user: '',
				markname: ''
			};
		},
		components: {
			ImageCropper,
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
							this.cropFilePath = this.serverUrl+ res.imgurl
							res.imgurl = this.serverUrl+ res.imgurl
							// console.log(res)
							if(res.explain===undefined){
								res.explain = '这个人很懒，啥都没写~'
							}
							
							if(res.birth===undefined){
								res.birth ='1999-01-01'
							}else {
								this.date = res.birth
							}
							// this.date = res.birth
							if(res.phone===undefined){
								res.phone =	''
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
			// 获取好友昵称
			getMarkname(){
				if(this.id !== this.uid){
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
						// console.log(data.data)
						if(status==200){// 是好友关系
							let	res = data.data.result

							if(res.markname!==undefined){
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
				}
				
			},
			// 返回上一页
			backOnePage() {
				uni.navigateBack({
					delta:1
				})
			},
			// 时间处理
			timeChange (data){
				return myfun.detialTime(data)
			},
			// 性别判断
			sexJudge(e){
				if(e==='asexual'){
					this.index = 2
				} else if(e==='male'){
					this.index = 0
				} else {
					this.index = 1
				}
			},
			// 性别选择器
			bindPickerChange(e) {
				let oldIndex = this.index
				this.index = e.target.value
				
				if(this.index !== oldIndex) {	// 修改了
					let sex = 'asexual'
					if(this.index===0){
						sex = 'male'
					}else if (this.index===1){
						sex = 'female'
					}
					this.update(sex, 'sex', undefined)
				}
				
			},
			// 日期选择器
			bindDateChange(e) {
				let oldDate = this.date
				this.date = e.target.value
				
				if(this.date !== oldDate) {	// 修改了
					this.update(this.date, 'birth', undefined)
					this.user['birth'] = this.date
				}
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
						year = year - 60;
				} else if (type === 'end') {
						year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 图片裁剪
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album"], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift();
					},
				});
			},
			// 头像上传
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
	
				uni.uploadFile({
					url: this.serverUrl+'/files/upload',	//"后端地址上传图片接口地址",
					filePath: this.headimg,
					name: "file",
					fileType: "image",
					formData:{
						url: 'user',
						name: this.uid,		//文件名
						token: this.token
					},		// 传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;	// 上传的图片 
						// 更新本地存储信息
						try {
							uni.setStorageSync('user', {
								'id':this.uid,
								'name':this.myname,
								'imgurl':backstr, 
								'token':this.token,
							})
						} catch(e) {
							console.log('数据存储错误')
						}
						this.update(backstr, 'imgurl', undefined)
						// console.log(backstr)
					},
	
					fail(e) {
						// console.log("this is errormes " + e.message);
					},
				});
			},
			cancel() {
				this.tempFilePath = "";
			},
			// 修改数据
			update(data,type,psw){
				
				uni.request({
					url: this.serverUrl+'/user/update',
					data:{
						id: this.uid,	
						data: data,
						type: type,
						psw: psw,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						// console.log(status)
						if(status==200){
							if(type === 'psw'){
								// 清除缓存
								uni.removeStorage({
									key: 'user',
									success() {

									}
								})
								// 需要重新登录
								uni.navigateTo({
									url:'/pages/signin/signin?updatepsw='+this.myname
								})
								// this.update(this.data, this.type, this.psw)
							}
							this.showModify = false
							uni.showToast({
							    title: '修改成功',
									icon:'none',
							    duration: 1500
							});
						}else if(status==300){
							uni.navigateTo({
								url:'/pages/signin/signin'
							})
						}else if(status==400){
							uni.showToast({
							    title: '请输入正确的密码',
									icon:'none',
							    duration: 1500
							});
						}else if(status==201){
							uni.showToast({
							    title: '邮箱已占用',
									icon:'none',
							    duration: 1500
							});
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
			// 好友昵称修改
			updateFriendMN(){
				if(this.data.length>0 && this.data !==this.olddata){
					uni.request({
						url: this.serverUrl+'/user/updatemarkname',
						data:{
							uid: this.uid,	
							fid: this.id,
							name: this.data,
							token: this.token
						},
						method: 'POST',
						success: (data)=>{
							let status = data.data.status
							
							if(status==200){
								this.showModify = false
								uni.showToast({
								    title: '修改成功',
										icon:'none',
								    duration: 1500
								});
							}else if(status==300){
								uni.navigateTo({
									url:'/pages/signin/signin?name='+this.myname
								})
							}else if(status==400){
								
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
			// 弹出框项修改
			modifyData(t, type, oldData, hasPwd) {
				this.showModify=true
				
				if(!hasPwd){
					this.psw = undefined
				}
				
				if(this.showModify) {
					this.modifyTitle = type
					this.data = oldData
					this.haspwd = hasPwd
					
					this.olddata = oldData
					this.type = t
				}
			},
			// 确定提交修改项
			modifySub(){
				// 未修改不提交
				if(this.data.length>0 && this.data !==this.olddata){
					if(this.type === 'markname'){// 修改好友昵称
						this.updateFriendMN()
						this.markname = this.data
						// console.log(this.markname,this.data)
					}
					else if(this.type === 'email'){
						let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-z0-9]+\.([a-zA-z]{2,4})$/
						if(reg.test(this.data)) {
							this.update(this.data, this.type, this.psw)	// 更新
							this.user[this.type] = this.data	// 页面更新
						}else {
							uni.showToast({
							    title: '邮箱格式错误',
									icon:'none',
							    duration: 1500
							});
						}
					}
					
					else {		//修改其他项
						this.update(this.data, this.type, this.psw)	// 更新
						this.user[this.type] = this.data	// 页面更新
					}
					// this.showModify = false
					
				} else {
					uni.showToast({
					    title: '未修改内容',
							icon:'none',
					    duration: 1500
					});
				}
			},
			// 退出登录
			quit(){
				// 清除缓存
				uni.removeStorage({
					key: 'user',
					success() {
						// console.log('清除成功')
					}
				})
				// 需要重新登录
				uni.navigateTo({
					url:'/pages/signin/signin?name='+this.myname
				})
			},
			// 删除好友
			deleteFriend(){
				uni.showModal({
					title:'提示',
					content:'确定删除好友？',
					success:(res) =>{
						if(res.confirm){
							uni.request({
								url: this.serverUrl+'/friend/deletefriend',
								data:{
									uid: this.uid,	
									fid: this.id,
									token: this.token
								},
								method: 'POST',
								success: (data)=>{
									let status = data.data.status
									let res = data.data.result
									if(status===200){
										// uni.navigateTo({
										// 	url:'../userhome/userhome?id='+this.id
										// })
										uni.navigateTo({
											url:'/pages/index/index',
										})
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
						}else {
							
						}
					},
					
				})
			},
		},
		computed: {
			startDate() {
					return this.getDate('start');
			},
			endDate() {
					return this.getDate('end');
			}
		},
		onLoad(e) {
			this.id = e.id
			this.getStorages()
			this.getUser()
			this.getMarkname()
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';

	/* 顶部 */
	.top-bar {
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
	}
	
	/* main */
	.main {
		padding-top: 118rpx;
		display: flex;
		flex-direction: column;
		.column {
			display: flex;
			flex-direction: column;
			padding-top: 12rpx;
			border-bottom: 1px solid $uni-border-color;
			width: 100%;
			.row {
				display: flex;
				flex-direction: row;
			}
			.title {
				flex: none;
				padding: 0 $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
			}
			.head {
				display: flex;
				align-items: center;
			}
			.cont {
				
				flex: auto;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.user-head {
				flex: auto;
			}
			.user-img {
				width: $uni-img-size-lg;
				height: $uni-img-size-lg;
				border-radius: $uni-border-radius-base;
			}
			.more {
				flex: none;
				padding-right: 18rpx;
				display: flex;
				align-items: center;
				height: 112rpx;
				i {
					font-size: $uni-font-size-lg;
					color: $uni-text-color-grey;
				}
			}
		}
		.my-btn {
			width: 90%;
			margin: 88rpx auto;
			background: $uni-color-warning;
			color: #fff;
		}
	}

	/* 弹出框 */
	.modify {
		position: absolute;
		z-index: 1002;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		
		.modify-header {
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
			box-shadow: 1rpx 1rpx 20rpx 2rpx rgba(117, 112, 117, 0.2);
			
			.close {
				padding-left: 32rpx;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.title {
				flex: auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define {
				padding-right: $uni-spacing-col-base;
				font-size: 35rpx;
				color: $uni-color-success;
				line-height: 88rpx;
			}
		}
		.modify-main {
			display: flex;
			flex-direction: column;
			padding: $uni-spacing-col-base;
			.modify-pwd {
				padding: 0 22rpx;
				margin-bottom: $uni-spacing-col-base;
				flex: auto;
				height: 88rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.modify-content {
				flex: 1;
				// width: 686rpx;
				height: 386;
				padding: 22rpx;
				margin: 0 auto;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			// 密码框
			.modify-pwd-bar {
				padding: 0 22rpx;
				margin-bottom: $uni-spacing-col-base;
				flex: auto;
				width: 94%;
				height: 88rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
		}
	}
</style>
