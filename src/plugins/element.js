import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// element-ui的message属性需要挂载到Vue上
Vue.prototype.$message = Message
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
