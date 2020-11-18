function checkVersion() {
  var os
  var version
  /*
   * 1.获得当前设备系统名称
   */
  if (getPlatf() == 'android') {
    os = 1
  } else if (getPlatf() == 'ios') {
    os = 2
  } else {
    os = 3
  }
  /*
   * 2.获得当前设备版本号
   */
  getVersion(function(a) {
    version = a.version
    // var appname = a.name;
    var appname = '元禾控股EIP'
    /*
     * 3.版本升级接口
     *  从数据库拿到最新版本号与当前设备版本号进行对比
     *  如果不是最新版本，setUpdateFlag("true")
     */
    var centerVersion = centerIP + '/VersionAction/search.do'
    var url = centerVersion + '?os=' + os + '&version=' + version
    /*
     * JSON数据类型
     * var data = {"updateDesc":"升级版本","statue":"0","updateFlag":"true","msg":"成功","updateType":"1","updateURL":"http://122.92.167.3:83/fsiweb/jxhd_android_V1.0.apk","version":"1.1"}
     */
    var json = {}
    requestJson({
      uri: url,
      type: 'GET',
      postData: json,
      callback: function(status, data) {
        if (status != 0) {
          // callback(1);
          return
        }
        if (data.statue == 0) {
          // 弹出框让用户选择是否更新
          if (data.updateFlag == true || data.updateFlag == 'true') {
            // 需要更新
            var updateurl = data.updateURL
            appcan.locStorage.val('updateType', data.updateType)
            // this.storage.set('updateType', data.updateType)
            if (data.updateType == 1) {
              // 强制更新
              // 打开一个确认框
              appcan.window.confirm({
                title: '发现新版本，请立即更新',
                content: '更新内容：' + data.updateDesc,
                buttons: ['暂不更新', '立刻更新'],
                callback: function(err, data, dataType, optId) {
                  if (err) {
                    // 如果出错了
                    return
                  }
                  // data 按照按钮的索引返回值
                  if (data == 0) {
                    uexWidgetOne.exit(0)
                    // 退出app
                  } else if (data == 1) {
                    appcan.locStorage.val('update_appname', appname)
                    appcan.locStorage.val('update_url', updateurl)
                    // this.storage.set('update_appname', appname)
                    // this.storage.set('update_url', updateurl)
                    if (os === '2' || os === 2) {
                      /*
                       * 启动第三方应用AppStore
                       * updateurl是最新版本在AppStore中的地址
                       */
                      uexWidget.loadApp(updateurl)
                    } else {
                      openwin('update', 'update.html', 4, 10)
                    }
                  }
                }
              })
            } else {
              // 选择更新
              // 打开一个确认框
              appcan.window.confirm({
                title: '发现新版本，请立即更新',
                content: '更新内容：' + data.updateDesc,
                buttons: ['暂不更新', '立刻更新'],
                callback: function(err, data, dataType, optId) {
                  if (err) {
                    // 如果出错了
                    return
                  }
                  // data 按照按钮的索引返回值
                  if (data === 0) {
                    // uexWidgetOne.exit(0);//退出app
                  } else if (data === 1) {
                    appcan.locStorage.val('update_appname', appname)
                    appcan.locStorage.val('update_url', updateurl)
                    // this.storage.set('update_appname', appname)
                    // this.storage.set('update_url', updateurl)
                    if (os === '2' || os === 2) {
                      /*
                       * 启动第三方应用AppStore
                       * updateurl是最新版本在AppStore中的地址
                       */
                      uexWidget.loadApp(updateurl)
                    } else {
                      openwin('update', 'update.html', 4, 10)
                    }
                  }
                }
              })
            }
          }
        } else if (data.statue == '1') {
        } else {
        }
      }
    })

    // appcan.request.getJSON(url,function(data) {
    // if (data.statue == 0) {
    // //弹出框让用户选择是否更新
    // if (data.updateFlag == true || data.updateFlag == 'true') {
    // //需要更新
    // var updateurl = data.updateURL;
    // appcan.locStorage.val("updateType", data.updateType);
    // if (data.updateType == 1) {//强制更新
    // //打开一个确认框
    // appcan.window.confirm({
    // title : '发现新版本，请立即更新',
    // content : "更新内容：" + data.updateDesc,
    // buttons : ["暂不更新", "立刻更新"],
    // callback : function(err, data, dataType, optId) {
    // if (err) {
    // //如果出错了
    // return;
    // }
    // //data 按照按钮的索引返回值
    // if (data == 0) {
    // uexWidgetOne.exit(0);
    // //退出app
    // } else if (data == 1) {
    // appcan.locStorage.val("update_appname", appname);
    // appcan.locStorage.val("update_url", updateurl);
    // if(os == '2'||os == 2){
    // /*
    // * 启动第三方应用AppStore
    // * updateurl是最新版本在AppStore中的地址
    // */
    // uexWidget.loadApp(updateurl);
    // }else{
    // openwin("update","update.html",4,10);
    // }
    // }
    // }
    // });
    //
    // } else {//选择更新
    // //打开一个确认框
    // appcan.window.confirm({
    // title : '发现新版本，请立即更新',
    // content : "更新内容：" + data.updateDesc,
    // buttons : ["暂不更新", "立刻更新"],
    // callback : function(err, data, dataType, optId) {
    // if (err) {
    // //如果出错了
    // return;
    // }
    // //data 按照按钮的索引返回值
    // if (data == 0) {
    // //uexWidgetOne.exit(0);//退出app
    // } else if (data == 1) {
    // appcan.locStorage.val("update_appname", appname);
    // appcan.locStorage.val("update_url", updateurl);
    // if(os == '2'||os == 2){
    // /*
    // * 启动第三方应用AppStore
    // * updateurl是最新版本在AppStore中的地址
    // */
    // uexWidget.loadApp(updateurl);
    // }else{
    // openwin("update","update.html",4,10);
    // }
    // }
    // }
    // });
    // }
    // }
    //
    // } else if (data.statue == '1') {
    // } else {
    // }
    // })
  })
}

