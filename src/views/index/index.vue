<template>
	<div style="height: 100%;">
		<el-container class="custom-el-container">
			<el-aside class="custom-el-aside" style="width: 0 auto;">
				<el-menu
					:collapse="collapsed"
					class="custom-el-menu"
					:default-active="$route.name"
					active-text-color="#2668a1"
					text-color="#fafdff"
					background-color="#00254a"
					router
				>
					<transition name="el-fade-in-linear">
						<div
							v-show="!collapsed"
							class="title font-title-extra-large font-line-height-extra-large"
						>
							故宫文物管理系统
						</div>
					</transition>
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
			</el-aside>
			<el-container>
				<el-header class="custom-el-header">
					<el-menu mode="horizontal">
						<el-menu-item @click="collapse"><i :class="collapseIcon"></i></el-menu-item>
						<el-menu-item style="float: right; height: 61px;" v-popover:user-popover>
							<i class="el-icon-user"></i>
							<span slot="title">{{ userName }}</span>
						</el-menu-item>
						<el-popover ref="user-popover" trigger="hover" placement="bottom">
							<button-logout @logout="actionAfterLogout"></button-logout>
						</el-popover>
					</el-menu>
				</el-header>
				<el-main>
					<transition name="el-fade-in-linear"><router-view /></transition>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import buttonLogout from '../../components/logoutBtn'
export default {
	components: {
		buttonLogout
	},
	data() {
		return {
			collapsed: false
		}
	},
	computed: {
		...mapGetters({
			userName: 'user/userName' // 用户名
		}),
		// 开关侧边栏按钮
		collapseIcon() {
			return this.collapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'
		}
	},
	methods: {
		...mapMutations({
			deleteUserData: 'user/deleteUserData' // 删除用户信息
		}),
		// 切换侧边栏大小
		collapse() {
			this.collapsed = !this.collapsed
		},
		// 登出后的动作
		actionAfterLogout() {
			this.deleteUserData()
			this.$router.replace({ name: 'login' }).catch(error => {
				console.log('route error:', error);
			})
		}
	},
	mounted() {}
}
</script>

<style lang="stylus">
.title
	text-align center
	font-weight 700
	line-height 300%
	width 200px
// elementUI滚动条适配
.el-scrollbar__view
	height 100%
body, .el-scrollbar__wrap
	overflow-x hidden
// 自定义容器宽高
.custom-el-container, .custom-el-aside, .custom-el-menu
	height 100%
// .custom-el-aside
// width 0 auto
.custom-el-header
	padding 0
</style>
