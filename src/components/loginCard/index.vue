<template>
	<div class="main-container">
		<el-form ref="formRef" :rules="formRules" style="width: 350px;" :model="formModel">
			<el-form-item>
				<div class="font-title-extra-large login-card-title">故宫文物管理系统</div>
			</el-form-item>
			<el-form-item prop="workId">
				<el-input
					v-model="formModel.workId"
					placeholder="工号"
					prefix-icon="el-icon-user"
				/>
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					v-model="formModel.password"
					placeholder="密码"
					prefix-icon="el-icon-key"
					type="password"
					show-password
				/>
			</el-form-item>
			<el-form-item>
				<el-row type="flex" justify="end">
					<el-popover
						placement="right-end"
						trigger="hover"
						content="请联系管理员"
						width="200"
					>
						<el-link :underline="false" slot="reference" type="info">
							忘记密码？
						</el-link>
					</el-popover>
				</el-row>
			</el-form-item>
			<el-form-item>
				<el-button @click="login" :loading="logining" style="width: 100%;" type="primary">
					登入
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
	data() {
		return {
			formModel: {
				workId: '',
				password: ''
			},
			formRules: {
				workId: [
					{
						required: true,
						message: '请输入工号',
						trigger: 'blur'
					},
					{
						max: 10,
						message: '长度不能大于 10 个字符',
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}
				]
			},
			logining: false,
			validateState: true
		}
	},
	methods: {
		...mapMutations({
			updateUserData: 'user/updateUserData', // 更新当前用户信息
			updatePermissionsData: 'updatePermissionsData',
			updateJobsData: 'updateJobsData'
		}),
		// 登入
		async login() {
			const vm = this
			this.logining = true
			await this.touchValidate()
			if (!this.validateState) {
				vm.logining = false
				return
			}
			await this.api
				.login
				.func(vm.formModel)
				.then(response => {
					vm.logining = false
					// 获取权限、职务列表
					vm.api
						.jobList.func()
						.then(response => {
							vm.updateJobsData(response.data.data)
						})
						.catch(error => {
							console.log('get jobs fail', error);
						})
					vm.api
						.permissionList
						.func()
						.then(response => {
							vm.updatePermissionsData(response.data.data)
						})
						.catch(error => {
							console.log('get permissions fail', error);
						})
					// 更新用户信息
					vm.updateUserData(response.data.data)
					if (response.data.msg === 'success') {
						vm.jumpToIndex()
					}
				})
				.catch(error => {
					console.log(error)
					vm.logining = false
				})
		},
		// 触发表单校验
		touchValidate() {
			const vm = this
			this.$refs.formRef.validate((result, object) => {
				vm.validateState = result
			})
		},
		// 跳转到主页
		jumpToIndex() {
			this.$router.replace('/')
		}
	},
	mounted() {}
}
</script>

<style lang="stylus">
.main-container
	margin 0 auto
	box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
	padding 18px 24px
	background-color rgba(0, 0, 0, 0.1)
	.login-card-title
		text-align center
</style>
