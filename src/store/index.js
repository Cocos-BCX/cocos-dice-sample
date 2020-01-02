import Vue from 'vue'
import Vuex from 'vuex'
import eventHub from "@/utils/event";
import {
  Message
} from 'element-ui'
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    account: {},
    cocos: 0,
    loading: false,
    bcx: {}
  },
  mutations: {
    UPDATE_ACCOUNT(state, account) {
      state.account = account
    },
    SET_BCX(state, bcx) {
      state.bcx = bcx
    },
    SET_COCOS(state, cocos) {
      state.cocos = cocos
    },
    LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async CONNECT_COCOS({
      state,
      commit
    }) {
      try {
        commit('LOADING', true)
        let timer = null
        clearInterval(timer)
        timer = setInterval(() => {
          if (window.BcxWeb) {
            commit('SET_BCX', window.BcxWeb)
            window.BcxWeb.getAccountInfo().then(res => {
              if (res.locked) {
                Message({
                  duration: 1200,
                  message: 'Account Locked',
                  type: 'error',
                })
                return
              }
              commit('UPDATE_ACCOUNT', {
                name: res.account_name,
              })
              commit('LOADING', false)
            })
            clearInterval(timer)
          }
        }, 1000)
      } catch (error) {
        commit('LOADING', false)
        clearInterval(timer)
        Message({
          duration: 1200,
          message: 'connect failed',
          type: 'error',
        })
      }
    },
  },
})