import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// state
import state from './state.js'

// modules
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
	state,
	modules,
	plugins: [createPersistedState({
		storage: window.sessionStorage
	})]
})
