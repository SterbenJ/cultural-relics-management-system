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
							class="index-title font-title-extra-large font-line-height-extra-large"
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
							v-if="hasPermission(3)"
							index="createRelics"
							:route="{ name: 'createRelics' }"
						>
							拍照新建文物
						</el-menu-item>
						<el-menu-item
							v-if="hasPermission(4)"
							index="culturalRelicsList"
							:route="{ name: 'culturalRelicsList' }"
						>
							文物列表
						</el-menu-item>
						<!-- <el-menu-item
							index="culturalRelicsNeedTouch"
							:route="{ name: 'culturalRelicsNeedTouch' }"
						>
							待录文物
						</el-menu-item> -->
						<el-menu-item
							v-if="hasPermission(8)"
							index="checkRecordList"
							:route="{ name: 'checkRecordList' }"
						>
							盘点记录
						</el-menu-item>
					</el-submenu>
					<!-- 操作管理 -->
					<el-submenu v-if="hasPermission(1)" index="2">
						<template slot="title">
							<i class="el-icon-edit"></i>
							<span slot="title">操作管理</span>
						</template>
						<el-menu-item index="operationRecord" :route="{ name: 'operationRecord' }">
							操作记录
						</el-menu-item>
					</el-submenu>
					<!-- 仓库管理 -->
					<el-submenu v-if="hasPermission(2)" index="3">
						<template slot="title">
							<i class="el-icon-house"></i>
							<span slot="title">仓库管理</span>
						</template>
						<el-menu-item
							index="warehouseManagement"
							:route="{ name: 'warehouseManagement' }"
						>
							仓库管理
						</el-menu-item>
						<el-menu-item
							index="shelvesManagement"
							:route="{ name: 'shelvesManagement' }"
						>
							货架管理
						</el-menu-item>
					</el-submenu>
					<!-- 成员管理 -->
					<el-menu-item
						v-if="hasPermission(1)"
						index="memberManagement"
						:route="{ name: 'memberManagement' }"
					>
						<i class="el-icon-school"></i>
						<span slot="title">成员管理</span>
					</el-menu-item>
					<!-- 新建盘点入口 -->
					<el-menu-item
						v-if="hasPermission(8)"
						index="initCheck"
						:route="{ name: 'initCheck' }"
					>
						<i class="el-icon-s-order"></i>
						<span slot="title">盘点文物</span>
					</el-menu-item>
					<el-menu-item
						v-if="hasPermission(5) || hasPermission(7) || hasPermission(4)"
						index="scanEditInfo"
						:route="{ name: 'scanEditInfo' }"
					>
						<i class="el-icon-edit"></i>
						<span slot="title">扫码查看文物信息</span>
					</el-menu-item>
					<!-- <el-menu-item index="test" :route="{ name: 'test' }">
						<span slot="title">测试</span>
					</el-menu-item> -->
					<el-menu-item
						index="4"
						v-show="!collapsed"
						@click="toAuthor"
						class="author-item"
					>
						author @NoraH1to
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
							<div
								class="font-line-height-extra-large font-title-large container-horizontal-center"
							>
								{{ getJobName }}
							</div>
							<button-change-pwd
								class="user-popover-item"
								@showChangePwdDialog="changePwdDialogVisible = true"
							></button-change-pwd>
							<button-logout
								class="user-popover-item"
								@logout="actionAfterLogout"
							></button-logout>
						</el-popover>
						<change-pwd-dialog
							:changePwdDialogVisible.sync="changePwdDialogVisible"
						></change-pwd-dialog>
					</el-menu>
				</el-header>
				<el-scrollbar ref="scrollbar" style="height:100%">
					<el-main>
						<transition name="el-fade-in-linear">
							<keep-alive>
								<router-view v-if="this.$route.meta.keepAlive"></router-view>
								<!--这里是会被缓存的组件-->
							</keep-alive>
						</transition>
						<transition name="el-fade-in-linear">
							<router-view v-if="!this.$route.meta.keepAlive"></router-view>
						</transition>
					</el-main>
				</el-scrollbar>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import buttonLogout from '../../components/logoutBtn'
import buttonChangePwd from '../../components/changePwdBtn'
import changePwdDialog from '../../components/changePwdDialog'
export default {
	components: {
		buttonLogout,
		buttonChangePwd,
		changePwdDialog
	},
	data() {
		return {
			collapsed: false,
			changePwdDialogVisible: false
		}
	},
	computed: {
		...mapGetters({
			userName: 'user/userName', // 用户名
			getJobName: 'getJobName', // 用户职务
			hasPermission: 'user/hasPermission'
		}),
		// 开关侧边栏按钮
		collapseIcon() {
			return this.collapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'
		}
	},
	watch: {
		// 检测 当前路由地址的变化, 路由地址发生改变时, router-view 显示的路由改变时需要将滚动条复位到顶部
		'$route.path'(newValue, oldValue) {
			// 通过 ref 拿到 el-scrollbar 的实例对象( vue 实例对象)
			const scrollbar = this.$refs.scrollbar
			// scrollbar 的实例对象相当于在 el-scrollbar 组件里面的 this
			const wrap = scrollbar.$refs.wrap
			// $refs.wrap 是 el-scrollbar 组件里的 ref='wrap', 是一个 dom
			wrap.scrollTo(0, 0)
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
				console.log('route error:', error)
			})
		},
		toAuthor() {
			window.open('https://github.com/SterbenJ')
		}
	},
	mounted() {}
}
</script>

<style lang="stylus">
.index-title
	text-align center
	font-weight 700
	line-height 300%
	color #fafdff
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
.user-popover-item
	margin-bottom 10px
// 作者信息
.author-item
	position absolute
	text-align center
	width 200px
	bottom 0px
	width 100%
</style>
