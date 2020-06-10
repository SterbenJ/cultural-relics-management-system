<template>
	<div id="check-canvas-container">
		<div id="inputId-btn-container" v-show="showCanvas">
			<el-button round size="mini" type="info" @click="showInputIdDialog = true">
				手动输入ID
			</el-button>
		</div>
		<el-dialog :visible.sync="showInputIdDialog" title="手动输入ID" width="90%">
			<el-form
				label-position="top"
				ref="dialogFormRef"
				:model="dialogFormModel"
				:rules="dialogFormRules"
			>
				<el-form-item prop="userInputId" label="ID" style="width: 100%;">
					<el-input-number style="width: 100%;" v-model="dialogFormModel.userInputId"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="showInputIdDialog = false">取 消</el-button>
				<el-button type="primary" @click="submitInputId">确 认</el-button>
			</div>
		</el-dialog>
		<canvas
			:width="canvasWidth"
			:height="canvasHeight"
			id="canvas"
			v-show="showCanvas"
			ref="canvas"
			style="margin-bottom: 200px;"
		></canvas>
		<div
			class="font-text-small container-vertical-center container-horizontal-center"
			style="height: 480px;"
			v-show="!showCanvas"
		>
			<i style="margin-right: 5px;" class="el-icon-loading"></i>
			{{ loadingMessage }}
		</div>
		<slot></slot>
	</div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import adapter from 'webrtc-adapter'
// WebRTC适配器 只需要引入就ok
import jsQR from 'jsqr'
// import relics from '../relics'
import { Message } from 'element-ui'
export default {
	props: {
		id: {
			required: true,
			type: Number
		}
	},
	data: () => ({
		video: document.createElement('video'),
		loadingMessage: '⌛ 初始化',
		// 是否显示摄像头
		showCanvas: false,
		// 是否允许扫描
		canScan: true,
		// 是否正在扫描
		scanning: false,
		canvas2d: undefined,
		// 二维码中的信息
		outputData: undefined,
		// 长宽
		canvasWidth: 320,
		canvasHeight: 480,
		// 画面流id
		requestAnimationId: undefined,
		streamObj: undefined,
		showInputIdDialog: false,
		dialogFormModel: {
			userInputId: undefined
		},
		dialogFormRules: {
			userInputId: [
				{
					required: true,
					message: '请输入文物ID',
					trigger: 'blur'
				},
				{
					type: 'number',
					message: '必须为数字类型',
					trigger: 'blur'
				}
			]
		},
		tmp: true
	}),
	methods: {
		// 开启摄像头
		openScan() {
			const videoParam = { video: { facingMode: 'environment' } }
			navigator.mediaDevices
				.getUserMedia(videoParam)
				.then(stream => {
					this.video.srcObject = stream
					this.video.setAttribute('playsinline', true) // required to tell iOS safari we don't want fullscreen
					this.video.play()
					this.streamObj = stream
					this.canScan = true
					// 获得画面id，用来停止
					this.requestAnimationId = window.requestAnimationFrame(this.tick)
				})
				.catch(err => {
					this.loadingMessage = '初始化失败'
					console.log('init scan fail', err)
				})
		},
		// 扫描某一帧的画面
		tick() {
			if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
				if (!this.canScan) {
					return
				}
				this.showCanvas = true
				this.scanning = true
				this.$emit('scanning', true)
				this.canvasHeight = this.video.videoHeight
				this.canvasWidth = this.video.videoWidth
				!this.canvas2d && (this.canvas2d = this.$refs.canvas.getContext('2d'))
				this.canvas2d.drawImage(this.video, 0, 0, this.canvasWidth, this.canvasHeight)
				var imageData = this.canvas2d.getImageData(
					0,
					0,
					this.canvasWidth,
					this.canvasHeight
				)
				var code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: 'dontInvert'
				})
				if (code) {
					this.drawLine(
						code.location.topLeftCorner,
						code.location.topRightCorner,
						'#FF3B58'
					)
					this.drawLine(
						code.location.topRightCorner,
						code.location.bottomRightCorner,
						'#FF3B58'
					)
					this.drawLine(
						code.location.bottomRightCorner,
						code.location.bottomLeftCorner,
						'#FF3B58'
					)
					this.drawLine(
						code.location.bottomLeftCorner,
						code.location.topLeftCorner,
						'#FF3B58'
					)
					this.outputData = code.data
					this.afterGetCode()
					return
				} else {
					this.outputData = undefined
				}
			}
			window.requestAnimationFrame(this.tick)
		},
		// 标注出二维码
		drawLine(begin, end, color) {
			this.canvas2d.beginPath()
			this.canvas2d.moveTo(begin.x, begin.y)
			this.canvas2d.lineTo(end.x, end.y)
			this.canvas2d.lineWidth = 4
			this.canvas2d.strokeStyle = color
			this.canvas2d.stroke()
		},
		// 获得对应文物id
		getId() {
			const rawData = this.outputData
			if (!rawData) {
				return undefined
			}
			const rawArr = rawData.split('#')
			const result = Number(rawArr[1])
			// 长度必须为3，数据必须为数字
			if (rawArr.length !== 3 || isNaN(result)) {
				return undefined
			}
			return result
		},
		// 扫描到二维码后的处理
		afterGetCode(inputId) {
			window.cancelAnimationFrame(this.requestAnimationId)
			this.canScan = false
			this.scanning = false
			this.$emit('scanning', false)
			let targetId = this.getId()
			if (inputId) {
				targetId = inputId
			}
			if (!targetId) {
				Message.error('数据有误，请重新扫码')
				return
			}
			this.$emit('getCode', targetId)
			// this.dialogFormModel.relicsId = targetId
			// this.showInfoDialog = true
		},
		// 手动输入ID
		submitInputId() {
			const vm = this
			this.$refs.dialogFormRef.validate((result, object) => {
				if (result) {
					vm.afterGetCode(vm.dialogFormModel.userInputId)
					vm.showInputIdDialog = false
				}
			})
		}
	},
	mounted() {
		this.openScan()
	},
	beforeDestroy() {
		// 关闭摄像头
		window.cancelAnimationFrame(this.requestAnimationId)
		for (const closeStream of this.streamObj.getTracks()) {
			closeStream.stop()
		}
		this.streamObj = null
	}
}
</script>

<style lang="stylus" scoped>
#check-canvas-container
	font-family 'Ropa Sans' sans-serif
	max-width 640px
	height 100%
	margin 0 auto
	position relative
#check-action-container
	padding-bottom 20px
	height 200px
	width 100%
	position fixed
	bottom 0px
	left 0px
	right 0px
#inputId-btn-container
	position fixed
	top 10px
	margin 0 auto
	left 0
	right 0
	text-align center
	color #EEEEEE
#inputId-btn, #canvas
	width 100%
#action
	width 100%
	height 100%
	flex-direction column
	align-content center
	align-items center
	display flex
	justify-content space-around
.check-dialog-action-button
	margin-left 0px
	width 90%
	height 40%
	border-radius 10px
</style>
