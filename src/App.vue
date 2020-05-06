<template>
	<div id="app">
		<el-scrollbar style="height:100%">
			<div id="main-container">
					<transition name="el-fade-in-linear"><router-view /></transition>
			</div>
			<my-footer></my-footer>
		</el-scrollbar>
	</div>
</template>

<script>
/* eslint-disable */
import myFooter from './components/footer'
/* eslint-able */
export default {
	components: {
		myFooter
	}
}
</script>

<style lang="stylus">
body, html
	margin 0
	padding 0
	height 100%
	font-family Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif
	font-weight 400
	-webkit-font-smoothing antialiased
	-webkit-tap-highlight-color transparent
#app, #main-container
	height 100%
// elementUI滚动条适配
.el-scrollbar__view
	height 100%
body, .el-scrollbar__wrap
	overflow-x hidden
</style>
