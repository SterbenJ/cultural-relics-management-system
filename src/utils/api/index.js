import axios from './customAxios.js'
import store from '../../store'

function escapeAttr(data) {
	for (const key in data) {
		data[key] = escape(data[key])
	}
	return data
}

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
				type: 'Number',
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
				type: 'Number',
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
				params: escapeAttr(data)
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
				type: 'Number',
				owner: ['form']
			},
			count: {
				value: '单页显示数',
				type: 'Number',
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
				type: 'Number',
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
				type: 'Number',
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
				type: 'Number',
				owner: ['request']
			}
		}
	},

	/**
	 *  文物
	 */

	// 获取单个文物详情
	relics: {
		func(data) {
			return axios({
				url: 'relics/' + data.id,
				method: 'GET'
			})
		}
	},

	// 获取所有文物信息
	relicsList: {
		func(data) {
			return axios({
				url: '/relics',
				method: 'GET',
				params: escapeAttr(data)
			})
		},
		attrMap: {
			id: {
				value: '文物ID',
				type: 'Number',
				owner: ['result', 'edit']
			},
			name: {
				value: '名称',
				type: 'String',
				owner: ['form', 'result', 'edit'],
				permission: 5
			},
			quantity: {
				value: '数量',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: 5
			},
			picturePath: {
				value: '照片',
				type: 'img',
				owner: ['result']
			},
			year: {
				value: '年代',
				type: 'String',
				owner: ['result', 'edit'],
				permission: 5
			},
			reign: {
				value: '年号',
				type: 'String',
				owner: ['result', 'edit'],
				permission: 5
			},
			type: {
				value: '器型',
				type: 'String',
				owner: ['result', 'edit'],
				permission: 5
			},
			source: {
				value: '来源',
				type: 'String',
				owner: ['result', 'edit'],
				permission: 5
			},
			size: {
				value: '尺寸',
				type: 'String',
				owner: ['result', 'edit'],
				permission: 5
			},
			weight: {
				value: '重量 (千克)',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: 5
			},
			warehouseId: {
				value: '收储仓库ID',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: 5
			},
			warehouse: {
				value: '仓库ID',
				type: 'Number',
				owner: ['form']
			},
			shelf: {
				value: '货架ID',
				type: 'Number',
				owner: ['form']
			},
			shelfId: {
				value: '收储货架ID',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: 5
			},
			enterPrice: {
				value: '入馆价值 (人民币)',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: 7
			},
			leavePrice: {
				value: '离馆价值 (人民币)',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: 7
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
				},
				permission: 5
			},
			lastCheckTime: {
				value: '最后盘点时间',
				type: 'date',
				owner: ['result']
			},
			enterTime: {
				value: '入馆时间',
				type: 'date',
				owner: ['result'],
				permission: 2
			},
			leaveTime: {
				value: '离馆时间',
				type: 'date',
				owner: ['result'],
				permission: 2
			},
			moveTime: {
				value: '移入仓库时间',
				type: 'date',
				owner: ['result'],
				permission: 2
			},
			lendTime: {
				value: '出借时间',
				type: 'date',
				owner: ['result'],
				permission: 2
			},
			fixTime: {
				value: '送修时间',
				type: 'date',
				owner: ['result'],
				permission: 2
			},
			updateTime: {
				value: '更新时间',
				type: 'date',
				owner: ['result']
			},
			comment1: {
				value: '备注1',
				type: 'String',
				owner: ['result', 'edit'],
				permission: 5
			},
			comment2: {
				value: '备注2',
				type: 'String',
				owner: ['result', 'edit'],
				permission: 5
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
				type: 'Number',
				owner: ['form']
			},
			count: {
				value: '单页显示数',
				type: 'Number',
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
	},

	// 获取用户信息
	userList: {
		func(data) {
			return axios({
				url: '/users',
				method: 'GET',
				params: escapeAttr(data)
			})
		},
		attrMap: {
			id: {
				value: '编号',
				type: 'Number',
				owner: ['result', 'edit']
			},
			workId: {
				value: '工号',
				type: 'Number',
				owner: ['result', 'edit']
			},
			name: {
				value: '姓名',
				type: 'String',
				owner: ['result', 'edit']
			},
			jobId: {
				value: '职务',
				type: 'Select',
				owner: ['result', 'edit'],
				selectMap: store.getters.getJobSelectMap
			},
			extraPermissionsId: {
				value: '额外权限',
				type: 'mulitSelect',
				owner: ['result', 'edit'],
				selectMap: store.getters.getPermissionSelectMap
			},
			telephone: {
				value: '手机号',
				type: 'String',
				owner: ['result', 'edit']
			},
			password: {
				value: '新密码',
				type: 'String',
				owner: ['edit']
			},
			page: {
				value: '页码',
				type: 'Number',
				owner: ['form']
			},
			count: {
				value: '单页显示数',
				type: 'Number',
				owner: ['form']
			}
		}
	},

	// 创建用户
	createUser: {
		func(data) {
			return axios({
				url: '/users',
				method: 'POST',
				data: data
			})
		}
	},

	// 更新文物,
	updateUser: {
		func(data) {
			return axios({
				url: '/users/' + data.id,
				method: 'PUT',
				data: data
			})
		}
	},

	// 删除用户
	deleteUser: {
		func(data) {
			return axios({
				url: '/users/' + data.id,
				method: 'DELETE'
			})
		}
	},

	// 获取货架
	shelvesList: {
		func(data) {
			return axios({
				url: '/shelves',
				methods: 'GET',
				params: escapeAttr(data)
			})
		},
		attrMap: {
			id: {
				value: '货架ID',
				type: 'Number',
				owner: ['result', 'edit']
			},
			name: {
				value: '名称',
				type: 'String',
				owner: ['result', 'edit', 'form']
			},
			warehouseId: {
				value: '仓库ID',
				type: 'Number',
				owner: ['result', 'edit', 'form']
			},
			page: {
				value: '页码',
				type: 'Number',
				owner: ['form']
			},
			count: {
				value: '单页显示数',
				type: 'Number',
				owner: ['form']
			}
		}
	},

	// 创建货架
	createShelves: {
		func(data) {
			return axios({
				url: '/shelves',
				method: 'POST',
				data: data
			})
		}
	},

	// 更新货架,
	updateShelves: {
		func(data) {
			return axios({
				url: '/shelves/' + data.id,
				method: 'PUT',
				data: data
			})
		}
	},

	// 删除货架
	deleteShelves: {
		func(data) {
			return axios({
				url: '/shelves/' + data.id,
				method: 'DELETE'
			})
		}
	},

	// 文物盘点列表
	checkList: {
		func(data) {
			return axios({
				url: '/checks',
				method: 'GET',
				params: escapeAttr(data)
			})
		},
		attrMap: {
			id: {
				value: '盘点ID',
				type: 'Number',
				owner: ['result']
			},
			warehouseId: {
				value: '盘点仓库ID',
				type: 'Number',
				owner: ['result', 'form']
			},
			checkCount: {
				value: '盘点文物个数',
				type: 'Number',
				owner: ['result']
			},
			abnormalCount: {
				value: '异常文物数',
				type: 'Number',
				owner: ['result']
			},
			startTime: {
				value: '盘点开始时间',
				type: 'date',
				owner: ['result']
			},
			endTime: {
				value: '盘点结束时间',
				type: 'date',
				owner: ['result']
			}
		}
	},

	// 某次盘点
	checkRelicsList: {
		func(data) {
			const id = data.id
			delete data.id
			return axios({
				url: '/checks/' + id + '/relics',
				method: 'GET',
				params: escapeAttr(data)
			})
		},
		attrMap: {
			relicId: {
				value: '文物ID',
				type: 'Number',
				owner: ['result']
			},
			name: {
				value: '文物名称',
				type: 'StrIng',
				owner: ['result']
			},
			picturePath: {
				value: '照片',
				type: 'img',
				owner: ['result']
			},
			oldWarehouseId: {
				value: '盘点前收储仓库ID',
				type: 'Number',
				owner: ['result']
			},
			oldShelfId: {
				value: '盘点前收储货架ID',
				type: 'Number',
				owner: ['result']
			},
			newWarehouseId: {
				value: '盘点后收储仓库ID',
				type: 'Number',
				owner: ['result']
			},
			newShelfId: {
				value: '盘点后收储货架ID',
				type: 'Number',
				owner: ['result']
			},
			operatorName: {
				value: '盘点人姓名',
				type: 'String',
				owner: ['result']
			},
			checkTime: {
				value: '盘点时间',
				type: 'date',
				owner: ['result']
			},
			checked: {
				value: '状态',
				type: 'Select',
				owner: ['form'],
				selectMap: {
					true: '已盘点',
					false: '未盘点'
				}
			}
		}
	},

	// 开始一次盘点
	createCheck: {
		func(data) {
			return axios({
				url: '/checks/sessions',
				method: 'POST',
				data: data
			})
		},
		attrMap: {
			warehouseId: {
				value: '盘点仓库ID',
				type: 'Number',
				owner: ['form']
			}
		}
	},

	// 结束某盘点
	finishCheck: {
		func(data) {
			return axios({
				url: '/checks/sessions/' + data.id,
				method: 'DELETE'
			})
		}
	},

	// 盘点
	check: {
		func(data) {
			const checkId = data.checkId
			const relicsId = data.relicsId
			delete data.checkId
			delete data.relicsId
			return axios({
				url: '/checks/' + checkId + '/relics/' + relicsId,
				method: 'PUT',
				data: data
			})
		},
		attrMap: {
			warehouseId: {
				value: '当前仓库ID',
				type: 'Number',
				owner: ['edit']
			},
			shelfId: {
				value: '当前货架ID',
				type: 'Number',
				owner: ['edit']
			}
		}
	}
}
