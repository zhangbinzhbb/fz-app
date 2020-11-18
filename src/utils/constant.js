const ENV = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
// console.log("=========",ENV)
// 这里只是临时应用proxyTable进行代理进行接口访问，生产环境（打包）还是需要服务端进行跨越处理 端口号要和启动的HTTP服务的端口号一致，不然还是会有跨域问题

const DEV_API_URL = 'http://58.211.245.60:9080/eipserver' // 开发环境接口地址
// const DEV_API_URL = 'http://172.29.201.167:8080/eipserver' // 开发环境接口地址

// const DEV_API_URL = 'http://58.211.245.60:9081/eipserver' // 开发环境接口地址
// const DEV_API_URL = 'http://172.29.201.164:8086/eipserver' // 开发环境接口地址
// const DEV_API_URL = 'http://172.29.201.92:8080/eipserver' // 本地开发环境接口地址
// const DEV_API_URL = 'http://192.168.0.106:8080/eipserver' // 本地开发环境接口地址
// const DEV_API_URL = '/eipserver' // 开发环境接口地址

// PROD_API_URL,需要部署到哪个地址，就修改哪个服的地址
// const PROD_API_URL = 'http://172.29.201.220:8080/eipserver' // 生产环境接口地址-测试
// const PROD_API_URL = 'http://172.29.201.164:8086/eipserver/' // 生产环境接口地址-测试
//  const PROD_API_URL = '/eipserver' // 开发环境接口地址

const PROD_API_URL = 'http://58.211.245.60:9080/eipserver/' // 生产环境接口地址-测试
// const PROD_API_URL = 'http://58.211.245.60:9081/eipserver/' // 生产环境接口地址-上线

let configApi
// export default (configApi = {
//   ENV: ENV,
//   baseUrl: ENV === 'PROD' ? PROD_API_URL : DEV_API_URL, // 接口地址
//   downloadUrl:
//     ENV === 'PROD' ? PROD_API_URL : 'http://58.211.245.60:9081/eipserver', // 文件下载地址，接口返回的头像以及文件等地址
//   // ENV === 'PROD' ? PROD_API_URL : 'http://172.29.201.164:8086/eipserver', // 文件下载地址，接口返回的头像以及文件等地址
//   domain: ENV === 'PROD' ? PROD_API_URL + '/' : '' // 前端static中图片下载地址
// })

export default (configApi = {
  ENV: ENV,
  baseUrl: ENV === 'PROD' ? PROD_API_URL : DEV_API_URL, // 接口地址
  downloadUrl:
    ENV === 'PROD' ? PROD_API_URL : 'http://58.211.245.60:9080/eipserver', // 文件下载地址，接口返回的头像以及文件等地址
  // ENV === 'PROD' ? PROD_API_URL : 'http://172.29.201.164:8086/eipserver', // 文件下载地址，接口返回的头像以及文件等地址
  domain: ENV === 'PROD' ? PROD_API_URL + '/' : '' // 前端static中图片下载地址
})
