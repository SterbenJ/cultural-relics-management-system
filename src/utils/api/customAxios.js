import axios from 'axios'
import {
	// Loading,
	Message
} from 'element-ui'

// 根据环境切换 host
if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = '/api/v1'
} else {
	axios.defaults.baseURL = 'http://relics.wegfan.cn/api/v1'
}

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
		return response
	},
	(error) => {
		Message.error(error.response.data)
		// endLoading()

		return Promise.reject(error)
	}
)
export default axios
