# 移动端开发事例项目

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

项目目录：
```
├── src                     <- 的布局
│   ├── assets              <- 页面通用组件
│   │   ├── sass            <- 页面通用组件
│   │   │   ├── common/gloable    <- 页面通用样式
│   │   │   ├── projectBoss       <- 项目详情等相关样式
│   ├── components          <- 页面通用组件
│   │   ├── attachment            <- 附件以及文件下载
│   │   ├── avator                <- 通用头像
│   │   ├── basicform             <- 表单页面新增、修改、详情
│   │   ├── blank                 <- 空白页面
│   │   ├── comment               <- 评论页面组件
│   │   ├── company               <- 企业选择页面
│   │   ├── listItem              <- 列表通用页面
│   │   ├── mixins                <- 全局通用方法引入
│   │   ├── more                  <- 页面右上侧。。。
│   │   ├── person                <- 选人通用组件
│   │   ├── project               <- 基金、子基金、项目、平台详情等通用组件
│   │   ├── rightPopup            <- 右侧页面弹出（全屏和半屏）
│   │   ├── shortCut              <- +快捷方式
│   │   ├── tags                  <- 筛选后tags
│   │   ├── headerx               <- 顶部导航栏
│   │   ├── navBar                <- 底部导航栏
│   ├── router              <- 页面
│   │   ├── index           <- 路由配置
│   │   ├── home            <- 首页模块以及全局大部分页面
│   │   │   ├──meetingFile        <- 会议纪要
│   │   │   │   ├──componets      <- 模块相关组件
│   │   │   │   ├──mixins         <- 新增编辑、详情通用引用
│   │   │   │   ├──*add           <- 新增编辑页面
│   │   │   │   ├──*detail        <- 详情页面
│   │   │   │   ├──*list          <- 列表页面
│   │   ├── hr              <- 人力资源模块相关页面
│   │   ├── mail            <- 通讯录相关页面
│   │   ├── pages           <- 其他页面
│   │   ├── profile         <- 个人中心相关页面
│   ├── utils
│   │   ├── axios           <- 接口通用封装方法
│   │   ├── constant        <- 系统常量配置（切换API正式服测试服）
│   │   ├── filter          <- 过滤方法
│   │   ├── index           <- 全局js配置
│   │   ├── storage         <- loacal保存方法
│   │   ├── verify          <- 通用验证方法

```

打包策略：
第一步 utils constant.js 环境切换
// const PROD_API_URL = 'http://172.29.201.220:8080/eipserver' // 生产环境接口地址-测试
// const PROD_API_URL = 'http://58.210.96.191:9081/eipserver' // 生产环境接口地址-上线
第二步
。。。
第三步
static
appcan
全局搜索 http://172.29.201.164:8086 替换 你想要的地址
第四步
process 页面里 跳转到template 页面
根据你环境去切换
const address_url = ENV === 'PROD' ? 'http://58.211.245.60:9080/eipserver/staticTest/template/template_detail_workflow.html' : '../../static/template/template_detail_workflow.html'

setp:0
  编辑中static文件图片写法
step:1
  :src="baseConfig.domain+'static/..."
step:2
  # cosntant 文件切换到‘PROD’（注意修改PROD_API_URL测试服和正式服的地址）
step:3
  npm run build
step:4
  修改dist js中的menifest文件（修改为外网发布地址:baseConfig.domain）
  o.p = "./" 替换为 o.p = "http://58.211.245.60:9080/eipserver/"（测试服）,
  替换为 o.p = "http://58.210.96.191:9080/eipserver/"（正式服）,

增加功能
1.手机端调试项目（vConsole插件）

2. vant 版本过低，升级一个大版本

// 蓝狐设计稿
https://lanhuapp.com/url/AoO8W-uovtH
zhangyc@oriza.com
Oriza123

"vant": "^2.0.2",

接口文档2：
https://docs.qq.com/sheet/DZmN5ZExPeVVKaVlT?tab=BB08J2

任务进度表
https://docs.qq.com/sheet/DZmtmZXdWVUtzV09Q?tab=oyul5d&c=I33A0B0

https://k85aw4.axshare.com
密码0208eip

