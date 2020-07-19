import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
Vue.config.productionTip = false
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
console.log(Vue.prototype)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
