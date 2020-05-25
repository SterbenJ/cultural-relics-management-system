export default {
	// 更新职务信息
	updateJobsData(state, data) {
		state.jobs = {
			...state.jobs,
			...data
		}
	},
	// 更新职务信息
	updatePermissionsData(state, data) {
		state.permissions = {
			...state.permissions,
			...data
		}
	}
}
