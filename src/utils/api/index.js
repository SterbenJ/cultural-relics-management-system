import axios from './customAxios.js'

export default {
	// 登录
	login: {
		func(data) {
			return axios({
				url: '/sessions',
				method: 'POST',
				data: data
			})
		},
		requestParamMap: {
			workId: '工号',
			password: '密码'
		},
		resultAttrMap: {
			workId: '工号', // 工号
			name: '姓名', // 姓名
			jobId: '职务ID', // 职务ID
			extraPermissionsId: '额外权限ID' // 权限ID
		}
	},

	// 登出
	logout: {
		func() {
			return axios({
				url: '/sessions',
				method: 'DELETE'
			})
		},
		requestParamMap: {},
		resultAttrMap: {
			success: '登出状态'
		}
	},

	// 修改密码
	changePwd: {
		func(data) {
			return axios({
				url: '/users/password',
				method: 'PUT',
				data: data
			})
		},
		requestParamMap: {
			oldPassword: '旧密码',
			newPassword: '新密码'
		},
		resultAttrMap: {
			success: '更改密码状态'
		}
	},

	// 职务列表
	jobList: {
		func() {
			return axios({
				url: '/jobs',
				method: 'GET'
			})
		},
		requestParamMap: {},
		resultAttrMap: {
			id: '职务ID',
			name: '职务名称',
			permissionsId: '职务基础权限ID'
		}
	},

	// 权限列表
	permissionList: {
		func() {
			return axios({
				url: '/permissions',
				method: 'GET'
			})
		},
		requestParamMap: {},
		resultAttrMap: {
			id: '权限ID',
			name: '权限名称'
		}
	},

	// 仓库信息查询
	warehousesList: {
		func(data) {
			return axios({
				url: '/warehouses',
				method: 'GET',
				params: data
			})
		},
		requestParamMap: {
			name: '仓库名称',
			page: '页码',
			count: '单页显示数'
		},
		resultAttrMap: {
			id: '仓库ID',
			name: '仓库名称'
		}
	},

	// 创建仓库
	createWarehouse: {
		func(data) {
			return axios({
				url: '/warehouses',
				method: 'POST',
				data: data
			})
		},
		requestParamMap: {
			name: '仓库名称'
		},
		resultAttrMap: {
			id: '仓库ID',
			name: '仓库名称'
		}
	},

	// 修改仓库
	updateWarehouse: {
		func(data) {
			return axios({
				url: '/warehouses' + '/' + data.id,
				method: 'PUT',
				data: data
			})
		},
		requestParamMap: {
			name: '仓库名称'
		},
		resultAttrMap: {
			id: '仓库ID',
			name: '仓库名称'
		}
	},

	// 删除仓库
	deleteWarehouse: {
		func(data) {
			return axios({
				url: '/warehouses' + '/' + data.id,
				method: 'DELETE'
			})
		},
		requestParamMap: {
			id: '仓库ID'
		},
		resultAttrMap: {
			success: '删除仓库状态'
		}
	}
}
