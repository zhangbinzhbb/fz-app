/*
 * @Author: Gary
 * @Date: 2017-09-06 17:23:33
 * @Last Modified by: yuxiaojing
 * @Last Modified time: 2018-02-22 13:32:54
 * 封装axios
 */
import configApi from './constant'
import storage from './storage'
import qs from 'qs'

let userInfo = {}

const setDefaultParams = params => {
  if (configApi.ENV !== 'PROD') {
    userInfo = storage.get('yh-user') || {
      userId: 13228
    }
  } else {
    userInfo = {
      userId: appcan.locStorage.val('userId'),
      os: appcan.locStorage.val('os'),
      version: appcan.locStorage.val('version'),
      oem: appcan.locStorage.val('oem'),
      loginName: appcan.locStorage.val('loginName'),
      name: appcan.locStorage.val('name'),
      sv: appcan.locStorage.val('sv'), // 手机系统版本
      netType: '0',
      model: appcan.locStorage.val('model'),
      token: appcan.locStorage.val('token'),
      facePath: appcan.locStorage.val('facePath')
    }
  }
  userInfo = storage.get('yh-user') || {
    userId: 13228
  }
  const moreParams = {
    os: userInfo.os || 2,
    model: userInfo.model || 'SM-G9009',
    oem: userInfo.oem || 'samsung',
    cmd: userInfo.cmd || 'myTaskList',
    version: userInfo.version || '01.00.0017',
    netType: userInfo.netType || '0',
    sv: userInfo.sv || 'Android%206.0.1',
    longitude: userInfo.longitude || '',
    latitude: userInfo.latitude || ''
  }
  if (params) {
    params.userId = params.userId || userInfo.userId
    params.token = params.token
    params.loginName = params.loginName || userInfo.loginName
    // 将params添加到moreParams,重复的属性,后者会覆盖前者
    params = Object.assign(moreParams, params)
  }
  return params
}
const resolve = function(response, success, error) {
  const status = response.statue || response.status
  if (String(status) === '0') {
    success(response)
  } else {
    // console.log('api error=====', response)
    if (error) {
      error(response)
    } else {}
  }
}
const reject = function(response, error) {
  console.error('API Error')
  if (error) {
    error(response)
  }
}
// 创建axios实例
const service = axios.create({
  baseURL: configApi.baseUrl, // api的base_url
  timeout: 20000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
// request拦截器 -->发送请求是携带的token
service.interceptors.request.use(
  config => {
    let token
    if (configApi.ENV !== 'PROD') {
      token =
        appcan.locStorage.val('token') ||
        'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJqaW56cSIsImlhdCI6MTUzOTg1NzMwMTQyOH0.Uvu4y5SpUvEe4UsZO6YdpiKMFAU_BMes5QmRo3nMyV0'
    } else {
      if (!token) {
        token = appcan.locStorage.val('token')
      }
    }
    if (token) {
      config.headers['token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.dir(error) // for debug
    Promise.reject(error)
  }
)

// response拦截器--返回的数据是否正确
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    } else {
      const error = new Error(response.data)
      return Promise.reject(error)
    }
  },
  error => {
    console.dir(error)
    return Promise.reject(error)
  }
)
service.token = () => {
  return appcan.locStorage.val('token')
}

service.tokenStr = ''

service.get = (path, params, success, error) => {
  params = setDefaultParams(params)
  const res = service({
    url: path + '?' + qs.stringify(params),
    method: 'get',
    data: params,
    transformRequest: function(obj) {
      let ret = ''
      for (const it in obj) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(obj[it]) + '&'
      }
      return ret
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  res.then(
    response => {
      resolve(response, success, error)
    },
    response => {
      reject(response, error)
    }
  )
}

service.put = (path, params, success, error) => {
  params = setDefaultParams(params)
  const res = service({
    url: path + '?' + qs.stringify(params),
    method: 'put',
    data: params,
    transformRequest: function(obj) {
      let ret = ''
      for (const it in obj) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(obj[it]) + '&'
      }
      return ret
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  res.then(
    response => {
      resolve(response, success, error)
    },
    response => {
      reject(response, error)
    }
  )
}

service.post = (path, params, success, error) => {
  params = setDefaultParams(params)
  const res = service({
    url: path,
    method: 'post',
    params: params
  })
  res.then(
    response => {
      resolve(response, success, error)
    },
    response => {
      reject(response, error)
    }
  )
}

service.postJson = (path, params, success, error) => {
  params = setDefaultParams(params)
  const res = service({
    url: path,
    method: 'post',
    data: params,
    transformRequest: function(obj) {
      return JSON.stringify(obj)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  res.then(
    response => {
      resolve(response, success, error)
    },
    response => {
      reject(response, error)
    }
  )
  return res
}

service.pageData = (that, isFirst, callback) => {
  that.pageInfo.params.curPage = that.pageInfo.params.curPage || 1
  that.pageInfo.params.currPage = that.pageInfo.params.currPage || 1
  that.pageInfo.params.pageSize = that.pageInfo.params.pageSize || 10
  that.pageInfo.isFirst = isFirst
  if (isFirst) {
    that.pageInfo.params.curPage = 1
    that.pageInfo.params.currPage = 1
    that.pageInfo.list = []
    that.pageInfo.isAll = false
  }
  if (that.pageInfo.isAll || that.pageInfo.isLoading) {
    return
  }

  that.pageInfo.isLoading = true
  // eslint-disable-next-line no-empty
  if (!that.pageInfo.hideLoading) {}

  const postCb = function(res) {
    that.pageInfo.isLoading = false
    that.pageInfo.hideLoading = false
    if (isFirst) {
      that.pageInfo.list = res.dataContent || res.data
    } else {
      if (res.dataContent || res.data) {
        that.pageInfo.list = that.pageInfo.list.concat(
          res.dataContent || res.data
        )
      }
    }
    const listName = res.dataContent ? 'dataContent' : 'data'
    if (
      that.pageInfo.params.currPage === res.totalPage ||
      that.pageInfo.params.curPage === res.totalPage ||
      !res[listName] ||
      that.pageInfo.params.pageSize !== res[listName].length
    ) {
      that.pageInfo.isAll = true
    } else {
      that.pageInfo.params.curPage++
      that.pageInfo.params.currPage++
    }
    that.$set(that, 'isLoadAll', that.pageInfo.isAll)
    if (callback) {
      callback(that.pageInfo)
    }
  }

  const postType = that.pageInfo.postType || 'post'
  service[postType](
    that.pageInfo.postUrl,
    that.pageInfo.params,
    function(res) {
      postCb(res)
    },
    error => {
      that.pageInfo.isLoading = false
    }
  )
}

service.postFile = (path, file, success, error) => {
  const formData = new FormData()
  formData.append('file', file) // 通过append向form对象添加数据
  const res = service({
    url: path,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  res.then(
    response => {
      resolve(response, success, error)
    },
    response => {
      reject(response, error)
    }
  )
}

export default service
