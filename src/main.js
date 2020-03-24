import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入树型表格组件
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
// 把axios挂载到Vue的原型对象上
Vue.prototype.$http = axios
// 设置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在发送的请求头上添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})

// 添加树型表格组件
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
