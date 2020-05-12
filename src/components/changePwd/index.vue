<script>
const defaultFormModel = {
	oldPassword: '',
	newPassword: ''
}

export default {
	data() {
		return {
			loading: false,
			validateState: false,
			formModel: { ...defaultFormModel },
			formRules: {
				oldPassword: [
					{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					}
				],
				newPassword: [
					{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					},
					{
						min: 8,
						max: 24,
						message: '长度在 8 到 24 个字符',
						trigger: 'blur'
					}
				]
			}
		}
	}
}
</script>