// 网络请求
function requestJson(options) {
  if (options.length < 1) {
    return
  }
  var uri = options.uri
  var cb = options.callback
  var isToast = options.isToast != false
  var reqType = options.type || 'POST'
  var postData = options.postData || {}

  var pOs = 'os=' + appcan.locStorage.val('os')
  var pVersion = 'version=' + appcan.locStorage.val('version')
  var pOem = 'oem=' + appcan.locStorage.val('oem')
  var pSv = 'sv=' + appcan.locStorage.val('sv')
  var pConnectStatus = 'netType=' + appcan.locStorage.val('netType')
  var pModel = 'model=' + appcan.locStorage.val('model')
  // var pOs = 'os=' + this.storage.get('os')
  // var pVersion = 'version=' + this.storage.get('version')
  // var pOem = 'oem=' + this.storage.get('oem')
  // var pSv = 'sv=' + this.storage.get('sv')
  // var pConnectStatus = 'netType=' + this.storage.get('netType')
  // var pModel = 'model=' + this.storage.get('model')

  // var lat = 'latitude=' + appcan.locStorage.val("appLat") + '&longitude=' + appcan.locStorage.val("appLog");

  if (uri.indexOf('os=') == -1) {
    if (uri.indexOf('.do?') == -1) {
      uri = uri + '?' + pOs
    } else {
      uri = uri + '&' + pOs
    }
  }
  if (uri.indexOf('version=') == -1) {
    if (uri.indexOf('.do?') == -1) {
      uri = uri + '?' + pVersion
    } else {
      uri = uri + '&' + pVersion
    }
  }
  if (uri.indexOf('oem=') == -1) {
    if (uri.indexOf('.do?') == -1) {
      uri = uri + '?' + pOem
    } else {
      uri = uri + '&' + pOem
    }
  }
  if (uri.indexOf('sv=') == -1) {
    if (uri.indexOf('.do?') == -1) {
      uri = uri + '?' + pSv
    } else {
      uri = uri + '&' + pSv
    }
  }
  if (uri.indexOf('netType=') == -1) {
    if (uri.indexOf('.do?') == -1) {
      uri = uri + '?' + pConnectStatus
    } else {
      uri = uri + '&' + pConnectStatus
    }
  }
  if (uri.indexOf('model=') == -1) {
    if (uri.indexOf('.do?') == -1) {
      uri = uri + '?' + pModel
    } else {
      uri = uri + '&' + pModel
    }
  }
  if (uri.indexOf('latitude=') == -1) {
    if (uri.indexOf('.do?') == -1) {
      uri = uri + '?' + lat
    } else {
      uri = uri + '&' + lat
    }
  }
  var url = encodeURI(uri)
  var isNet = true

  appcan.request.ajax({
    url: url,
    type: reqType,
    data: postData,
    datatype: 'json',
    timeout: 30000,
    headers: {
      token: appcan.locStorage.val('token')
    },
    success: function(data, status, requestCode, response, xhr) {
      uexWindow.closeToast()
      data = JSON.parse(data)
      if (data.statue == '0') {
        uexWindow.closeToast()
        cb(0, data)
      } else {
        uexWindow.closeToast()
        if (isToast) {
          appcan.window.openToast(data.msg, 3000, '5', '0')
        }
        cb(1, data)
      }
    },
    error: function(xhr, erroType, error, msg) {
      uexWindow.closeToast()
      if (isToast) {
        if (msg.indexOf('timed out') > -1) {
          appcan.window.openToast('请求超时，请稍后重试', 2000, '5', '0')
        } else {
          appcan.window.openToast('请求失败，请稍后重试', 2000, '5', '0')
        }
      }
      cb(1, error)
    }
  })
}

function getVersion(callback) {
  /*
   * uexWidgetOne.getCurrentWidgetInfo()获取当前widget信息
   * uexWidgetOne.cbGetCurrentWidgetInfo(opId,dataType,data)回调方法
   * 1. opId:(Number类型)必选操作ID，在此函数中不起作用，可忽略
   * 2. dataType:(Number类型)必选参数类型详见CONSTANT中Callback方法数据类型
   * 3. data:(Number类型)必选回当前widget相关信息，json数据格式
   */
  uexWidgetOne.cbGetCurrentWidgetInfo = function(a, b, c) {
    var json = JSON.parse(c)
    callback(json)
    // setLocalVal('versioncode',json.version);
  }
  uexWidgetOne.getCurrentWidgetInfo()
}

function getPlatf() {
  /*
   *
   * 获取当前终端的系统名称
   * uexWidgetOne.platformName;
   * toLowerCase()转化成小写字母
   *
   */
  return uexWidgetOne.platformName.toLowerCase()
}

module.exports = {
  checkVersion: checkVersion
}
