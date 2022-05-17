import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		d2admin
	},
	state: {
		HOST: 'http://127.0.0.1:8888',
		isPlay: false, //是否播放中
		url: '', //歌曲地址
		id: '' //歌曲id
	},
	getters: {
		isPlay: state => state.isPlay,
		url: state => state.url,
		id: state => state.id
	},
	mutations: {
		setIsPlay: (state, isPlay) => {
			state.isPlay = isPlay
		},
		setUrl: (state, url) => {
			state.url = url
		},
		setId: (state, id) => {
			state.id = id
		}
	}
})
