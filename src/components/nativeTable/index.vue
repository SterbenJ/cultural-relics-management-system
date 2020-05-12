<script>
export default {
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
			totalPage: 0,
			dialogVisible: false,
			dialogFormModel: {
			}
		}
	},
	created() {
		// 初始化数据
		this.getData()
		this.initColumnModelList()
		this.initInputModelList()
		this.initDialogModelList()
	},
	methods: {
		// 拉取数据
		getData() {
			const loading = this.$loading({
				lock: true,
				text: '加载中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			const vm = this
			vm.inNeedApi
				.func(vm.formModel)
				.then(response => {
					vm.tableData = response.data.data.content
					vm.totalPage = response.data.data.totalPages
					loading.close()
				})
				.catch(error => {
					console.log('get data fail', error)
					loading.close()
				})
		},
		// 初始化表格属性列表
		initColumnModelList() {
			this.$set(this.$data, 'columnModelList', Object.keys(this.inNeedApi.resultAttrMap))
		},
		// 初始化自定义检索属性列表
		initInputModelList() {
			const iList = []
			Object.keys(this.inNeedApi.requestParamMap).forEach((currentValue, index, arr) => {
				if (!(currentValue === 'page' || currentValue === 'count')) {
					iList.push(currentValue)
					this.$set(this.formModel, currentValue, '')
				}
			})
			console.log(iList);
			this.$set(this.$data, 'inputModelList', iList)
		},
		// 初始化 dialog 属性列表
		initDialogModelList() {
			const iList = []
			Object.keys(this.inNeedApi.resultAttrMap).forEach((currentValue, index, arr) => {
				this.$set(this.dialogFormModel, currentValue, '')
				if (currentValue !== 'id') {
					iList.push(currentValue)
				}
			})
			this.$set(this.$data, 'dialogModelList', iList)
		},
		// 关闭 dialog
		handleDialogClose(done) {
			console.log('close dialog', this.$refs.dialogFormRef);
			this.dialogVisible = false
			this.initDialogModelList()
		},
		// 创建条目
		createItem() {
			console.log('createItem', this.dialogFormModel)
			const loading = this.$loading({
				lock: true,
				text: '创建中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			const vm = this
			vm.createApi.func(vm.dialogFormModel).then(response => {
				console.log('create success');
				loading.close()
				vm.handleDialogClose()
				vm.getData()
			}).catch(error => {
				loading.close()
				console.log('create fail', error);
			})
		},
		// 编辑条目
		updateItem() {
			console.log('updateItem', this.dialogFormModel)
			const loading = this.$loading({
				lock: true,
				text: '更新中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			const vm = this
			vm.updateApi.func(vm.dialogFormModel).then(response => {
				console.log('update success');
				loading.close()
				vm.handleDialogClose()
				vm.getData()
			}).catch(error => {
				loading.close()
				console.log('update fail', error);
			})
		},
		// 删除条目
		deleteItem() {
			console.log('deleteItem', this.dialogFormModel)
			const loading = this.$loading({
				lock: true,
				text: '删除中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			})
			const vm = this
			vm.deleteApi.func(vm.dialogFormModel).then(response => {
				console.log('delete success');
				loading.close()
				vm.getData()
			}).catch(error => {
				loading.close()
				console.log('delete fail', error);
			})
		}
	},
	render: function(h) {
		const vm = this
		// 构建编辑/创建 Dialog
		function buildDialog(h) {
			const arr = []
			for (const mprop of vm.dialogModelList) {
				arr.push(
					h(
						'el-form-item',
						{
							props: {
								label: vm.inNeedApi.resultAttrMap[mprop]
							}
						},
						[
							h('el-input', {
								props: {
									value: vm.dialogFormModel[mprop]
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
								model: vm.dialogFormModel
							}
						},
						arr
					),
					h(
						'span',
						{
							slot: 'footer'
						},
						[
							h(
								'el-button',
								{
									domProps: {
										innerHTML: '取 消'
									},
									on: {
										click: function(event) {
											vm.handleDialogClose(event)
										}
									}
								}
							),
							// dialog 底部按钮
							h(
								'el-button',
								{
									props: {
										type: 'primary'
									},
									domProps: {
										innerHTML: '确 定'
									},
									on: {
										click: function() {
											const action = vm.dialogFormModel.id ? vm.updateItem : vm.createItem
											action()
										}
									}
								}
							)
						]
					)
				]
			)
		}
		// 构建表单
		function buildForm(h) {
			const arr = []
			for (const mprop of vm.inputModelList) {
				arr.push(
					h(
						'el-form-item',
						{
							props: {
								label: vm.inNeedApi.requestParamMap[mprop],
								prop: mprop
							}
						},
						[
							h('el-input', {
								props: {
									value: vm.formModel[mprop]
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
			// 检索按钮
			arr.push(
				h('el-form-item', {}, [
					h('el-button', {
						domProps: {
							innerHTML: '检 索'
						},
						on: {
							click: function(event) {
								vm.getData()()
							}
						}
					})
				])
			)
			return arr
		}
		// 构建表格
		function buildTable(h) {
			const arr = []
			for (const mprop of vm.columnModelList) {
				arr.push(
					h('el-table-column', {
						props: {
							prop: mprop,
							label: vm.inNeedApi.resultAttrMap[mprop]
						}
					})
				)
			}
			arr.push(
				h('el-table-column', {
					props: {
						label: '操作',
						width: '100'
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
										on: {
											click: function(e) {
												const tmpList = Object.keys(scope.row)
												for (const mprop of tmpList) {
													vm.dialogFormModel[mprop] = scope.row[mprop]
												}
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
										on: {
											onConfirm: function() {
												vm.deleteItem()
											}
										},
										style: {
											'margin-left': '5px'
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
														const tmpList = Object.keys(scope.row)
														for (const mprop of tmpList) {
															vm.dialogFormModel[mprop] = scope.row[mprop]
														}
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
			return arr
		}
		return h(
			'div',
			{
				attrs: {
					id: 'managent-table-container'
				}
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
						'margin-bottom': '15px'
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
						}
					},
					buildForm(h)
				),
				h(
					'el-table',
					{
						props: {
							data: this.tableData,
							stripe: true,
							border: true
						}
					},
					buildTable(h)
				),
				h('el-pagination', {
					props: {
						background: true,
						'current-page': vm.formModel.page,
						'page-sizes': [10, 20],
						'page-size': vm.formModel.count,
						'page-count': vm.totalPage,
						layout: 'sizes, prev, pager, next'
					},
					on: {
						'size-change': function(newVal) {
							vm.formModel.count = newVal
							vm.getData()
						},
						'current-change': function(newVal) {
							vm.formModel.page = newVal
							vm.getData()
						}
					},
					style: {
						'text-align': 'center',
						margin: '20px'
					}
				})
			]
		)
	}
}
</script>

<style></style>
