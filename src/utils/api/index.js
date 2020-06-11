import axios from './customAxios.js'
import store from '../../store'
import config from '../config'

function escapeAttr(data) {
	// const result = {}
	// for (const key in data) {
	// 	let tmpStr = ''
	// 	for (const char of String(data[key])) {
	// 		if (escape(char).indexOf('%u') !== -1) {
	// 			tmpStr = tmpStr + char
	// 		} else {
	// 			tmpStr = tmpStr + escape(char)
	// 		}
	// 	}
	// 	result[key] = tmpStr
	// }
	// return result
	return data
}

/**
 *  其它
 */

// 获得仓库列表
function warehousesIdList() {
	return axios({
		url: '/warehouses',
		method: 'GET'
	})
}

// 获得货架列表
function shelfIdList(id) {
	return axios({
		url: '/shelves',
		method: 'GET',
		params: {
			warehouseId: id
		}
	})
}

// 根据环境转换url
function translateUrlWithoutApi(url) {
	console.log('translateUrlWithoutApi', config.host + url);
	return config.host + url
}

// 根据环境转换url
function translateUrl(url) {
	return config.requestPrefix + url
}

// 获取用户列表
function getUserList(data) {
	return axios({
		url: '/users',
		method: 'GET',
		params: escapeAttr(data)
	})
}

