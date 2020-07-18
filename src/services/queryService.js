import Vue from 'vue'
import ytzx from './modules/ytzx'

const install = () => {
  Vue.prototype.$http = {
    ytzx
  }
}

export default install
