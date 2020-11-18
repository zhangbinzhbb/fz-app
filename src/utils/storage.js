/*
 * @Author: Gary
 * @Date: 2017-12-05 13:10:44
 * @Last Modified by: Gary
 * @Last Modified time: 2017-12-05 15:04:54
 * 用户状态操作
 */

import configApi from './constant'

const storage = {}

const keyToken = configApi.ENV === 'PROD' ? 'token' : 'token'

// localStorage
storage.set = (key, value) => {
  window.localStorage.setItem(
    key,
    typeof value === 'object' ? JSON.stringify(value) : value
  )
}

storage.get = key => {
  const res = window.localStorage.getItem(key)
  return JSON.parse(res)
}

// storage.getString = (key) => {
//   const res = window.localStorage.getItem(key)
//   return JSON.parse(res)
// }
storage.remove = key => {
  window.localStorage.removeItem(key)
}

// sessionStorage
storage.sessionSet = (key, value) => {
  key = key || keyToken
  window.sessionStorage.setItem(
    key,
    typeof value === 'object' ? JSON.stringify(value) : value
  )
}

storage.sessionGet = key => {
  key = key || keyToken
  return JSON.parse(window.sessionStorage.getItem(key))
}
storage.sessionRemove = key => {
  key = key || keyToken
  window.sessionStorage.removeItem(key)
}

// token
storage.getToken = () => {
  return window.localStorage.getItem(keyToken)
}
storage.setToken = value => {
  window.localStorage.setItem(keyToken, value)
}
storage.removeToken = () => {
  storage.remove(keyToken)
}
export default storage
