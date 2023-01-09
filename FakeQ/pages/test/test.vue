<template>
	<view>
		<button @tap="upload()">
			上传图片
		</button>
		{{img}}
		<image v-for="(item, index) in img" :src="item" :key='index' mode=""></image>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun.js'
	export default {
		data() {
			return {
				id: '545bfdhbefh545gw9g4',
				img:[],
			}; 
		},
		methods:{
			testFun () {
				uni.request({
					url: this.serverUrl+'/chat/msg',
					data:{
						// data: '西西',
						// type: 'name'
						// psw: '242166',
						token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTljYjk3NmQ5MTY0MWQ2ODczM2FkZiIsInRpbWUiOiIyMDIxLTA1LTI3VDEzOjIxOjQ3LjIwNFoiLCJpYXQiOjE2MjIxMjE3MDcsImV4cCI6MTYzMjQ4OTcwN30.7KKfnp1iF__CvwfJb0jX_u_Ja7gCYIW-mnWteb1xD0M",
						uid: '60a9cb976d91641d68733adf',
					},
					method: 'POST',
					success: (data)=>{
						// this.testToken = data.data.back.token
						console.log(data)
					}
				})
				
			},
			
			upload(){
				let url = myfun.fileName(new Date())	// 文件夹名
				
				uni.chooseImage({
					count:9,	// 默认9张
					sizeType:['original', 'compressed'],
					sourceType:['album', 'camera'],	// 从相册选择
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						
						for(let i=0; i<tempFilePaths.length; i++){
							const uploadTask = uni.uploadFile({
								url: this.serverUrl+'/files/upload', //仅为示例，非真实的接口地址
								filePath: tempFilePaths[i],
								name: 'file',
								formData: {
										'url': url,	// 每天建一个文件夹
										name: new Date().getTime()+this.id+i		//文件名
								},
								success: (uploadFileRes) => {

										let path = this.serverUrl+ uploadFileRes.data	// 取到上传的图片
										this.img.push(path)
										// console.log(path)
								}
							});
							uploadTask.onProgressUpdate((res) => {
								console.log('上传进度' + res.progress);
								console.log('已经上传的数据长度' + res.totalBytesSent);
								console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
		
								// 测试条件，取消上传任务。
								// if (res.progress > 50) {
								// 		uploadTask.abort();
								// }
						});
						}
						
						
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>
