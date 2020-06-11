<template>
	<init-batch-edit-str :attrMap="attrMap" :attrRoot="attrRoot"/>
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
				statusId: this.api.relicsList.attrMap.statusId
			},
			attrRoot: this.api.relicsList.attrMap
		}
	}
}
</script>

<style>
</style>
