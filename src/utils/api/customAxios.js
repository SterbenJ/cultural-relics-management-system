import axios from 'axios'
import {
	// Loading,
	Message
} from 'element-ui'
import router from '../../router'
import store from '../../store'

// 根据环境切换 host
if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = '/api/v1'
} else {
	// axios.defaults.headers.common.Origin = 'http://relics.norah1to.com'
	axios.defaults.baseURL = 'http://relics.wegfan.cn/api/v1'
}

axios.defaults.withCredentials = true

/*
let loading

function startLoading() {
	loading = Loading.service({
		lock: true,
		text: '加载中....',
		background: 'rgba(0, 0, 0, 0.7)'
	})
}

function endLoading() {
	loading.close()
}
*/

// 请求拦截
axios.interceptors.request.use(
	(confing) => {
		// startLoading()

		return confing
	},
	(error) => {
		return Promise.reject(error)
	}
)

// 响应拦截

axios.interceptors.response.use(
	(response) => {
		// endLoading()
		if (response.data.code !== 200) {
			Message.error(response.data.msg)
			if (response.data.code === 403) {
				// 清空用户信息，对应长时间挂机 session 过期的清空
				store.commit('user/deleteUserData')
				router.replace({
					name: 'login'
				})
			}
			return Promise.reject(response)
		}
		return response
	},
	(error) => {
		Message.error(error.response.data)
		// endLoading()

		return Promise.reject(error)
	}
)
export default axios
