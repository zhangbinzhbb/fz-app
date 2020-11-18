import './styles/common.scss'
import './styles/base.css'
import './styles/form_style_common.scss'
import 'normalize.css/normalize.css' // 重置样式
import Flex from 'amfe-flexible'
import App from './App'
import router from './router'
import myComponents from './utils' /* 按需引入UI组件及全局方法 */
import './permission' // permission control
import mixins from './components/mixins/base'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

Vue.use(myComponents)
Vue.use(Flex)
Vue.mixin(mixins)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  created() {
    // 解决打包时每次修改路径的问题
    const ENV = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
    const url =
      ENV === 'PROD'
        ? '/eipserver/staticRY/'
        : '../../../static/'
    // const url =
    //   ENV === 'PROD'
    //     ? 'http://58.211.245.60:9081/eipserver/staticRY/'
    //     : '../../../static/'
    appcan.locStorage.val('publicFileName', url)
  },
  template: '<App/>'
})
