<script>
import nativeTable from '../../components/nativeTable'
export default {
	extends: nativeTable,
	data() {
		return {
			inNeedApi: this.api.userList,
			createApi: this.api.createUser,
			deleteApi: this.api.deleteUser,
			updateApi: this.api.updateUser
		}
	}
}
</script>

<style>
</style>
