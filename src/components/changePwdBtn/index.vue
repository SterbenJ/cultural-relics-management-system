<template>
	<div id="button-changepwd-container">
		<el-button
			class="custom-button-changepwd"
			@click="showChangePwdDialog"
			:loading="loading"
			type="infor"
		>
			修改密码
		</el-button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loading: false
		}
	},
	methods: {
		// 显示 dialog
		showChangePwdDialog() {
			this.$emit('showChangePwdDialog')
		}
	}
}
</script>

<style lang="stylus">
#button-changepwd-container, .custom-button-changepwd
	width 100%
</style>
