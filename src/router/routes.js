export default [{
		path: '/',
		redirect: {
			path: '/index'
		}
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/login')
	},
	{
		path: '/check/:id',
		name: 'check',
		component: () => import('../views/check'),
		props: true
	},
	{
		path: '/scan-editInfo',
		name: 'scanEditInfo',
		component: () => import('../views/scanEditInfo')
	},
	{
		path: '/index',
		component: () => import('../views/index'),
		children: [{
				path: '',
				redirect: {
					name: 'culturalRelicsList'
				}
			},
			{
				path: 'cultural-relics-list',
				name: 'culturalRelicsList',
				component: () => import('../views/culturalRelicsList'),
				meta: {
					// keepAlive: true
				}
			},
			{
				path: 'check-record-list',
				name: 'checkRecordList',
				component: () => import('../views/checkRecordList')
			},
			{
				path: 'check-record',
				name: 'checkRecord',
				component: () => import('../views/checkRecord'),
				props: (route) => {
					return { ...route.query }
				}
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
			},
			{
				path: 'warehouse-management',
				name: 'warehouseManagement',
				component: () => import('../views/warehouseManagement'),
				meta: {
					// keepAlive: true
				}
			},
			{
				path: 'init-check',
				name: 'initCheck',
				component: () => import('../views/initCheck')
			},
			{
				path: 'shelves-management',
				name: 'shelvesManagement',
				component: () => import('../views/shelvesManagement'),
				props: (route) => {
					return { ...route.query }
				}
			},
			{
				path: 'relics',
				name: 'relics',
				component: () => import('../views/relics'),
				props: (route) => {
					return { ...route.query }
				}
			},
			{
				path: 'create-relics',
				name: 'createRelics',
				component: () => import('../views/createRelics')
			},
			{
				path: 'test',
				name: 'test',
				component: () => import('../views/test')
			}
		]
	}
]
