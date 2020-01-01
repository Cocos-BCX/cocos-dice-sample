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
            window.BcxWeb.initConnect().then(async res => {
              var _configParams = {
                ws_node_list: [{
                  url: res.ws,
                  name: res.name
                }],
                faucet_url: res.faucetUrl,
                networks: [{
                  core_asset: res.coreAsset,
                  chain_id: res.chainId
                }],
                auto_reconnect: true,
                real_sub: true,
                check_cached_nodes_data: false
              };
              window.BcxWeb.bcx = new BCX(_configParams);
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
            }).catch(error => {
              commit('LOADING', false)
              clearInterval(timer)
              Message({
                duration: 1200,
                message: 'connect failed',
                type: 'error',
              })
            });
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