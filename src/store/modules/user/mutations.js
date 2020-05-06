export default {
	// 更新用户信息
	updateUserData(state, data) {
		state.userData = { ...state.userData, ...data }
	},
	// 删除用户信息
	deleteUserData(state) {
		for (var item in state.userData) {
			state.userData[item] = ''
		}
	}
}
