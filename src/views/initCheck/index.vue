<template>
	<div class="container-vertical-center container-horizontal-center">
		<el-form ref="formRef" :model="formModel" :rules="formRules">
			<el-form-item prop="warehouseId" :label="api.createCheck.attrMap.warehouseId.value">
				<el-input v-model="formModel.warehouseId"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button style="width: 100%;" type="primary" @click="startCheck">开始盘点</el-button>
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
			formRules: {
				warehouseId: [
					{
						required: true,
						message: '请输入仓库ID',
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
		}
	}
}
</script>

<style></style>
