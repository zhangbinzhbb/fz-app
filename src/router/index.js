import routes from './routes'
import storage from '../utils/storage'

const createRouter = () => new VueRouter({
  scrollBehavior: (to, from, savedPosition) => {
    const scrollInfo = storage.get('scorll-info') || {}
    if (savedPosition) {
      storage.remove('scorll-info')
      document.getElementsByClassName('comment-content')[0].scrollTop =
            scrollInfo.top
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop || scrollInfo.top
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