export default {

	/**
	 * 	工具方法
	 */
	utils: {
		// 下载文件
		download(url) {
			axios({
				responseType: 'blob',
				url: translateUrlWithoutApi(url),
				method: 'GET',
				baseURL: ''
			}).then(res => {
				if (res.status === 200) {
					const url = window.URL.createObjectURL(
						res.data
					)
					const link = document.createElement('a')
					link.style.display = 'none'
					link.href = url
					console.log(
						res.headers['content-disposition']
					)
					link.setAttribute(
						'download',
						decodeURI(res.headers[
							'content-disposition'
						].split(';')[1].split('=')[1])
					) // 自定义下载文件名（如exemple.txt）
					document.body.appendChild(link)
					link.click()
				}
			})
		},
		// 根据环境转换 url (无api前缀)
		realUrlWithoutApi(url) {
			if (!url) {
				return ''
			}
			return translateUrlWithoutApi(url)
		},
		// 根据环境转换 url
		realUrl(url) {
			if (!url) {
				return ''
			}
			return translateUrl(url)
		}
	},

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
				permission: [5]
			},
			quantity: {
				value: '数量',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: [5]
			},
			picturePath: {
				value: '照片',
				type: 'img',
				owner: ['result']
			},
			year: {
				value: '年代',
				type: 'Select',
				owner: ['result', 'edit'],
				permission: [5],
				selectMap() {
					return {
						夏: '夏',
						商: '商',
						西周: '西周',
						东周: '东周',
						春秋: '春秋',
						战国: '战国',
						秦: '秦',
						西汉: '西汉',
						东汉: '东汉',
						三国: '三国',
						两晋: '两晋',
						东晋: '东晋',
						南北朝: '南北朝',
						隋唐: '隋唐',
						五代十国: '五代十国',
						宋: '宋',
						元: '元',
						明: '明',
						清: '清',
						近代: '近代'
					}
				}
			},
			reign: {
				value: '年号',
				type: 'String',
				owner: ['result', 'edit'],
				permission: [5]
			},
			type: {
				value: '器型',
				type: 'String',
				owner: ['result', 'edit'],
				permission: [5]
			},
			source: {
				value: '来源',
				type: 'String',
				owner: ['result', 'edit'],
				permission: [5]
			},
			size: {
				value: '尺寸',
				type: 'String',
				owner: ['result', 'edit'],
				permission: [5]
			},
			weight: {
				value: '重量 (千克)',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: [5]
			},
			warehouseId: {
				value: '仓库',
				type: 'remoteSelect',
				owner: ['edit'],
				permission: [9],
				remoteSelectApi: warehousesIdList,
				selectChild: 'shelfId'
			},
			warehouseName: {
				value: '仓库',
				type: 'String',
				owner: ['result'],
				permission: [9]
			},
			warehouse: {
				value: '仓库',
				type: 'remoteSelect',
				owner: ['form'],
				remoteSelectApi: warehousesIdList,
				selectChild: 'shelf'
			},
			shelf: {
				value: '货架',
				type: 'remoteSelect',
				owner: ['form'],
				remoteSelectApi: shelfIdList,
				selectParent: 'warehouse'
			},
			shelfId: {
				value: '货架',
				type: 'remoteSelect',
				owner: ['edit'],
				permission: [9],
				remoteSelectApi: shelfIdList,
				selectParent: 'warehouseId'
			},
			shelfName: {
				value: '货架',
				type: 'String',
				owner: ['result'],
				permission: [9]
			},
			enterPrice: {
				value: '入馆价值 (人民币)',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: [7]
			},
			leavePrice: {
				value: '离馆价值 (人民币)',
				type: 'Number',
				owner: ['result', 'edit'],
				permission: [7]
			},
			statusId: {
				value: '文物状态',
				type: 'Select',
				owner: ['result', 'edit'],
				selectMap() {
					return {
						1: '待评估',
						2: '在馆',
						3: '外借',
						4: '修理',
						5: '离馆'
					}
				},
				permission: [6, 14],
				needOtherAttr: {
					2: ['warehouseId', 'shelfId']
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
				owner: ['result'],
				permission: 2
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
			comment1: {
				value: '备注1',
				type: 'String',
				owner: ['result', 'edit'],
				permission: [5]
			},
			comment2: {
				value: '备注2',
				type: 'String',
				owner: ['result', 'edit'],
				permission: [5]
			},
			status: {
				value: '状态',
				type: 'Select',
				owner: ['form'],
				selectMap() {
					return {
						1: '待评估',
						2: '在馆',
						3: '外借',
						4: '修理',
						5: '离馆'
					}
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
				selectMap() {
					return {
						enter: '入馆时间',
						leave: '离馆时间',
						lend: '外借时间',
						fix: '送修时间'
					}
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

	// 导出文物一览表
	relicsExcel: {
		func(data) {
			const tmpData = { ...data }
			tmpData.excel = true
			return axios({
				url: '/relics',
				method: 'GET',
				params: tmpData
			})
		},
		attrMap: {
			filePath: {
				value: '文件路径',
				type: 'String',
				owner: ['']
			}
		}
	},

	/**
	 *  用户管理
	 */

	// 获取用户信息列表
	userList: {
		func(data) {
			return getUserList(data)
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
				selectMap() {
					return store.getters.getJobSelectMap
				}
			},
			extraPermissionsId: {
				value: '额外权限',
				type: 'mulitSelect',
				owner: ['result', 'edit'],
				selectMap() {
					return store.getters.getPermissionSelectMap
				}
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

	// 更新用户,
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

	// 导出用户表
	userExcel: {
		func(data) {
			const tmpData = { ...data }
			tmpData.excel = true
			return axios({
				url: '/users',
				method: 'GET',
				params: tmpData
			})
		},
		attrMap: {
			filePath: {
				value: '文件路径',
				type: 'String',
				owner: ['']
			}
		}
	},

	/**
	 *  货架
	 */

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
				value: '仓库',
				type: 'remoteSelect',
				owner: ['edit', 'form'],
				remoteSelectApi: warehousesIdList
			},
			warehouseName: {
				value: '仓库',
				type: 'String',
				owner: ['result']
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

	/**
	 *  盘点
	 */

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
				value: '盘点仓库',
				type: 'remoteSelect',
				owner: ['form'],
				remoteSelectApi: warehousesIdList
			},
			warehouseName: {
				value: '盘点仓库名',
				type: 'String',
				owner: ['result']
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
				owner: []
			},
			oldWarehouseName: {
				value: '盘点前收储仓库',
				type: 'String',
				owner: ['result']
			},
			oldShelfId: {
				value: '盘点前收储货架ID',
				type: 'Number',
				owner: []
			},
			oldShelfName: {
				value: '盘点前收储货架',
				type: 'Number',
				owner: ['result']
			},
			newWarehouseId: {
				value: '盘点后收储仓库ID',
				type: 'Number',
				owner: []
			},
			newWarehouseName: {
				value: '盘点后收储仓库',
				type: 'String',
				owner: ['result']
			},
			newShelfId: {
				value: '盘点后收储货架ID',
				type: 'Number',
				owner: []
			},
			newShelfName: {
				value: '盘点后收储货架',
				type: 'String',
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
				selectMap() {
					return {
						true: '已盘点',
						false: '未盘点'
					}
				}
			}
		}
	},

	// 导出某次盘点
	checkRelicsExcel: {
		func(data) {
			const tmpData = { ...data }
			delete data.id
			tmpData.excel = true
			return axios({
				url: '/checks/' + tmpData.id + '/relics',
				method: 'GET',
				params: tmpData
			})
		},
		attrMap: {
			filePath: {
				value: '文件路径',
				type: 'String',
				owner: ['']
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
				value: '盘点仓库',
				type: 'remoteSelect',
				owner: ['form'],
				remoteSelectApi: warehousesIdList
			},
			shelfId: {
				value: '货架',
				type: 'remoteSelect',
				owner: ['form'],
				remoteSelectApi: shelfIdList
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
				value: '当前仓库',
				type: 'remoteSelect',
				owner: ['edit']
			},
			shelfId: {
				value: '当前货架',
				type: 'remoteSelect',
				owner: ['edit']
			}
		}
	},

	/**
	 *  操作记录
	 */

	// 获取操作记录
	operationsList: {
		func(data) {
			return axios({
				url: '/operations',
				method: 'GET',
				params: data
			})
		},
		attrMap: {
			id: {
				value: '记录ID',
				type: 'String',
				owner: ['result']
			},
			operatorName: {
				value: '操作人',
				type: 'remoteSelect',
				owner: ['result', 'form'],
				remoteSelectApi: getUserList
			},
			itemType: {
				value: '操作对象类型',
				type: 'Select',
				owner: ['result', 'form'],
				selectMap: function() {
					return {
						relic: '文物',
						warehouse: '仓库',
						shelf: '货架',
						user: '用户',
						check: '盘点'
					}
				}
			},
			itemId: {
				value: '操作对象ID',
				type: 'String',
				owner: ['result']
			},
			type: {
				value: '操作类型',
				type: 'String',
				owner: ['result']
			},
			detail: {
				value: '详细日志',
				type: 'String',
				owner: ['result']
			},
			createTime: {
				value: '操作时间',
				type: 'date',
				owner: ['result']
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
			}
		}
	},

	// 导出操作记录表格
	operationsExcel: {
		func(data) {
			const tmpData = { ...data }
			tmpData.excel = true
			return axios({
				url: '/operations',
				method: 'GET',
				params: tmpData
			})
		},
		attrMap: {
			filePath: {
				value: '文件路径',
				type: 'String',
				owner: ['']
			}
		}
	}
}
