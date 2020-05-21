<template>
	<div>
		<el-row id="relics-container">
			<el-col :span="22" :offset="1">
				<el-row v-if="!simple" :gutter="20">
					<el-col :span="10" :offset="2">
						<transition name="el-zoom-in-top">
							<vue-qr
								v-show="!loading"
								style="width: 100%; height: 100%;"
								:margin="5"
								:dotScale="1"
								:size="200"
								:text="'#' + relicsData.id + '#'"
							/>
						</transition>
					</el-col>
					<el-col :span="10">
						<transition name="el-zoom-in-top">
							<el-image
								v-show="!loading"
								style="width: 100%; height: 100%;"
								:src="realPicturePath"
								fit="contain"
							/>
						</transition>
					</el-col>
				</el-row>
				<el-row>
					<transition name="el-zoom-in-top">
						<el-table :data="dataInTable" stripe style="width: 100%;" v-show="!loading">
							<el-table-column prop="key" width="150" />
							<el-table-column prop="value" />
						</el-table>
					</transition>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import vueQr from 'vue-qr'
export default {
	props: {
		simple: {
			type: Boolean,
			default: false
		}
	},
	components: {
		vueQr
	},
	computed: {
		realPicturePath() {
			console.log(
				process.env.NODE_ENV === 'production'
					? 'https://relics.wegfan.cn' + this.relicsData.picturePath
					: this.relicsData.picturePath
			)
			if (!this.relicsData.picturePath) return ''
			return process.env.NODE_ENV === 'production'
				? 'https://relics.wegfan.cn' + this.relicsData.picturePath
				: this.relicsData.picturePath
		}
	},
	data() {
		return {
			loading: true,
			dataInTable: [],
			relicsData: {
				id: 1, // 文物编号
				name: 'wdnmd', // 文物名称
				quantity: 2, // 数量
				picturePath: '', // 照片地址
				year: '南北朝', // 年代
				reign: 'xxx', // 年号
				type: '沙雕', // 器型
				source: 'xxx捐赠', // 来源
				size: '11cm x 45cm x 14cm', // 尺寸
				weight: 19198.1, // 重量 kg
				warehouseId: 1, // 收储仓库ID
				shelfId: 1, // 收储货架ID
				enterPrice: 12345678.9, // 入馆价值【资产科】
				leavePrice: 12345678.9, // 离馆价值【资产科】
				statusId: 1, // 状态id
				lastCheckTime: '2020-04-25 11:11:11', // 最后盘点时间【仓库管理员】
				enterTime: '2020-04-25 11:11:11', // 入馆时间【仓库管理员】
				leaveTime: '2020-04-25 11:11:11', // 离馆时间【仓库管理员】
				moveTime: '2020-04-25 11:11:11', // 移入仓库时间【仓库管理员】
				lendTime: '2020-04-25 11:11:11', // 出借时间【仓库管理员】
				fixTime: '2020-04-25 11:11:11', // 送修时间【仓库管理员】
				updateTime: '2020-04-25 11:11:11', // 更新时间/录入时间
				comment1: 'a', // 备注1
				comment2: 'b' // 备注2
			}
		}
	},
	methods: {
		// 获得文物数据
		getRelics() {
			const vm = this
			vm.api.relics
				.func({
					id: vm.$attrs.relicsId
				})
				.then(res => {
					vm.relicsData = res.data.data
					vm.translateToTable(vm.relicsData)
					vm.loading = false
				})
				.catch(err => {
					console.log('get relics fail', err)
					vm.loading = false
				})
		},
		// 整合文物数据格式用来放入table
		translateToTable(data) {
			const vm = this
			const keys = Object.keys(data)
			for (const mkey of keys) {
				if (vm.api.relicsList.attrMap[mkey].type === 'img') continue
				vm.dataInTable.push({
					key: vm.api.relicsList.attrMap[mkey].value,
					value:
						vm.api.relicsList.attrMap[mkey].type === 'Select'
							? vm.api.relicsList.attrMap[mkey].selectMap[data[mkey]]
							: data[mkey]
				})
			}
		}
	},
	mounted() {
		// 没有参数就利用路由跳转到对应 job 的 index
		if (Object.keys(this.$attrs) < 0) {
			this.$router.push({ name: 'login' })
			return
		}
		this.getRelics()
	}
}
</script>

<style lang="stylus">
#relics-container
	margin-bottom 10px
.data-row
	margin-top 10px
</style>
