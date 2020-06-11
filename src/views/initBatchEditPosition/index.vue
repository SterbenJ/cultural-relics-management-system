<template>
	<init-batch-edit-str :attrMap="attrMap"/>
</template>

<script>
import initBatchEditStr from '../../components/initEditSth'
export default {
	components: {
		initBatchEditStr
	},
	data() {
		return {
			attrMap: {
				warehouseId: this.api.relicsList.attrMap.warehouseId,
				shelfId: this.api.relicsList.attrMap.shelfId
			}
		}
	}
}
</script>

<style>
</style>
