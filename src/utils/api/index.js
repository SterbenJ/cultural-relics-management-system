import axios from './customAxios.js'

function login(data) {
	return axios({
		url: '/sessions',
		method: 'POST',
		data: data
	})
}

function userList() {
	return axios({
		url: '/users',
		method: 'GET'
	})
}

export default {
	login,
	userList
}
