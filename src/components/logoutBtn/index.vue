<template>
	<div id="button-logout-container">
		<el-button class="custom-button-logout" @click="logout" :loading="loading" type="danger">登出</el-button>
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
		// 登出
		logout() {
			const vm = this
			vm.loading = true
			this.api
				.logout
				.func()
				.then(response => {
					vm.loading = false
					vm.$emit('logout')
				})
				.catch(error => {
					vm.loading = false
					console.log('logout fail: ', error)
				})
		}
	}
}
</script>

<style lang="stylus">
#button-logout-container
.custom-button-logout
	width 100%
</style>
