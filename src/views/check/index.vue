<template>
	<div>
		<scan @scanning="handlerScanning" @getCode="afterGetCode" ref="scan">
			<transition class="el-zoom-in-left">
				<div id="check-action-container">
					<div id="action">
						<el-button
							style="box-shadow: 0px 0px 10px #e39931;"
							class="font-title-extra-large check-dialog-action-button"
							type="warning"
							@click="openScan"
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
				:show-close="true"
				:destroy-on-close="false"
				width="95%"
				:center="true"
				@closed="handlerDialogClose"
			>
				<relics :simple="true" :id="dialogFormModel.relicsId" />
				<el-form label-position="top" ref="dialogFormRef" :model="dialogFormModel">
					<el-form-item prop="warehouseId" :label="api.check.attrMap.warehouseId.value">
						<el-select
							:loading="warehouseOptionLoading"
							clearable
							v-model="dialogFormModel.warehouseId"
							placeholder="若无变更则留空"
							@visible-change="getWarehouseList"
							@change="handlerWarehouseIdChange"
						>
							<el-option
								v-for="item in warehouseList"
								:key="item.id"
								:value="item.id"
								:label="item.name"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="shelfId" :label="api.check.attrMap.shelfId.value">
						<el-select
							:loading="shelfOptionLoading"
							clearable
							v-model="dialogFormModel.shelfId"
							placeholder="若无变更则留空"
							@visible-change="getShelfList"
						>
							<el-option
								v-for="item in shelfList"
								:key="item.id"
								:value="item.id"
								:label="item.name"
							></el-option>
						</el-select>
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
					<el-button
						@click="showInfoDialog = false"
					>
						取 消
					</el-button>
				</div>
			</el-dialog>
		</scan>
	</div>
</template>

<script>
import scan from '../../components/scan'
import relics from '../relics'
export default {
	props: {
		id: {
			required: true,
			type: Number
		}
	},
	components: {
		scan,
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
		// 是否正在扫描
		scanning: false,
		// 显示确认信息的 dialog
		showInfoDialog: false,
		// 显示确认操作的 dialog
		showConfirmDialog: false,
		// dialog表单
		dialogFormModel: {
			checkId: undefined,
			relicsId: undefined,
			warehouseId: undefined,
			shelfId: undefined
		},
		dialogLoading: false,
		// 仓库列表
		warehouseList: [],
		// 货架列表
		shelfList: [],
		warehouseOptionLoading: false,
		shelfOptionLoading: false
	}),
	methods: {
		// 监听扫码暂停开始
		handlerScanning(value) {
			this.scanning = value
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
		afterGetCode(targetId) {
			this.dialogFormModel.relicsId = targetId
			this.showInfoDialog = true
		},
		// 开始获取画面
		openScan() {
			this.$refs.scan.openScan()
		},
		// 获得仓库列表
		getWarehouseList() {
			const vm = this
			vm.warehouseOptionLoading = true
			this.api.relicsList.attrMap.warehouseId.remoteSelectApi().then(res => {
				vm.warehouseList = res.data.data
				vm.warehouseOptionLoading = false
			}).catch(err => {
				console.log('get warehouse list fail', err);
				vm.warehouseOptionLoading = false
			})
		},
		// 获得货架列表
		getShelfList() {
			const vm = this
			vm.shelfOptionLoading = true
			this.api.relicsList.attrMap.shelfId.remoteSelectApi(this.dialogFormModel.warehouseId).then(res => {
				vm.shelfList = res.data.data
				vm.shelfOptionLoading = false
			}).catch(err => {
				console.log('get shelf list fail', err);
				vm.shelfOptionLoading = false
			})
		},
		// 监听仓库id变化
		handlerWarehouseIdChange() {
			this.dialogFormModel.shelfId = ''
			this.shelfList = []
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
