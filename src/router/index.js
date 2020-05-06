import VueRouter from 'vue-router'
import Vue from 'vue'
import routes from './routes.js'
import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

function hasLogin() {
	return store.getters['user/hasLogin']
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
	console.log('router to: ', to.name)
	// 若不是前往登录界面，都要判断是否登录
	if (to.name === 'login') {
		if (hasLogin()) {
			next({
				path: '/'
			})
		}
	} else {
		if (!hasLogin()) {
			next({
				name: 'login'
			})
		}
	}
	next()
})

export default router
