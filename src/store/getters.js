export default {
	// 根据 id 找职务
	getJobById: (state) => (id) => {
		var resultJob = state.jobs.values().find(job => job.id === id)
		if (resultJob) return resultJob
		return {
			id: id,
			name: '职务不存在'
		}
	},
	// 根据 id 找权限
	getPermissionById: (state) => (id) => {
		var resultPermission = state.permissions.values().find(permission => permission.id === id)
		if (resultPermission) return resultPermission
		return {
			id: id,
			name: '权限不存在'
		}
	},
	// 根据 id 找职务
	getJobName(state, getters) {
		var resultJob = Object.values(JSON.parse(JSON.stringify(state.jobs))).find(job => job.id === state.user.userData.jobId)
		if (resultJob) return resultJob.name
		return '职务不存在'
	}
}
