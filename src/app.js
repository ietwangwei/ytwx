import Taro from '@tarojs/taro'
import Vue from 'vue'
import './app.scss'
import $http from './services/queryService'
import Vant from 'vant'
import 'vant/lib/index.css'
import Header from './components/Header'
import { Toast, Dialog } from "vant"

Vue.use($http)
Vue.use(Vant)
Vue.component('myHeader', Header)
Vue.prototype.$Taro = Taro
Vue.use(Toast)
Vue.use(Dialog)

const App = new Vue({
  onShow (options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
})

export default App
