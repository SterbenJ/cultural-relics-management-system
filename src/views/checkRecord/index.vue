<template>
	<div>
		<transition name="el-zoom-in-top">
			<el-row id="check-record-container" v-show="!loading">
				<el-form :model="formModel" inline>
					<el-form-item prop="checked" label="状态">
						<el-select v-model="formModel.checked" clearable>
							<el-option
								:key="true"
								:value="true"
								:label="api.checkRelicsList.attrMap.checked.selectMap.true"
							></el-option>
							<el-option
								:key="false"
								:value="false"
								:label="api.checkRelicsList.attrMap.checked.selectMap.false"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item><el-button @click="search">检 索</el-button></el-form-item>
					<el-form-item><el-button @click="keepCheck" type="warning">继续盘点</el-button></el-form-item>
				</el-form>
				<div id="tip-container">
					<div class="tip-point success"></div>
					<span class="font-text-extra-samll" style="font-size: 13px;">已盘点无异常</span>
					<div class="tip-point warning"></div>
					<span class="font-text-extra-samll" style="font-size: 13px;">异常/未盘点</span>
					<!-- <div class="tip-point"></div>
					<span class="font-text-extra-samll" style="font-size: 13px;">未盘点</span> -->
				</div>
				<el-table
					:data="tableData"
					border
					style="width: 100%;"
					:row-class-name="tableRowClassName"
				>
					<!-- 文物id -->
					<el-table-column
						prop="relicId"
						:label="api.checkRelicsList.attrMap.relicId.value"
					/>
					<el-table-column prop="name" :label="api.checkRelicsList.attrMap.name.value" />
					<!-- 文物图片 -->
					<el-table-column
						width="122"
						prop="picturePath"
						:label="api.checkRelicsList.attrMap.picturePath.value"
					>
						<template slot-scope="scope">
							<el-image
								style="width: 100px; height: 100px;"
								fit="contain"
								:src="realPicturePath(scope.row.picturePath)"
							/>
						</template>
					</el-table-column>
					<!-- 盘点前仓库id -->
					<el-table-column
						prop="oldWarehouseId"
						:label="api.checkRelicsList.attrMap.oldWarehouseId.value"
					/>
					<!-- 盘点前货架id -->
					<el-table-column
						prop="oldShelfId"
						:label="api.checkRelicsList.attrMap.oldShelfId.value"
					/>
					<!-- 盘点后仓库id -->
					<el-table-column
						prop="newWarehouseId"
						:label="api.checkRelicsList.attrMap.newWarehouseId.value"
					/>
					<!-- 盘点后货架id -->
					<el-table-column
						prop="newShelfId"
						:label="api.checkRelicsList.attrMap.newShelfId.value"
					/>
					<!-- 盘点人姓名 -->
					<el-table-column
						prop="operatorName"
						:label="api.checkRelicsList.attrMap.operatorName.value"
					/>
					<!-- 盘点时间 -->
					<el-table-column
						fixed="right"
						prop="checkTime"
						:label="api.checkRelicsList.attrMap.checkTime.value"
					/>
				</el-table>
				<el-pagination
					style="margin: 20px; text-align: center;"
					background
					layout="sizes, prev, pager, next"
					:current-page.sync="formModel.page"
					:page-size.sync="formModel.count"
					:page-sizes="[10, 20]"
					:page-count="totalPage"
					:pager-count="5"
					@current-change="getData"
					@size-change="getData"
				></el-pagination>
			</el-row>
		</transition>
	</div>
</template>

<script>
export default {
	data() {
		return {
			formModel: {
				count: 10,
				page: 1,
				checked: ''
			},
			tableData: [],
			totalPage: 0,
			loading: true
		}
	},
	watch: {
		'$attrs.id': {
			handler(newVal, oldVal) {
				this.getData()
			},
			immediate: true
		}
	},
	methods: {
		// 获取数据
		getData() {
			const vm = this
			vm.loading = true
			vm.api.checkRelicsList
				.func({
					id: vm.$attrs.id,
					...vm.formModel
				})
				.then(res => {
					vm.tableData = res.data.data.content
					vm.totalPage = res.data.data.totalPages
					vm.loading = false
					console.log('get checkRecode success')
				})
				.catch(err => {
					console.log('get checkRecode fail', err)
					vm.loading = false
				})
		},
		// 检索
		search() {
			this.formModel.page = 1
			this.getData()
		},
		// 根据环境切换请求图片地址
		realPicturePath(path) {
			if (!path) return ''
			return process.env.NODE_ENV === 'production' ? 'https://relics.wegfan.cn' + path : path
		},
		// 根据数据切换表格强调色
		tableRowClassName({ row, rowIndex }) {
			// if (row.checkTime) {
				if (row.newWarehouseId === row.oldWarehouseId && row.newShelfId === row.oldShelfId && !!row.checkTime) {
					return 'success-row'
				} else {
					return 'warning-row'
				}
			// } else {
			// 	return ''
			// }
		},
		// 继续盘点
		keepCheck() {
			this.$router.push('/check/' + this.$attrs.id)
		}
	}
}
</script>

<style lang="stylus">
success-color = #f0f9eb
warning-color = #fce2e2
#check-record-container
	margin-bottom 10px
.el-table
	.warning-row
		background warning-color
.el-table
	.success-row
		background success-color
#tip-container
	margin-bottom 15px
	.success
		background success-color
	.warning
		background warning-color
.tip-point
	display inline-block
	width 10px
	height 10px
	border lightgray solid 1.5px
	border-radius 16px
	margin-left 20px
	margin-right 5px
</style>
