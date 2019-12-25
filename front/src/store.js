import Vue from 'vue'
import Vuex from 'vuex'
// import Cocosjs from 'cocosjs-core'
// import CocosBCX from 'cocosjs-plugin-bcx'
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
        if (window.BcxWeb) {
          state.bcx = window.BcxWeb
          state.bcx.initConnect().then(async res => {
            console.log('initConnect--web---configParams ', res.ws);
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
            state.bcx = new BCX(_configParams);
            state.bcx = window.BcxWeb
            state.bcx.getAccountInfo().then(res => {
              commit('UPDATE_ACCOUNT', {
                name: res.account_name,
              })
            })
          }).catch(error => {
            console.log('initConnect error', error);
          });
          return
        }
        let timer = null
        clearInterval(timer)
        timer = setInterval(() => {
          if (window.BcxWeb) {
            state.bcx = window.BcxWeb
            state.bcx.initConnect().then(async res => {
              console.log('initConnect-----configParams ', res.ws);
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
              state.bcx = new BCX(_configParams);
              state.bcx = window.BcxWeb
              state.bcx.getAccountInfo().then(res => {
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
              })
              clearInterval(timer)
            }).catch(error => {
              console.log('initConnect error', error);
            });
          }
        }, 1000)
      } catch (e) {
        console.log(e);
      }
    },
  },
})

// npm引入 npm install cocosjs - core cocosjs - plugin - bcx--registry = http: //39.105.4.131:8080/ -S
//   js 文件 使用
// import Cocosjs from "cocosjs-core";
// import CocosBCX from "cocosjs-plugin-bcx";
// Cocosjs.plugins(new CocosBCX())
// Cocosjs.cocos.connect("My-App").then(connected => {
//   if (!connected) return false;
//   const cocos = Cocosjs.cocos
//   window.CocosWeb = cocos
// })