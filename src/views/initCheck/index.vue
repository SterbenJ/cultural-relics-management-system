<template>
	<div class="container-vertical-center container-horizontal-center">
		<el-form ref="formRef" :model="formModel" :rules="formRules">
			<el-form-item prop="warehouseId" :label="api.createCheck.attrMap.warehouseId.value">
				<el-select v-model="formModel.warehouseId" @visible-change="handlerVisibleChange">
					<el-option
						v-for="value in warehouseIdList"
						:key="value.id"
						:value="value.id"
						:label="value.name"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button style="width: 100%;" type="primary" @click="startCheck">
					开始盘点
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			formModel: {
				warehouseId: ''
			},
			warehouseIdList: [],
			formRules: {
				warehouseId: [
					{
						required: true,
						message: '请选择仓库',
						trigger: 'blur'
					}
				]
			},
			validateState: true
		}
	},
	methods: {
		// 开始盘点
		async startCheck() {
			await this.touchValidate()
			if (!this.validateState) {
				return
			}
			const vm = this
			this.api.createCheck
				.func(this.formModel)
				.then(res => {
					console.log('start check')
					vm.$router.push('/check/' + res.data.data.id)
				})
				.catch(err => {
					console.log('start check fail', err)
				})
		},
		// 触发表单校验
		touchValidate() {
			const vm = this
			this.$refs.formRef.validate((result, object) => {
				vm.validateState = result
			})
		},
		// 监听select开关
		handlerVisibleChange(event) {
			// 打开的时候加载远程选项
			const vm = this
			if (event) {
				vm.api.createCheck.attrMap.warehouseId
					.remoteSelectApi()
					.then(res => {
						console.log('get options success')
						vm.warehouseIdList = res.data.data
					})
					.catch(err => {
						console.log('get options fail', err)
					})
			}
		}
	}
}
</script>

<style></style>
