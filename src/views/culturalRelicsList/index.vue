<script>
import nativeTable from '../../components/nativeTable'
export default {
	extends: nativeTable,
	data() {
		return {
			inNeedApi: this.api.relicsList,
			createApi: this.api.createRelics,
			deleteApi: this.api.deleteRelics,
			updateApi: this.api.updateRelics,
			childRoute: {
				name: 'relics',
				query: {
					relicsId: ''
				}
			}
		}
	},
	mounted() {
	}
}
</script>

<style></style>