使用npm的一个名为rimraf的模块进行删除
npm install -g rimraf
rimraf node_modules

线上环境1：
http://58.211.245.60:9080/eipserver/eipApp.html#/newadd

// 安装包地址
http://58.211.191.117:90/package/

线上账号：APPTest Oriza@123

http://58.211.245.60:9080/eipserver/MyApplyMeetingAction/getMeetingCalendar.do?os=2&model=SM-G9009&oem=samsung&cmd=myTaskList&version=01.00.0017&netType=0&sv=Android%25206.0.1&longitude=&latitude=&IS_PAGE=true&curPage=1&pageSize=100&startDate=2019-01-01&endDate=2019-12-31&currPage=1&userId=13204&loginName=APPTest

使用npm的一个名为rimraf的模块进行删除
npm install -g rimraf
rimraf node_modules

项目开发总结：
1、开发过程中，整个app中表单最难用，不利于项目新人加入比较平缓的过度
组件封装意义在于，让新人加入进来是拿到代码能快速开发，而花费代码去理解组件时怎么使用、和封装
组件过度封装就是失去她的灵活性，所以我认为这个app，我不建议对表单进行封装使用，可以是样式是一套的风格

项目结构变动


在项目中，一般使用npm拉取包使用，但是有时因为文件过大，加载慢等原因，需要CDN引入外部资源，以 axios 为例，在 index.html 文件中CDN引入

// vue-infinite-scroll  待优化
项目数据加载慢时，需要加个loading，数据只有4条刚好到底，滚动不触发滚动加载

前端app 解决导入自定义字体无效的问题
1、先找个通用字体库引入，看是否引入路径出错了

1、兼容性问题，IOS,键盘弹出遮挡输入框，上拉页面无反应；往下拉时，头直接掉下来了（如来访接待中的备注字段）
2、刘海的苹果手机、ios键盘弹出，具体参考描述

 IOS13 van-popup 设置 position="right" 效果却是，先从右侧弹出一半，然后全部弹出，带有卡顿。但是有时候却是正常的，时好时坏，异常效果出现概率在50%左右。请问问题解决了吗？

解决：发现vant包对ios13 popups不兼容的

在项目中做移动端页面，发现IOS 的光标大小很大，和安卓的完全不一样
?只是调整了line-height的大小，就解决了iOS和Android手机input光标大小不一致的问题
https://www.jb51.net/article/145120.htm
line-height: normal;

js数组对象相同项合并处理
　　var arr = [
　　　　{"id":"1","name":"张三","value":"1245"},
　　　　{"id":"1","name":"张三","value":"1360"},
　　　　{"id":"2","name":"李四","value":"1120"},
　　　　{"id":"2","name":"李四","value":"1362"},
　　　　{"id":"2","name":"李四","value":"1008"},
　　　　{"id":"3","name":"王五","value":"1360"},
　　　　{"id":"4","name":"赵六","value":"1986"},
　　　　{"id":"4","name":"赵六","value":"1240"}
　　];
　　var map = {},dest = [];
　　for(var i = 0; i < arr.length; i++){
　　　　var ai = arr[i];
　　　　if(!map[ai.id]){
　　　　　　dest.push({
　　　　　　　　id: ai.id,
　　　　　　　　name: ai.name,
　　　　　　　　value: ai.value
　　　　　　});
　　　　　　map[ai.id] = ai;
　　　　}else{
　　　　　　for(var j = 0; j < dest.length; j++){
　　　　　　　　var dj = dest[j];
　　　　　　　　if(dj.id == ai.id){
　　　　　　　　　　dj.value=(parseFloat(dj.value) + parseFloat(ai.value)).toString();
　　　　　　　　　　break;
　　　　　　　　}
　　　　　　}
　　　　}
　　};
　　console.log(dest);
    // 获取到的示列
　　var arr = [
　　　　{"id":"1","name":"张三","value":"2605"},
　　　　{"id":"2","name":"李四","value":"3490"},
　　　　{"id":"3","name":"王五","value":"1360"},
　　　　{"id":"4","name":"赵六","value":"3226"}
　　];

https://www.cnblogs.com/lingdu87/p/9592320.html
