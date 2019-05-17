import Vue from 'vue'
import Vuex from 'vuex'
import Cocosjs from 'cocosjs-core'
import CocosBCX from 'cocosjs-plugin-bcx'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: {},
    BCXWeb: {}
  },

  mutations: {
    UPDATE_ACCOUNT(state, account) {
      state.account = account
    },
    SET_BCX(state, cocos) {
      state.BCXWeb = cocos
    }
  },

  actions: {
    async CONNECT_COCOS({
      state,
      commit
    }) {
      try {
        if (window.BcxWeb) {
          bcx = window.BcxWeb && window.BcxWeb.BCX ? window.BcxWeb.BCX : window.BcxWeb
          console.log(bcx.account_name)
          commit('UPDATE_ACCOUNT', {
            name: bcx.account_name
          })
          return
        }
        Cocosjs.plugins(new CocosBCX())
        await Cocosjs.cocos.connect('My-App').then(connected => {
          if (!connected) return false
          const cocos = Cocosjs.cocos
          commit('UPDATE_ACCOUNT', {
            name: cocos.account_name
          })
          bcx = cocos.cocosBcx(bcx)
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
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