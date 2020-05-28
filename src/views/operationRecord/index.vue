<script>
import nativeTable from '../../components/nativeTable'
export default {
	extends: nativeTable,
	data() {
		return {
			inNeedApi: this.api.operationsList,
			excelApi: this.api.operationsExcel
		}
	},
	mounted() {
	}
}
</script>

<style></style>
