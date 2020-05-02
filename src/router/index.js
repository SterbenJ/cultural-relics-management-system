import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: {
			name: 'culturalRelicsList'
		}
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/login')
	},
	{
		path: '/index',
		name: 'index',
		component: () => import('../views/index'),
		children: [
			{
				path: '',
				redirect: {
					name: 'culturalRelicsList'
				}
			},
			{
				path: 'cultural-relics-list',
				name: 'culturalRelicsList',
				component: () => import('../views/culturalRelicsList')
			},
			{
				path: 'check-record',
				name: 'checkRecord',
				component: () => import('../views/checkRecord')
			},
			{
				path: 'cultural-relics-need-touch',
				name: 'culturalRelicsNeedTouch',
				component: () => import('../views/culturalRelicsNeedTouch')
			},
			{
				path: 'operation-record',
				name: 'operationRecord',
				component: () => import('../views/operationRecord')
			},
			{
				path: 'member-management',
				name: 'memberManagement',
				component: () => import('../views/memberManagement')
			}
		]
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
