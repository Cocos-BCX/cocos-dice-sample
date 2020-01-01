import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import store from './store';
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import brands from '@fortawesome/fontawesome-free-brands';

import 'normalize.css';
import 'element-ui/lib/theme-chalk/base.css';
import 'element-ui/lib/theme-chalk/dialog.css';
import 'element-ui/lib/theme-chalk/alert.css';
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/notification.css';
import './css/style.css';

library.add(faSignOutAlt, brands);

Vue.use(ElementUI);
Vue.config.productionTip = false

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')