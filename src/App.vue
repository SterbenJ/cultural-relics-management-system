<template>
<div id="app">
	<transition name="el-fade-in-linear">
		<router-view />
	</transition>
</div>
</template>

<style lang="stylus">
body
html
	margin 0
	padding 0
	height 100%
	font-family Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif
	font-weight 400
	-webkit-font-smoothing antialiased
	-webkit-tap-highlight-color transparent
#app
	height 100%
</style>
