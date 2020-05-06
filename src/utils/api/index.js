import axios from './customAxios.js'

// 登录
function login(data) {
	return axios({
		url: '/sessions',
		method: 'POST',
		data: data
	})
}

// 登出
function logout() {
	return axios({
		url: '/sessions',
		method: 'DELETE'
	})
}

// 用户列表
function userList() {
	return axios({
		url: '/users',
		method: 'GET'
	})
}

export default {
	login,
	logout,
	userList
}
