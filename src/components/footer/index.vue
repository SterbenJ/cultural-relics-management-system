<template>
	<div id="my-footer">
		<el-divider></el-divider>
			<div class="container-vertical-center">
				<el-col class="font-line-height-large font-text-normal foot-child-container" :span="12">
					author <a target="_blank" href="https://github.com/SterbenJ">@NoraH1to</a>
				</el-col>
				<el-col class="font-line-height-large font-text-normal foot-child-container" :span="12">
					备案信息: 粤xxxxxxx号
				</el-col>
			</div>
		<el-divider></el-divider>
	</div>
</template>

<script>
export default {}
</script>

<style lang="stylus">
container-height = 6%
#my-footer
	height container-height
.foot-container
	height 100%
.foot-child-container
	text-align center
.el-divider
	margin 0
	padding 0
</style>
