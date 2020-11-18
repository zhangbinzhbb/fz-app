/*
 * @Author: fuSiYi
 * @Date: 2018-02-22 14:11:59
 * @Last Modified by: fuSiYi
 * @Last Modified time: 2018-05-10 16:41:29
 */

import axios from './axios'
import verify from './verify'
import storage from './storage'
import * as myFilter from './filter' /* 过滤器 */
import { Toast, MessageBox, Indicator } from 'vant'

// 兼容IOS设置页面title
function setTitle(title) {
  document.title = title
  const ua = navigator.userAgent
  if (/\bMicroMessenger\/([\d.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = ''
    i.style.display = 'none'
    i.onload = function() {
      setTimeout(function() {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

export default {
  install: (Vue) => {
    Vue.prototype.Toast = Toast
    Vue.prototype.MessageBox = MessageBox
    Vue.prototype.Indicator = Indicator
    // 绑定到vue实例的原型链上，这样可以在组件中直接调用this.$axios.get()，而不需要用import引入axios模块
    Vue.prototype.$axios = axios
    Vue.prototype.setTitle = setTitle // 在组件内直接调用 this.setTitle('title')
    Vue.prototype.verify = verify
    Vue.prototype.storage = storage
    Object.keys(myFilter).forEach(key => {
      Vue.filter(key, myFilter[key])
    })
  }

}
