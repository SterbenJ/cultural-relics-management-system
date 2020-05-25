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
			formModel: {
				page: 1,
				count: 10
			},
			currentFormModel: {},
			totalPage: 0,
			dialogVisible: false,
			dialogFormModel: {},
			loading: true,
			hasFormChange: false
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
						if (this.$attrs[currentValue]) {
							this.$set(this.formModel, currentValue, this.$attrs[currentValue])
						} else {
							this.$set(this.formModel, currentValue, '')
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
							for (const tmpPermission of this.inNeedApi.attrMap[currentValue].permission) {
								if (this.hasPermission(tmpPermission)) {
									iList.push(currentValue)
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
					vm.getData()
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
					vm.getData()
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
					vm.getData()
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
								action:
									process.env.NODE_ENV === 'production'
										? 'https://relics.wegfan.cn/api/v1/relics'
										: '/api/v1/relics',
								accept: 'image/*',
								multiple: false,
								'with-credentials': true,
								'show-file-list': false,
								'list-type': 'picture-card',
								limit: 1,
								'on-success': function(res) {
									console.log('success upload', res)
									if (res.code !== 200) {
										Message.error(res.msg)
									} else {
										vm.getData()
									}
									vm.dialogVisible = false
								},
								'on-error': function(err) {
									console.log('fail upload')
									Message.error(err)
								}
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
												src:
													process.env.NODE_ENV === 'production'
														? 'https://relics.wegfan.cn' +
														  scope.row[mprop]
														: scope.row[mprop],
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
												vm.inNeedApi.attrMap[mprop].selectMap()[permissionId]
										} else {
											resultStr = vm.inNeedApi.attrMap[mprop].selectMap()[permissionId]
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
							width: '100',
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
												type: 'text',
												size: 'small'
											},
											style: {
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
														type: 'text',
														size: 'small'
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
									inline: true
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
