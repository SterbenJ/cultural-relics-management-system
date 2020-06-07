<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import vueQr from 'vue-qr'
export default {
	components: {
		vueQr
	},
	data() {
		return {
			tableData: [],
			columnModelList: [],
			inputModelList: [],
			dialogModelList: [],
			inNeedApi: '',
			updateApi: '',
			deleteApi: '',
			createApi: '',
			excelApi: '',
			excelIniting: false,
			formModel: {
				page: 1,
				count: 10
			},
			currentFormModel: {},
			totalPage: 0,
			dialogVisible: false,
			dialogFormModel: {},
			loading: true,
			hasFormChange: false,
			remoteOptions: {},
			remoteOptionsState: {}
		}
	},
	computed: {
		// 判断有无默认索引参数
		hasDefaultAttr() {
			return Object.keys(this.$attrs).length > 0
		},
		// 是否为创建文物的dialog
		isCreateRelics() {
			return this.inNeedApi.attrMap.id.value === '文物ID' && !this.dialogFormModel.id
		},
		// 是否为文物列表
		isRelics() {
			return this.inNeedApi.attrMap.id.value === '文物ID'
		},
		// 是否有检索选项
		canSearch() {
			return Object.keys(this.formModel).length > 2
		},
		// 是否可以新建
		canCreate() {
			return !!this.createApi
		},
		// 是否可以更新（编辑）
		canUpdate() {
			return !!this.updateApi
		},
		// 是否可以删除
		canDelete() {
			return !!this.deleteApi
		},
		// 是否可以导出表格
		canExportExcel() {
			return !!this.excelApi
		},
		// 是否有操作格子
		hasTableAction() {
			return this.canUpdate || this.canDelete
		},
		...mapGetters({
			hasPermission: 'user/hasPermission'
		})
	},
	created() {
		// 初始化数据
		this.initColumnModelList()
		this.initInputModelList()
		this.initDialogModelList()
	},
	mounted() {
		this.formModel = {
			...this.formModel,
			...this.$attrs
		}
		this.getData()
	},
	watch: {
		formModel: {
			handler: function(newVal, oldVal) {
				if (newVal.page === oldVal.page) {
					this.hasFormChange = true
				}
			},
			deep: true
		}
	},
	methods: {
		// 拉取数据
		getData(changePage) {
			console.log('get data')
			this.loading = true
			const loading = this.$loading({
				lock: true,
				text: '加载中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			const vm = this
			vm.inNeedApi
				.func(changePage ? vm.currentFormModel : vm.formModel)
				.then(response => {
					vm.tableData = response.data.data.content
					vm.totalPage = response.data.data.totalPages
					if (!changePage) {
						vm.currentFormModel = {
							...vm.formModel
						}
					}
					console.log('get data success')
					loading.close()
					this.loading = false
					if (response.data.data.totalPages < response.data.data.currentPage) {
						vm.currentFormModel.page = response.data.data.totalPages
						vm.formModel.page = response.data.data.totalPages
						vm.getData(true)
					}
				})
				.catch(error => {
					console.log('get data fail', error)
					loading.close()
					this.loading = false
				})
		},
		// 初始化表格属性列表
		initColumnModelList() {
			this.$set(
				this.$data,
				'columnModelList',
				Object.keys(this.inNeedApi.attrMap).filter(value => {
					return this.inNeedApi.attrMap[value].owner.indexOf('result') !== -1
				})
			)
		},
		// 初始化自定义检索属性列表
		initInputModelList() {
			const iList = []
			Object.keys(this.inNeedApi.attrMap)
				.filter(value => {
					return this.inNeedApi.attrMap[value].owner.indexOf('form') !== -1
				})
				.forEach((currentValue, index, arr) => {
					if (!(currentValue === 'page' || currentValue === 'count')) {
						iList.push(currentValue)
						// 判断有无默认值
						if (this.$attrs[currentValue]) {
							this.$set(this.formModel, currentValue, this.$attrs[currentValue])
						} else {
							this.$set(this.formModel, currentValue, '')
						}
						// 初始化远程加载selectOption
						if (this.inNeedApi.attrMap[currentValue].type === 'remoteSelect') {
							this.$set(this.remoteOptions, currentValue + 'Options', [])
							this.$set(this.remoteOptionsState, currentValue + 'Loading', false)
						}
					}
				})
			this.$set(this.$data, 'inputModelList', iList)
		},
		// 初始化 dialog 属性列表
		initDialogModelList() {
			const iList = []
			Object.keys(this.inNeedApi.attrMap)
				.filter(value => {
					return this.inNeedApi.attrMap[value].owner.indexOf('edit') !== -1
				})
				.forEach((currentValue, index, arr) => {
					this.$set(this.dialogFormModel, currentValue, '')
					if (currentValue !== 'id') {
						if (!this.inNeedApi.attrMap[currentValue].permission) {
							iList.push(currentValue)
						} else {
							for (const tmpPermission of this.inNeedApi.attrMap[currentValue]
								.permission) {
								if (this.hasPermission(tmpPermission)) {
									iList.push(currentValue)
									// 初始化远程加载selectOption
									if (
										this.inNeedApi.attrMap[currentValue].type === 'remoteSelect'
									) {
										this.$set(this.remoteOptions, currentValue + 'Options', [])
										this.$set(
											this.remoteOptionsState,
											currentValue + 'Loading',
											false
										)
									}
									break
								}
							}
						}
					}
				})
			this.$set(this.$data, 'dialogModelList', iList)
		},
		// 关闭 dialog
		handleDialogClose(done) {
			this.dialogVisible = false
			this.initDialogModelList()
		},
		// 创建条目
		createItem() {
			const loading = this.$loading({
				lock: true,
				text: '创建中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			const vm = this
			vm.createApi
				.func(vm.dialogFormModel)
				.then(response => {
					console.log('create success')
					loading.close()
					vm.handleDialogClose()
					vm.getData(true)
				})
				.catch(error => {
					loading.close()
					console.log('create fail', error)
				})
		},
		// 编辑条目
		updateItem() {
			const loading = this.$loading({
				lock: true,
				text: '更新中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			const vm = this
			vm.updateApi
				.func(vm.dialogFormModel)
				.then(response => {
					console.log('update success')
					loading.close()
					vm.handleDialogClose()
					vm.getData(true)
				})
				.catch(error => {
					loading.close()
					console.log('update fail', error)
				})
		},
		// 删除条目
		deleteItem(id) {
			const loading = this.$loading({
				lock: true,
				text: '删除中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			const vm = this
			vm.deleteApi
				.func({
					id
				})
				.then(response => {
					console.log('delete success')
					loading.close()
					vm.getData(true)
				})
				.catch(error => {
					loading.close()
					console.log('delete fail', error)
				})
		},
		// 根据 id 跳转到子表（如果有
		jumpToChild(id) {
			if (this.childRoute) {
				const key = Object.keys(this.childRoute.query)[0]
				this.childRoute.query[key] = id
				this.$router.push(this.childRoute)
			}
		},
		// 创建特殊情况
		checkRelics() {
			return {
				display: this.isCreateRelics ? 'none' : 'inline'
			}
		}
	},
	render: function(h) {
		function emptyInput(h) {
			return h(
				'el-form-item',
				{
					props: {
						label: ''
					},
					style: {
						display: 'none'
					}
				},
				[
					h('el-input', {
						props: {
							value: ''
						},
						on: {
							input: function(event) {}
						}
					})
				]
			)
		}
		const vm = this
		// 构建编辑/创建 Dialog
		function buildDialog(h) {
			const arr = []
			// 空 input 防止回车刷新
			arr.push(emptyInput(h))
			for (const mprop of vm.dialogModelList) {
				if (vm.inNeedApi.attrMap[mprop].type === 'Select') {
					const selectArr = []
					for (const selectProp in vm.inNeedApi.attrMap[mprop].selectMap()) {
						selectArr.push(
							h('el-option', {
								props: {
									key: isNaN(Number(selectProp))
										? selectProp
										: Number(selectProp),
									label: vm.inNeedApi.attrMap[mprop].selectMap()[selectProp],
									value: isNaN(Number(selectProp))
										? selectProp
										: Number(selectProp)
								}
							})
						)
					}
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value
								},
								style: vm.checkRelics()
							},
							[
								h(
									'el-select',
									{
										props: {
											value: vm.dialogFormModel[mprop],
											clearable: true
										},
										on: {
											input: function(event) {
												vm.dialogFormModel[mprop] = event
											}
										}
									},
									selectArr
								)
							]
						)
					)
				} else if (vm.inNeedApi.attrMap[mprop].type === 'mulitSelect') {
					const selectArr = []
					for (const selectProp in vm.inNeedApi.attrMap[mprop].selectMap()) {
						selectArr.push(
							h('el-option', {
								props: {
									key: isNaN(Number(selectProp))
										? selectProp
										: Number(selectProp),
									label: vm.inNeedApi.attrMap[mprop].selectMap()[selectProp],
									value: isNaN(Number(selectProp))
										? selectProp
										: Number(selectProp)
								}
							})
						)
					}
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value
								},
								style: vm.checkRelics()
							},
							[
								h(
									'el-select',
									{
										props: {
											value: vm.dialogFormModel[mprop],
											clearable: true,
											multiple: true
										},
										on: {
											input: function(event) {
												vm.dialogFormModel[mprop] = event
											}
										}
									},
									selectArr
								)
							]
						)
					)
				} else if (vm.inNeedApi.attrMap[mprop].type === 'remoteSelect') {
					const selectArr = []
					for (const selectProp in vm.remoteOptions[mprop + 'Options']) {
						const id = vm.remoteOptions[mprop + 'Options'][selectProp].id
						const name = vm.remoteOptions[mprop + 'Options'][selectProp].name
						selectArr.push(
							h('el-option', {
								props: {
									key: isNaN(Number(id)) ? id : Number(id),
									label: name,
									value: isNaN(Number(id)) ? id : Number(id)
								}
							})
						)
					}
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value,
									prop: mprop
								},
								style: vm.checkRelics(),
								ref: mprop
							},
							[
								h(
									'el-select',
									{
										props: {
											value: vm.dialogFormModel[mprop],
											loading: vm.remoteOptionsState[mprop + 'Loading'],
											clearable: true
											// disabled: vm.inNeedApi.attrMap[mprop].selectParent
											// 	? !vm.dialogFormModel[
											// 			vm.inNeedApi.attrMap[mprop].selectParent
											// 	  ]
											// 	: false
										},
										on: {
											input: function(event) {
												vm.$set(vm.dialogFormModel, mprop, event)
												vm.dialogFormModel = { ...vm.dialogFormModel }
											},
											'visible-change': function(event) {
												// 打开的时候加载远程选项
												if (event) {
													vm.remoteOptionsState[mprop + 'Loading'] = true
													// 有父select就根据父找当前选项
													vm.inNeedApi.attrMap[mprop]
														.remoteSelectApi(
															vm.inNeedApi.attrMap[mprop].selectParent
																? vm.dialogFormModel[
																		vm.inNeedApi.attrMap[mprop]
																			.selectParent
																  ]
																: undefined
														)
														.then(res => {
															console.log(
																'get ' + mprop + ' options success'
															)
															vm.remoteOptions[mprop + 'Options'] =
																res.data.data
															vm.remoteOptionsState[mprop + 'Loading'] = false
														})
														.catch(err => {
															console.log(
																'get ' + mprop + ' options fail',
																err
															)
															vm.remoteOptionsState[mprop + 'Loading'] = false
														})
												}
											},
											change: function() {
												if (vm.inNeedApi.attrMap[mprop].selectChild) {
													vm.dialogFormModel[
														vm.inNeedApi.attrMap[mprop].selectChild
													] = ''
												}
											}
										}
									},
									selectArr
								)
							]
						)
					)
				} else {
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value
								},
								style: vm.checkRelics()
							},
							[
								h('el-input', {
									props: {
										value: vm.dialogFormModel[mprop],
										clearable: true
									},
									on: {
										input: function(event) {
											vm.dialogFormModel[mprop] = event
										}
									}
								})
							]
						)
					)
				}
			}
			// 判断创建文物特殊情况
			if (vm.isCreateRelics) {
				arr.push(
					h(
						'el-upload',
						{
							props: {
								action: vm.api.utils.realUrl('/relics'),
								accept: 'image/*',
								multiple: false,
								'with-credentials': true,
								'show-file-list': false,
								'list-type': 'picture-card',
								limit: 1,
								'on-success': function(res) {
									console.log('success upload')
									if (res.code === 200) {
										Message.success('上传成功')
										vm.getData()
									} else {
										Message.error(res.msg)
									}
									vm.dialogVisible = false
								},
								'on-error': function(err) {
									console.log('fail upload', err)
									Message.error(err)
								}
							},
							style: {
								'text-align': 'center'
							}
						},
						[
							h('i', {
								class: ['el-icon-plus']
							})
						]
					)
				)
			}
			return h(
				'el-dialog',
				{
					props: {
						'destroy-on-close': true,
						title: vm.dialogFormModel.id ? '编辑' : '新增',
						width: '40%',
						'before-close': vm.handleDialogClose,
						visible: vm.dialogVisible
					},
					on: {
						'update:visible': function(event) {
							vm.dialogVisible = event
						}
					}
				},
				[
					h(
						'el-form',
						{
							ref: 'dialogFormRef',
							props: {
								model: vm.dialogFormModel,
								'label-position': 'top'
							}
						},
						arr
					),
					h(
						'span',
						{
							slot: 'footer',
							style: vm.checkRelics()
						},
						[
							h('el-button', {
								domProps: {
									innerHTML: '取 消'
								},
								on: {
									click: function(event) {
										vm.handleDialogClose(event)
									}
								}
							}),
							// dialog 底部按钮
							h('el-button', {
								props: {
									type: 'primary'
								},
								domProps: {
									innerHTML: '确 定'
								},
								on: {
									click: function() {
										const action = vm.dialogFormModel.id
											? vm.updateItem
											: vm.createItem
										action()
									}
								}
							})
						]
					)
				]
			)
		}
		// 构建表单
		function buildForm(h) {
			const arr = []
			// 添加一个空 input 防止回车键刷新页面
			arr.push(emptyInput(h))
			for (const mprop of vm.inputModelList) {
				// 时间类型特殊点
				if (vm.inNeedApi.attrMap[mprop].type === 'date') {
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value,
									prop: mprop
								}
							},
							[
								h('el-date-picker', {
									props: {
										value: vm.formModel[mprop],
										'default-time': '00:00:00',
										type: 'datetime',
										format: 'yyyy-MM-dd HH:mm',
										'value-format': 'yyyy-MM-dd HH:mm:ss'
									},
									on: {
										input: function(event) {
											vm.formModel[mprop] = event
										}
									}
								})
							]
						)
					)
				} else if (vm.inNeedApi.attrMap[mprop].type === 'Select') {
					const selectArr = []
					for (const selectProp in vm.inNeedApi.attrMap[mprop].selectMap()) {
						selectArr.push(
							h('el-option', {
								props: {
									key: isNaN(Number(selectProp))
										? selectProp
										: Number(selectProp),
									label: vm.inNeedApi.attrMap[mprop].selectMap()[selectProp],
									value: isNaN(Number(selectProp))
										? selectProp
										: Number(selectProp)
								}
							})
						)
					}
					if (vm.inNeedApi.attrMap[mprop].selectDefault && !vm.formModel[mprop]) {
						vm.$set(vm.formModel, mprop, vm.inNeedApi.attrMap[mprop].selectDefault)
					}
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value,
									prop: mprop
								},
								ref: mprop
							},
							[
								h(
									'el-select',
									{
										props: {
											value: vm.formModel[mprop],
											clearable: true
										},
										on: {
											input: function(event) {
												vm.$set(vm.formModel, mprop, event)
												vm.formModel = { ...vm.formModel }
											}
										}
									},
									selectArr
								)
							]
						)
					)
				} else if (vm.inNeedApi.attrMap[mprop].type === 'mulitSelect') {
					const selectArr = []
					for (const selectProp in vm.inNeedApi.attrMap[mprop].selectMap()) {
						selectArr.push(
							h('el-option', {
								props: {
									key: isNaN(Number(selectProp))
										? selectProp
										: Number(selectProp),
									label: vm.inNeedApi.attrMap[mprop].selectMap()[selectProp],
									value: isNaN(Number(selectProp))
										? selectProp
										: Number(selectProp)
								}
							})
						)
					}
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value,
									prop: mprop
								}
							},
							[
								h(
									'el-select',
									{
										props: {
											value: vm.formModel[mprop],
											clearable: true,
											multiple: true
										},
										on: {
											input: function(event) {
												vm.formModel[mprop] = event
											}
										}
									},
									selectArr
								)
							]
						)
					)
				} else if (vm.inNeedApi.attrMap[mprop].type === 'remoteSelect') {
					const selectArr = []
					for (const selectProp in vm.remoteOptions[mprop + 'Options']) {
						const id = vm.remoteOptions[mprop + 'Options'][selectProp].id
						const name = vm.remoteOptions[mprop + 'Options'][selectProp].name
						selectArr.push(
							h('el-option', {
								props: {
									key: isNaN(Number(id)) ? id : Number(id),
									label: name,
									value: isNaN(Number(id)) ? id : Number(id)
								}
							})
						)
					}
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value,
									prop: mprop
								},
								ref: mprop
							},
							[
								h(
									'el-select',
									{
										props: {
											value: vm.formModel[mprop],
											clearable: true,
											loading: vm.remoteOptionsState[mprop + 'Loading']
											// disabled: vm.inNeedApi.attrMap[mprop].selectParent
											// 	? !vm.formModel[
											// 			vm.inNeedApi.attrMap[mprop].selectParent
											// 	  ]
											// 	: false
										},
										on: {
											input: function(event) {
												vm.$set(vm.formModel, mprop, event)
												vm.formModel = { ...vm.formModel }
											},
											'visible-change': function(event) {
												// 打开的时候加载远程选项
												if (event) {
													vm.remoteOptionsState[mprop + 'Loading'] = true
													// 有父select就根据父找当前选项
													vm.inNeedApi.attrMap[mprop]
														.remoteSelectApi(
															vm.inNeedApi.attrMap[mprop].selectParent
																? vm.formModel[
																		vm.inNeedApi.attrMap[mprop]
																			.selectParent
																  ]
																: undefined
														)
														.then(res => {
															console.log(
																'get ' + mprop + ' options success'
															)
															vm.remoteOptions[mprop + 'Options'] =
																res.data.data
															vm.remoteOptionsState[mprop + 'Loading'] = false
														})
														.catch(err => {
															console.log(
																'get ' + mprop + ' options fail',
																err
															)
															vm.remoteOptionsState[mprop + 'Loading'] = false
														})
												}
											},
											change: function() {
												if (vm.inNeedApi.attrMap[mprop].selectChild) {
													vm.formModel[
														vm.inNeedApi.attrMap[mprop].selectChild
													] = ''
													vm.remoteOptions[
														vm.inNeedApi.attrMap[mprop].selectChild +
															'Options'
													] = []
												}
											}
										}
									},
									selectArr
								)
							]
						)
					)
				} else {
					arr.push(
						h(
							'el-form-item',
							{
								props: {
									label: vm.inNeedApi.attrMap[mprop].value,
									prop: mprop
								}
							},
							[
								h('el-input', {
									props: {
										value: vm.formModel[mprop],
										clearable: true
									},
									on: {
										input: function(event) {
											vm.formModel[mprop] = event
										}
									}
								})
							]
						)
					)
				}
			}
			// 检索按钮
			if (vm.canSearch) {
				arr.push(
					h('el-form-item', {}, [
						h('el-button', {
							domProps: {
								innerHTML: '检 索'
							},
							on: {
								click: function(event) {
									vm.formModel.page = 1
									vm.getData()
								}
							}
						})
					])
				)
			}
			// 导出按钮
			if (vm.canExportExcel) {
				arr.push(
					h('el-form-item', {}, [
						h('el-button', {
							domProps: {
								innerHTML: '导出 Excel'
							},
							props: {
								type: 'success',
								loading: vm.excelIniting
							},
							on: {
								click: function(event) {
									Message.info('正在生成excel，根据数据量需等待 10 - 60 秒时间')
									vm.excelIniting = true
									vm.excelApi
										.func(vm.formModel)
										.then(res => {
											console.log('init excel success')
											vm.excelIniting = false
											// 下载表格
											vm.api.utils.download(res.data.data.filePath)
										})
										.catch(err => {
											console.log('init excel fail', err)
											vm.excelIniting = false
										})
								}
							}
						})
					])
				)
			}
			return arr
		}
		// 构建表格
		function buildTable(h) {
			const arr = []
			// 添加二维码
			if (vm.isRelics) {
				arr.push(
					h('el-table-column', {
						props: {
							label: '二维码',
							width: '122px'
						},
						scopedSlots: {
							default: scope => {
								return [
									h('vueQr', {
										style: {
											width: '100px',
											height: '100px'
										},
										props: {
											margin: 5,
											dotScale: 1,
											size: 100,
											text: '#' + scope.row.id + '#'
										}
									})
								]
							}
						}
					})
				)
			}
			for (const mprop of vm.columnModelList) {
				if (vm.inNeedApi.attrMap[mprop].type === 'img') {
					arr.push(
						h('el-table-column', {
							props: {
								prop: mprop,
								label: vm.inNeedApi.attrMap[mprop].value,
								width: '122px'
							},
							scopedSlots: {
								default: scope => {
									return [
										h('el-image', {
											style: {
												width: '100px',
												height: '100px'
											},
											props: {
												src: vm.api.utils.realUrlWithoutApi(
													scope.row[mprop]
												),
												fit: 'contain'
											}
										})
									]
								}
							}
						})
					)
				} else if (vm.inNeedApi.attrMap[mprop].type === 'Select') {
					arr.push(
						h('el-table-column', {
							props: {
								prop: mprop,
								label: vm.inNeedApi.attrMap[mprop].value,
								width: '120px'
							},
							scopedSlots: {
								default: scope => {
									return vm.inNeedApi.attrMap[mprop].selectMap()[scope.row[mprop]]
								}
							}
						})
					)
				} else if (vm.inNeedApi.attrMap[mprop].type === 'mulitSelect') {
					arr.push(
						h('el-table-column', {
							props: {
								prop: mprop,
								label: vm.inNeedApi.attrMap[mprop].value,
								width: '120px'
							},
							scopedSlots: {
								default: scope => {
									var resultStr = ''
									for (const permissionId of scope.row[mprop]) {
										if (resultStr) {
											resultStr =
												resultStr +
												',\n' +
												vm.inNeedApi.attrMap[mprop].selectMap()[
													permissionId
												]
										} else {
											resultStr = vm.inNeedApi.attrMap[mprop].selectMap()[
												permissionId
											]
										}
									}
									return resultStr
								}
							}
						})
					)
				} else {
					arr.push(
						h('el-table-column', {
							props: {
								prop: mprop,
								label: vm.inNeedApi.attrMap[mprop].value
							}
						})
					)
				}
			}
			if (vm.hasTableAction) {
				arr.push(
					h('el-table-column', {
						props: {
							label: '操作',
							width: '111',
							fixed: 'right'
						},
						scopedSlots: {
							// 表头对应的内容， 里面可根据需求自定义
							default: scope => {
								return [
									h(
										'el-button',
										{
											props: {
												type: 'primary',
												plain: true,
												size: 'mini'
											},
											style: {
												padding: '7px 8px',
												display: vm.canUpdate ? '' : 'none'
											},
											on: {
												click: function(e) {
													event.stopPropagation()
													for (const mprop of vm.dialogModelList) {
														if (scope.row[mprop]) {
															vm.dialogFormModel[mprop] =
																scope.row[mprop]
														} else {
															vm.dialogFormModel[mprop] = ''
														}
													}
													vm.dialogFormModel.id = scope.row.id
													vm.dialogVisible = true
												}
											}
										},
										'编辑'
									),
									h(
										'el-popconfirm',
										{
											props: {
												title: '确定删除？操作不可撤销'
											},
											style: {
												display: vm.canDelete ? '' : 'none',
												'margin-left': '5px'
											},
											on: {
												onConfirm: function() {
													vm.deleteItem(scope.row.id)
												}
											}
										},
										[
											h(
												'el-button',
												{
													props: {
														type: 'danger',
														size: 'mini'
													},
													style: {
														padding: '7px 8px'
													},
													on: {
														click: function(e) {
															event.stopPropagation()
															// const tmpList = Object.keys(scope.row)
															// for (const mprop of tmpList) {
															// 	vm.dialogFormModel[mprop] =
															// 		scope.row[mprop]
															// }
														}
													},
													slot: 'reference'
												},
												'删除'
											)
										]
									)
								]
							}
						}
					})
				)
			}
			return arr
		}
		return h(
			'transition',
			{
				props: {
					name: 'el-zoom-in-top'
				}
			},
			[
				h(
					'div',
					{
						attrs: {
							id: 'managent-table-container'
						},
						style: { display: this.loading ? 'none' : undefined },
						directives: [
							{
								name: 'show',
								value: !this.loading
							}
						]
					},
					[
						buildDialog(h),
						h('el-button', {
							props: {
								type: 'primary'
							},
							domProps: {
								innerHTML: '新 增'
							},
							style: {
								'margin-bottom': '15px',
								display: vm.canCreate ? undefined : 'none'
							},
							on: {
								click: function(event) {
									vm.dialogVisible = true
								}
							}
						}),
						h(
							'el-form',
							{
								props: {
									model: vm.formModel,
									inline: true,
									'label-position': 'left'
								},
								on: {
									input: function() {
										console.log('input')
									}
								},
								ref: 'formModel'
							},
							buildForm(h)
						),
						h(
							'el-table',
							{
								props: {
									data: this.tableData,
									stripe: true,
									border: true,
									'highlight-current-row': true
								},
								on: {
									'row-click': function(event) {
										vm.jumpToChild(event.id)
									}
								}
							},
							buildTable(h)
						),
						h('el-pagination', {
							props: {
								background: true,
								'current-page': vm.currentFormModel.page,
								'page-sizes': [10, 20],
								'page-size': vm.currentFormModel.count,
								'page-count': vm.totalPage,
								'pager-count': 5,
								layout: 'sizes, prev, pager, next'
							},
							on: {
								'size-change': function(newVal) {
									vm.formModel.count = newVal
									vm.currentFormModel.count = newVal
									vm.getData(true)
								},
								'current-change': function(newVal) {
									vm.formModel.page = newVal
									vm.currentFormModel.page = newVal
									vm.getData(true)
								}
							},
							style: {
								'text-align': 'center',
								margin: '20px'
							}
						})
					]
				)
			]
		)
	}
}
</script>

<style></style>
