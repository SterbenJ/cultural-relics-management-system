// Vue
import Vue from 'vue'

// 路由管理
import router from './router'

// 全局状态管理
import store from './store'

// Api
import api from './utils/api'

// attrsMap
import attrsMap from './utils/attrsMap'

// axios
/*
import axios from 'axios'
import VueAxios from 'vue-axios'
/*

// ElementUI
/* eslint-disable */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/* eslint-enable */

// 全局 css
import './common/GlobalCss.styl'

// 入口
import App from './App.vue'

// 配置 axios
/*
if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = '/api/v1'
} else {
	axios.defaults.baseURL = 'http://relics.wegfan.cn/api/v1'
}
Vue.use(VueAxios, axios)
*/

// 挂载 ElementUI
Vue.use(ElementUI)

// 挂载 api
Vue.prototype.api = api

// 挂载 attrsMap
Vue.prototype.attrsMap = attrsMap

// 关闭生产环境提示
Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
