<template>
	<div class="container-vertical-center container-horizontal-center">
		<el-form label-position="left" ref="formRef" :model="formModel" :rules="formRules">
			<el-form-item prop="warehouseId" label="仓库">
				<el-select
					clearable
					:loading="optionWarehouseIdLoading"
					v-model="formModel.warehouseId"
					@visible-change="handlerWarehouseIdVisibleChange"
					@change="formModel.shelfId = undefined"
				>
					<el-option
						v-for="value in warehouseIdList"
						:key="value.id"
						:value="value.id"
						:label="value.name"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="shelfId" label="货架">
				<el-select
					clearable
					:loading="optionShelfIdLoading"
					v-model="formModel.shelfId"
					@visible-change="handlerShlefIdVisibleChange"
				>
					<el-option
						v-for="value in shelfIdList"
						:key="value.id"
						:value="value.id"
						:label="value.name"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="statusId" label="文物状态">
				<el-select clearable v-model="formModel.statusId">
					<el-option
						v-for="(value, key) in api.relicsList.attrMap.statusId.selectMap()"
						:key="key"
						:value="key"
						:label="value"
					></el-option>
				</el-select>
			</el-form-item>
			<!-- <el-form-item>
				<el-button
					style="width: 100%;"
					type="primary"
					plain
					@click="showCreateWarehouseDialog = true"
				>
					新建仓库
				</el-button>
			</el-form-item> -->
			<el-form-item>
				<el-button :disabled="!submitAble" style="width: 100%;" type="primary" @click="startBatchEdit">
					开始扫码修改
				</el-button>
			</el-form-item>
		</el-form>
		<el-dialog
			@closed="handlerClosedDialog"
			title="新建仓库"
			:visible.sync="showCreateWarehouseDialog"
		>
			<el-form
				label-position="top"
				ref="dialogFormRef"
				:model="dialogFormModel"
				:rules="dialogFormRules"
			>
				<el-form-item prop="name" :label="api.createWarehouse.attrMap.name.value">
					<el-input v-model="dialogFormModel.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="showCreateWarehouseDialog = false">取 消</el-button>
				<el-button type="primary" @click="createWarehouse">确 认</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { Message } from 'element-ui'
export default {
	data() {
		return {
			formModel: {
				shelfId: undefined,
				value: undefined
			},
			warehouseIdList: [],
			shelfIdList: [],
			attrList: [
				{
					label: '仓库',
					value: 'warehouseId'
				},
				{
					label: '文物状态',
					value: 'statusId'
				}
			],
			formRules: {
				attr: [
					{
						required: true,
						message: '请选择修改字段',
						trigger: 'blur'
					}
				],
				value: [
					{
						required: true,
						message: '请选择修改内容',
						trigger: 'blur'
					}
				]
			},
			optionWarehouseIdLoading: false,
			optionShelfIdLoading: false,
			validateState: true,
			showCreateWarehouseDialog: false,
			dialogFormModel: {
				name: ''
			},
			dialogFormRules: {
				name: [
					{
						required: true,
						message: '请输入仓库名称',
						trigger: 'blur'
					}
				]
			},
			dialogValidateState: true
		}
	},
	computed: {
		submitAble() {
			return (
				(this.formModel.warehouseId || this.formModel.shelfId || this.formModel.statusId) &&
				(this.formModel.warehouseId ? !!this.formModel.shelfId : true) &&
				(this.formModel.shelfId ? !!this.formModel.warehouseId : true)
			)
		}
	},
	methods: {
		// 开始批量修改
		async startBatchEdit() {
			// await this.touchValidate()
			// if (!this.validateState) {
			// 	return
			// }
			this.$router.push({ name: 'scanEditInfo', query: this.formModel })
		},
		// 触发表单校验
		touchValidate() {
			const vm = this
			this.$refs.formRef.validate((result, object) => {
				vm.validateState = result
			})
		},
		// 新建仓库
		async createWarehouse() {
			await this.touchDialogValidate()
			if (!this.dialogValidateState) {
				return
			}
			const vm = this
			this.api.createWarehouse
				.func(this.dialogFormModel)
				.then(res => {
					console.log('create warehouse success')
					Message.success('新建成功')
					vm.showCreateWarehouseDialog = false
				})
				.catch(err => {
					console.log('create warehouse fail', err)
					vm.showCreateWarehouseDialog = false
				})
		},
		// 触发 dialog 表单校验
		touchDialogValidate() {
			const vm = this
			this.$refs.dialogFormRef.validate((result, object) => {
				vm.dialogValidateState = result
			})
		},
		// 监听仓库ID select 开关
		handlerWarehouseIdVisibleChange(event) {
			// 打开的时候加载远程选项
			const vm = this
			if (event) {
				vm.optionWarehouseIdLoading = true
				vm.api.createCheck.attrMap.warehouseId
					.remoteSelectApi()
					.then(res => {
						console.log('get warehouse options success')
						vm.warehouseIdList = res.data.data
						vm.optionWarehouseIdLoading = false
					})
					.catch(err => {
						console.log('get warehouse options fail', err)
						vm.optionWarehouseIdLoading = false
					})
			}
		},
		// 监听货架ID select 开关
		handlerShlefIdVisibleChange(event) {
			// 打开的时候加载远程选项
			const vm = this
			if (event) {
				vm.optionShelfIdLoading = true
				vm.api.createCheck.attrMap.shelfId
					.remoteSelectApi(vm.formModel.warehouseId)
					.then(res => {
						console.log('get shelf options success')
						vm.shelfIdList = res.data.data
						vm.optionShelfIdLoading = false
					})
					.catch(err => {
						console.log('get shelf options fail', err)
						vm.optionShelfIdLoading = false
					})
			}
		},
		// 监听 dialog 关闭
		handlerClosedDialog() {
			this.$refs.dialogFormRef.resetFields()
		}
	}
}
</script>

<style></style>
