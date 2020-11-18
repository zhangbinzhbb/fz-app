import router from './router'
import configApi from './utils/constant'
import storage from './utils/storage'

router.beforeEach((to, from, next) => {
  const localReffer = storage.get('refferPageName') || {}
  const refferPageName = localReffer.name
  const refferPageId = localReffer.id
  if (refferPageName && refferPageName !== '') {
    configApi.ENV === 'PROD'
      ? storage.remove('refferPageName')
      : storage.remove('refferPageName')
    router.push({
      name: refferPageName,
      query: {
        id: refferPageId
      }
    })
  }
  next()
})
