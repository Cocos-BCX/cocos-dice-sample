import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: {}
  },

  mutations: {
    UPDATE_ACCOUNT(state, account) {
      state.account = account;
    }
  }
});

