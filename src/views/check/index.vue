<template>
	<div id="check-canvas-container">
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
		<transition class="el-zoom-in-left">
			<div id="check-action-container" v-show="showCanvas">
				<div id="action">
					<el-button
						style="box-shadow: 0px 0px 10px #e39931;"
						class="font-title-extra-large check-dialog-action-button"
						@click="openScan"
						type="warning"
						round
						v-show="!scanning"
					>
						继续盘点
					</el-button>
					<el-button
						style="box-shadow: 0px 0px 10px #d96767;"
						class="font-title-extra-large check-dialog-action-button"
						type="danger"
						round
						icon="el-icon-close"
						@click="showConfirmDialog = true"
					>
						结束该盘点
					</el-button>
					<el-dialog
						title="确定要结束此次盘点吗？"
						:visible.sync="showConfirmDialog"
						:show-close="false"
						:destroy-on-close="true"
						width="60%"
						:center="true"
						:modal="false"
					>
						<span slot="footer" class="dialog-footer">
							<el-button @click="showConfirmDialog = false">取 消</el-button>
							<el-button type="danger" @click="finishCheck">确 定</el-button>
						</span>
					</el-dialog>
				</div>
			</div>
		</transition>
		<el-dialog
			:visible.sync="showInfoDialog"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			:destroy-on-close="false"
			width="95%"
			:center="true"
			@closed="handlerDialogClose"
		>
			<relics :simple="true" :id="dialogFormModel.relicsId" />
			<el-form ref="dialogFormRef" :model="dialogFormModel">
				<el-form-item prop="warehouseId" :label="api.check.attrMap.warehouseId.value">
					<el-input
						v-model="dialogFormModel.warehouseId"
						placeholder="若无变更则留空"
					></el-input>
				</el-form-item>
				<el-form-item prop="shelfId" :label="api.check.attrMap.shelfId.value">
					<el-input
						v-model="dialogFormModel.shelfId"
						placeholder="若无变更则留空"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					:loading="dialogLoading"
					:disabled="dialogLoading"
					@click="confirmCheckMsg"
				>
					确 定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import adapter from 'webrtc-adapter'
// WebRTC适配器 只需要引入就ok
import jsQR from 'jsqr'
import relics from '../relics'
import { Message } from 'element-ui'
export default {
	props: {
		id: {
			required: true,
			type: Number
		}
	},
	components: {
		relics
	},
	watch: {
		id: {
			handler(newVal, oldVal) {
				this.dialogFormModel.checkId = newVal
			},
			immediate: true
		}
	},
	data: () => ({
		video: document.createElement('video'),
		loadingMessage: '⌛ 初始化',
		// 是否显示摄像头
		showCanvas: false,
		// 是否正在扫描
		scanning: false,
		// 显示确认信息的 dialog
		showInfoDialog: false,
		// 显示确认操作的 dialog
		showConfirmDialog: false,
		canvas2d: undefined,
		// 二维码中的信息
		outputData: undefined,
		// 长宽
		canvasWidth: 320,
		canvasHeight: 480,
		// 画面流id
		requestAnimationId: undefined,
		// dialog表单
		dialogFormModel: {
			checkId: undefined,
			relicsId: undefined,
			warehouseId: undefined,
			shelfId: undefined
		},
		dialogLoading: false,
		streamObj: undefined
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
				this.showCanvas = true
				this.scanning = true
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
			const rawArr = rawData.split('#')
			const result = Number(rawArr[1])
			// 长度必须为3，数据必须为数字
			if (rawArr.length !== 3 || isNaN(result)) {
				return undefined
			}
			return result
		},
		// 关闭dialog后
		handlerDialogClose() {
			this.dialogFormModel.checkId = this.id
			this.dialogFormModel.warehouseId = undefined
			this.dialogFormModel.shelfId = undefined
		},
		// 结束盘点
		finishCheck() {
			this.showConfirmDialog = false
			const vm = this
			vm.api.finishCheck
				.func({
					id: vm.id
				})
				.then(res => {
					console.log('finish check success')
					vm.$router.push({
						name: 'login'
					})
				})
				.catch(err => {
					console.log('finish check fail', err)
				})
		},
		// 确认盘点信息
		confirmCheckMsg() {
			this.dialogLoading = true
			const vm = this
			vm.api.check
				.func(vm.dialogFormModel)
				.then(res => {
					this.dialogLoading = false
					this.showInfoDialog = false
					console.log('check success')
				})
				.catch(err => {
					this.dialogLoading = false
					this.showInfoDialog = false
					console.log('check fail', err)
				})
		},
		// 扫描到二维码后的处理
		afterGetCode() {
			this.scanning = false
			window.cancelAnimationFrame(this.requestAnimationId)
			const targetId = this.getId()
			if (!targetId) {
				Message.error('数据有误，请重新扫码')
			}
			this.dialogFormModel.relicsId = targetId
			this.showInfoDialog = true
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
#canvas
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
