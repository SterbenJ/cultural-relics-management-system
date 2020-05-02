<template>
	<div>
		<el-row gutter="20">
			<el-col :span="4">
				<el-menu :default-active="$route.name" class="el-menu-vertical-demo" router>
					<div class="title font-title-extra-large font-line-height-extra-large">
						故宫文物管理系统
					</div>
					<!-- 文物管理 -->
					<el-submenu index="1">
						<template slot="title">
							<i class="el-icon-discover"></i>
							<span slot="title">文物管理</span>
						</template>
						<el-menu-item
							index="culturalRelicsList"
							:route="{ name: 'culturalRelicsList' }"
						>
							文物列表
						</el-menu-item>
						<el-menu-item
							index="culturalRelicsNeedTouch"
							:route="{ name: 'culturalRelicsNeedTouch' }"
						>
							待录文物
						</el-menu-item>
						<el-menu-item index="checkRecord" :route="{ name: 'checkRecord' }">
							盘点记录
						</el-menu-item>
					</el-submenu>
					<!-- 操作管理 -->
					<el-submenu index="2">
						<template slot="title">
							<i class="el-icon-edit"></i>
							<span slot="title">操作管理</span>
						</template>
						<el-menu-item index="operationRecord" :route="{ name: 'operationRecord' }">
							操作记录
						</el-menu-item>
					</el-submenu>
					<!-- 成员管理 -->
					<el-menu-item index="memberManagement" :route="{ name: 'memberManagement' }">
						<i class="el-icon-school"></i>
						<span slot="title">成员管理</span>
					</el-menu-item>
				</el-menu>
			</el-col>
			<el-col :span="20">
				<transition name="el-fade-in-linear"><router-view /></transition>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	mounted() {
		console.log('route name: ', this.$route.name)
	}
}
</script>

<style lang="stylus">
.title
	text-align center
	font-weight 700
	line-height 300%
</style>
