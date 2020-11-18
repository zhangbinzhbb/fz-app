/*
 * @Author: yuxiaojing
 * @Date: 2018-03-28 17:48:34
 * @Last Modified by: yuxiaojing
 * @Last Modified time: 2018-03-28 17:53:45
 * 以下代码的功能是：使用sftp协议上传打包好的文件至目标服务器
 */

const gulp = require('gulp')
const sftp = require('gulp-sftp')

// 添加一个任务，在全局安装 gulp 的前提下可以在目标目录下 执行 gulp upload 启动这个任务
// upload 的名称可以自定义
gulp.task('upload', function () {
  return gulp.src('./dist/**')
    .pipe(sftp({
      // 这个对象是服务器的配置，要根据实际情况修改
      host: '',
      user: '',
      pass: '',
      port: 22,
      remotePath: '', // 这个路径是公司服务器配给前端项目测试用的
    }))
})

// 有多个服务器要部署可以定义多个任务
gulp.task('upload-p', function () {
  return gulp.src('./dist/**')
    .pipe(sftp({
      // ...... 参考 upload
    }))
})

// default 任务的功能是只需要在终端运行gulp 就ok
gulp.task('default',['upload']);
