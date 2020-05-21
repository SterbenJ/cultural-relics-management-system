<script>
import nativeTable from '../../components/nativeTable'
export default {
	extends: nativeTable,
	data() {
		return {
			inNeedApi: this.api.shelvesList,
			createApi: this.api.createShelves,
			deleteApi: this.api.deleteShelves,
			updateApi: this.api.updateShelves
		}
	},
	mounted() {
	}
}
</script>

<style>
</style>
