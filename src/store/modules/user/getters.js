export default {
	// 是否登录
	hasLogin(state) {
		return !!state.userData.workId
	},
	// 用户名
	userName(state) {
		return state.userData.name
	}
}
