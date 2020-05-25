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
							继续扫码
						</el-button>
						<el-button
							style="box-shadow: 0px 0px 10px #d96767;"
							class="font-title-extra-large check-dialog-action-button"
							type="danger"
							round
							icon="el-icon-close"
							@click="showConfirmDialog = true"
						>
							退出
						</el-button>
						<el-dialog
							title="确定退出？"
							:visible.sync="showConfirmDialog"
							:show-close="false"
							:destroy-on-close="true"
							width="60%"
							:center="true"
							:modal="false"
						>
							<span slot="footer" class="dialog-footer">
								<el-button @click="showConfirmDialog = false">取 消</el-button>
								<el-button type="danger" @click="exitScan">确 定</el-button>
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
				<relics ref="relics" :simple="true" :id="dialogFormModel.relicsId" />
				<div slot="footer" class="dialog-footer">
					<el-button @click="showInfoDialog = false">取 消</el-button>
					<el-button type="primary" @click="openEditDialog">编 辑</el-button>
				</div>
			</el-dialog>
			<el-dialog
				:visible.sync="showEditDialog"
				:close-on-click-modal="false"
				:close-on-press-escape="false"
				:show-close="false"
				:fullscreen="true"
				:center="true"
			>
				<div
					class="container-vertical-center container-horizontal-center"
					v-if="dialogModelList.length === 0"
				>
					没有权限
				</div>
				<el-form :model="dialogFormModel" label-position="top">
					<el-form-item
						v-for="value in dialogModelList"
						:key="value"
						:label="api.relicsList.attrMap[value].value"
					>
						<el-select
							v-if="api.relicsList.attrMap[value].type === 'Select'"
							v-model="dialogFormModel[value]"
						>
							<el-option
								v-for="(value, key) in api.relicsList.attrMap[value].selectMap()"
								:key="isNaN(Number(key)) ? key : Number(key)"
								:value="isNaN(Number(key)) ? key : Number(key)"
								:label="value"
							></el-option>
						</el-select>
						<el-input v-else v-model="dialogFormModel[value]"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="showEditDialog = false">取 消</el-button>
					<el-button
						v-if="dialogModelList.length > 0"
						type="primary"
						@click="updateRelics"
					>
						确认更改
					</el-button>
				</div>
			</el-dialog>
		</scan>
	</div>
</template>

<script>
import scan from '../../components/scan'
import relics from '../relics'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
export default {
	components: {
		scan,
		relics
	},
	computed: {
		...mapGetters({
			hasPermission: 'user/hasPermission'
		})
	},
	data: () => ({
		// 是否正在扫描
		scanning: false,
		// 显示确认信息的 dialog
		showInfoDialog: false,
		// 是否显示更改表单
		showEditDialog: false,
		// 显示确认操作的 dialog
		showConfirmDialog: false,
		// dialog表单
		dialogFormModel: {},
		// 表单中可以编辑的内容
		dialogModelList: [],
		dialogLoading: false
	}),
	methods: {
		// 初始化 dialog 属性列表
		initDialogModelList() {
			const iList = []
			console.log(this.api.relicsList.attrMap)
			Object.keys(this.api.relicsList.attrMap)
				.filter(value => {
					return this.api.relicsList.attrMap[value].owner.indexOf('edit') !== -1
				})
				.forEach((currentValue, index, arr) => {
					this.$set(this.dialogFormModel, currentValue, '')
					if (currentValue !== 'id') {
						if (!this.api.relicsList.attrMap[currentValue].permission) {
							iList.push(currentValue)
						} else {
							for (const tmpPermission of this.api.relicsList.attrMap[currentValue]
								.permission) {
								if (this.hasPermission(tmpPermission)) {
									iList.push(currentValue)
									break
								}
							}
						}
					}
				})
			this.$set(this.$data, 'dialogModelList', iList)
		},
		// 监听扫码暂停开始
		handlerScanning(value) {
			this.scanning = value
		},
		// 关闭dialog后
		handlerDialogClose() {},
		// 打开编辑dialog
		openEditDialog() {
			for (const key in this.dialogFormModel) {
				this.dialogFormModel[key] = this.$refs.relics.relicsData[key]
			}
			this.showEditDialog = true
		},
		// 退出
		exitScan() {
			this.showConfirmDialog = false
			this.$router.push({
				name: 'login'
			})
		},
		// 扫描到二维码后的处理
		afterGetCode(targetId) {
			this.dialogFormModel.relicsId = targetId
			this.showInfoDialog = true
		},
		openScan() {
			this.$refs.scan.openScan()
		},
		// 更新文物信息
		updateRelics() {
			const vm = this
			this.api.updateRelics
				.func(this.dialogFormModel)
				.then(res => {
					console.log('updateRelics success')
					vm.showEditDialog = false
					vm.showInfoDialog = false
					Message.success('修改成功')
				})
				.catch(err => {
					console.log('updateRelics fail', err)
				})
		}
	},
	mounted() {
		this.initDialogModelList()
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
