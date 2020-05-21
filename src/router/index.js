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

function jobId() {
	return store.getters['user/jobId']
}

function jobIndex() {
	console.log('to job index');
	const id = jobId()
	if (id === 5) {
		return {
			name: 'culturalRelicsList'
		}
	}
	if (id === 4) {
		return {
			name: 'culturalRelicsList'
		}
	}
	if (id === 3) {
		return {
			name: 'warehouseManagement'
		}
	}
	if (id === 2) {
		return {
			name: 'culturalRelicsList'
		}
	}
	if (id === 1) {
		return {
			name: 'createRelics'
		}
	}
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
	console.log('router to: ', to.name)
	console.log('router from: ', from.name)
	// 若不是前往登录界面，都要判断是否登录
	if (to.name === 'login') {
		if (hasLogin()) {
			next(jobIndex())
		}
	} else {
		if (!hasLogin()) {
			console.log('back to login');
			next({
				name: 'login'
			})
		}
		if (!from.name) {
			if (to.name === jobIndex().name) {
				next()
			} else {
				next(jobIndex())
			}
		}
		if (from.name === 'login') {
			if (to.name === jobIndex().name) {
				next()
			} else {
				next(jobIndex())
			}
		}
	}
	next()
})

export default router
