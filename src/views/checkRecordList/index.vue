<script>
import nativeTable from '../../components/nativeTable'
export default {
	extends: nativeTable,
	data() {
		return {
			inNeedApi: this.api.checkList,
			childRoute: {
				name: 'checkRecord',
				query: {
					id: ''
				}
			}
		}
	},
	mounted() {
	}
}
</script>

<style></style>
