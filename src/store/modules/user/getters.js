export default {
	// 是否登录
	hasLogin(state) {
		return !!state.userData.workId
	},
	// 用户名
	userName(state) {
		return state.userData.name
	},
	// 职务ID
	jobId(state) {
		return state.userData.jobId
	},
	// 获取所有权限列表
	getUserPermissionList(state, getters, rootState, rootGetters) {
		var resultArr = []
		resultArr = resultArr.concat(state.userData.extraPermissionsId)
		Object.values(JSON.parse(JSON.stringify(rootState.jobs))).forEach((currentValue, index, arr) => {
			if (currentValue.id === state.userData.jobId) {
				resultArr = resultArr.concat(currentValue.permissionsId)
			}
		})
		return resultArr
	},
	// 根据 id 找权限
	hasPermission: (state, getters) => (id) => {
		var resultPermission = getters.getUserPermissionList.find(permissionId => permissionId === id)
		return !!resultPermission
	}
}
