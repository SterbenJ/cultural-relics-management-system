<script>
import nativeTable from '../../components/nativeTable'
export default {
	extends: nativeTable,
	data() {
		return {
			inNeedApi: this.api.warehousesList,
			deleteApi: this.api.deleteWarehouse,
			updateApi: this.api.updateWarehouse,
			createApi: this.api.createWarehouse
		}
	},
	methods: {
	},
	mounted() {
	}
}
</script>

<style lang="stylus">
table-width = 100%
.custom-el-table-warehouse
	width table-width
.custom-el-table-column-warehouse
	width table-width / 2
</style>
