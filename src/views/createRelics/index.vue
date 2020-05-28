<template>
	<div class="container-vertical-center container-horizontal-center">
		<el-upload
			:action="api.utils.realUrl('/relics')"
			accept="image/*"
			:multiple="false"
			with-credentials
			:show-file-list="false"
			list-type="picture-card"
			:on-success="onSuccess"
			:on-error="onError">
			<i class="el-icon-plus"></i>
		</el-upload>
	</div>
</template>

<script>
import {
	Message
} from 'element-ui'
export default {
	methods: {
		onSuccess(res) {
			if (res.code === 200) {
				Message.success('上传成功')
			} else {
				Message.error(res.msg)
			}
		},
		onError(err) {
			console.log('fail upload')
			Message.error(err)
		}
	}
}
</script>

<style>
</style>
