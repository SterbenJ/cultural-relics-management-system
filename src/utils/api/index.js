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
		attrMap: {
			workId: {
				value: '工号',
				type: 'String',
				owner: ['form', 'result']
			},
			name: {
				value: '姓名',
				type: 'String',
				owner: ['result']
			},
			password: {
				value: '密码',
				type: 'String',
				owner: ['form']
			},
			jobId: {
				value: '职务ID',
				type: 'String',
				owner: ['result']
			},
			extraPermissionsId: {
				value: '额外权限ID',
				type: 'Array',
				owner: ['result']
			}
		}
	},

	// 登出
	logout: {
		func() {
			return axios({
				url: '/sessions',
				method: 'DELETE'
			})
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
		attrMap: {
			oldPassword: {
				value: '旧密码',
				type: 'String',
				owner: ['form']
			},
			newPassword: {
				value: '新密码',
				type: 'String',
				owner: ['form']
			}
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
		attrMap: {
			id: {
				value: '职务ID',
				type: 'String',
				owner: ['result']
			},
			name: {
				value: '职务名称',
				type: 'String',
				owner: ['result']
			},
			permissionsId: {
				value: '职务基础权限ID',
				type: 'Array',
				owner: ['result']
			}
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
		attrMap: {
			id: {
				value: '权限ID',
				type: 'String',
				owner: ['result']
			}
		},
		name: {
			value: '权限名称',
			type: 'String',
			owner: ['result']
		}
	},

	/**
	 *  仓库
	 */

	// 仓库信息查询
	warehousesList: {
		func(data) {
			return axios({
				url: '/warehouses',
				method: 'GET',
				params: data
			})
		},
		attrMap: {
			id: {
				value: '仓库ID',
				type: 'String',
				owner: ['result', 'edit']
			},
			name: {
				value: '仓库名称',
				type: 'String',
				owner: ['form', 'result', 'edit']
			},
			page: {
				value: '页码',
				type: 'number',
				owner: ['form']
			},
			count: {
				value: '单页显示数',
				type: 'number',
				owner: ['form']
			}
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
		attrMap: {
			id: {
				value: '仓库ID',
				type: 'String',
				owner: ['result']
			},
			name: {
				value: '仓库名称',
				type: 'String',
				owner: ['form', 'result']
			}
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
		attrMap: {
			id: {
				value: '仓库ID',
				type: 'String',
				owner: ['request', 'result']
			},
			name: {
				value: '仓库名称',
				type: 'String',
				owner: ['form', 'result']
			}
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
		attrMap: {
			id: {
				value: '仓库ID',
				type: 'String',
				owner: ['request']
			}
		}
	},

	/**
	 *  文物
	 */

	// 获取所有文物信息
	relicsList: {
		func(data) {
			return axios({
				url: '/relics',
				method: 'GET',
				params: data
			})
		},
		attrMap: {
			id: {
				value: '文物ID',
				type: 'String',
				owner: ['result', 'edit']
			},
			name: {
				value: '名称',
				type: 'String',
				owner: ['form', 'result', 'edit']
			},
			quantity: {
				value: '数量',
				type: 'number',
				owner: ['result', 'edit']
			},
			picturePath: {
				value: '照片',
				type: 'img',
				owner: ['result']
			},
			year: {
				value: '年代',
				type: 'String',
				owner: ['result', 'edit']
			},
			reign: {
				value: '年号',
				type: 'String',
				owner: ['result', 'edit']
			},
			type: {
				value: '器型',
				type: 'String',
				owner: ['result', 'edit']
			},
			source: {
				value: '来源',
				type: 'String',
				owner: ['result', 'edit']
			},
			size: {
				value: '尺寸',
				type: 'String',
				owner: ['result', 'edit']
			},
			weight: {
				value: '重量',
				type: 'number',
				owner: ['result', 'edit']
			},
			warehouseId: {
				value: '收储仓库ID',
				type: 'number',
				owner: ['result', 'edit']
			},
			place: {
				value: '收储地点',
				type: 'String',
				owner: ['result', 'edit']
			},
			enterPrice: {
				value: '入馆价值',
				type: 'number',
				owner: ['result']
			},
			leavePrice: {
				value: '离馆价值',
				type: 'String',
				owner: ['result']
			},
			statusId: {
				value: '文物状态',
				type: 'Select',
				owner: ['result', 'edit'],
				selectMap: {
					1: '待评估',
					2: '在馆',
					3: '外借',
					4: '修理',
					5: '离馆'
				}
			},
			lastCheckTime: {
				value: '最后盘点时间',
				type: 'date',
				owner: ['result']
			},
			enterTime: {
				value: '入馆时间',
				type: 'date',
				owner: ['result']
			},
			leaveTime: {
				value: '离馆时间',
				type: 'date',
				owner: ['result']
			},
			moveTime: {
				value: '移入仓库时间',
				type: 'date',
				owner: ['result']
			},
			lendTime: {
				value: '出借时间',
				type: 'date',
				owner: ['result']
			},
			fixTime: {
				value: '送修时间',
				type: 'date',
				owner: ['result']
			},
			updateTime: {
				value: '更新时间',
				type: 'date',
				owner: ['result']
			},
			comment: {
				value: '备注',
				type: 'String',
				owner: ['result', 'edit']
			},
			status: {
				value: '状态',
				type: 'Select',
				owner: ['form'],
				selectMap: {
					1: '待评估',
					2: '在馆',
					3: '外借',
					4: '修理',
					5: '离馆'
				}
			},
			page: {
				value: '页码',
				type: 'number',
				owner: ['form']
			},
			count: {
				value: '单页显示数',
				type: 'number',
				owner: ['form']
			},
			from: {
				value: '开始时间',
				type: 'date',
				owner: ['form']
			},
			to: {
				value: '结束时间',
				type: 'date',
				owner: ['form']
			},
			dateType: {
				value: '时间类型',
				type: 'Select',
				owner: ['form'],
				selectMap: {
					enter: '入馆时间',
					leave: '离馆时间',
					lend: '外借时间',
					fix: '送修时间'
				}
			}
		}
	},

	// 创建文物
	createRelics: {
		func(data) {
			return axios({
				url: '/relics',
				method: 'POST',
				data: data
			})
		}
	},

	// 更新文物,
	updateRelics: {
		func(data) {
			return axios({
				url: '/relics/' + data.id,
				method: 'PUT',
				data: data
			})
		}
	},

	// 删除文物
	deleteRelics: {
		func(data) {
			return axios({
				url: '/relics/' + data.id,
				method: 'DELETE'
			})
		}
	}
}
