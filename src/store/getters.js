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
		var resultPermission = Object.values(JSON.parse(JSON.stringify(state.permissions))).find(permission => permission.id === id)
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
	},
	// 获取职务selectMap对象
	getJobSelectMap(state) {
		var selectMap = {}
		const tmp = JSON.parse(JSON.stringify(state.jobs))
		for (const mprop of Object.keys(tmp)) {
			selectMap[state.jobs[mprop].id] = state.jobs[mprop].name
		}
		return selectMap
	},
	// 获取权限selectMap对象
	getPermissionSelectMap(state) {
		var selectMap = {}
		const tmp = JSON.parse(JSON.stringify(state.permissions))
		for (const mprop of Object.keys(tmp)) {
			selectMap[state.permissions[mprop].id] = state.permissions[mprop].name
		}
		return selectMap
	}
}
