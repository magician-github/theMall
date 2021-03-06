import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css';
import axios from './api'
import element from '../element'

Vue.use(element);


Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
