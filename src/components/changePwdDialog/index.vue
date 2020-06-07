<template>
	<el-dialog
		:before-close="handleClose"
		destroy-on-close
		title="修改密码"
		:visible.sync="changePwdDialogVisible"
		width="40%"
	>
		<el-form label-position="left" ref="formRef" :model="formModel" :rules="formRules">
			<el-form-item prop="oldPassword">
				<el-input v-model="formModel.oldPassword" type="password" show-password placeholder="旧密码"></el-input>
			</el-form-item>
			<el-form-item prop="newPassword">
				<el-input v-model="formModel.newPassword" type="password" show-password placeholder="新密码"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" @click="changePwd">修 改</el-button>
		</span>
	</el-dialog>
</template>

<script>
import changePwd from '../changePwd'
import {
	// Loading,
	Message
} from 'element-ui'
export default {
	extends: changePwd,
	props: ['changePwdDialogVisible'],
	methods: {
		handleClose(done) {
			this.$emit('update:changePwdDialogVisible', false)
			// 清空表单
			this.$refs.formRef.resetFields()
			done()
		},
		// 更改密码
		async changePwd() {
			const vm = this
			await this.touchValidate()
			if (!this.validateState) {
				this.loading = false
				return
			}
			this.api
				.changePwd
				.func(this.formModel)
				.then(response => {
					vm.loading = false
					Message.success('修改密码成功')
					vm.handleClose()
				})
				.catch(error => {
					vm.loading = false
					console.log('changpwd fail', error)
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
