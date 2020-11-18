/* eslint-disable no-undef */
// 网络请求
function requestJson (options) {
  if (options.length < 1) {
    return
  }

  var uri = options.uri
  var cb = options.callback
  var isToast = options.isToast != false
  var reqType = options.type || 'POST'
  var postData = options.postData || {}

  var appPlatf =
    appcan.locStorage.val('os') == null ? '2' : appcan.locStorage.val('os')
  var appVersion =
    appcan.locStorage.val('version') == null
      ? '01.00.0017'
      : appcan.locStorage.val('version')

  var pOs = 'os=' + appPlatf
  var pVersion = 'version=' + appVersion
  var pOem = 'oem=' + appcan.locStorage.val('oem')
  var pSv = 'sv=' + appcan.locStorage.val('sv')
  var pConnectStatus = 'netType=' + appcan.locStorage.val('netType')
  var pModel = 'model=' + appcan.locStorage.val('model')
  var lat = ''
  // var lat = 'latitude=' + appcan.locStorage.val('appLat') + '&longitude=' + appcan.locStorage.val('appLog')
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

  console.log('url==', url)

  var token =
    appcan.locStorage.val('token') == null
      ? 'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJBUFBUZXN0IiwiaWF0IjoxNTU3MTk5Nzc0NjYzfQ.ZMqmKEYIOxJOW4EZ-0K-OcfzalXmcak_NL94oMRO1bk'
      : appcan.locStorage.val('token')

  console.log('token==', token)
  console.log('postData:' + postData.url)

  appcan.request.ajax({
    url: url,
    type: reqType,
    data: postData,
    datatype: 'json',
    timeout: 30000,
    headers: {
      token: token
    },
    success: function (data, status, requestCode, response, xhr) {
      // removeNoNetTips();
      // uexWindow.closeToast();
      /* if (requestCode !== 200) {
        /!*if (isToast) {
          alert('请求失败，请稍后重试')
        }*!/
        $("#test").html($("#test").html()+"<br>"+"200RequestMsg:"+data.msg);
        $("#test").html($("#test").html()+"<br>"+"200RequestStatue:"+data.statue);
        cb(1, data)
      } */
      console.log(data)

      // data = JSON.parse(data)
      if (data.statue === '0') {
        // uexWindow.closeToast();
        cb(0, data)
      } else if (data.statue === '9') {
        if (isToast) {
          alert('登录失效，请重新登录！')
          // appcan.window.publish("AutoLogin",1);
        }
        cb(1, data)
        // toLoginPage()
      } else if (data.statue === '8') {
        if (isToast) {
          alert(data.msg)
          // appcan.window.openToast(data.msg, 3000, '5', '0')
          // appcan.window.publish("AutoLogin",1);
        }
        // 向指定通道发送消息
        // appcan.window.publish('toLoginPage', 1)
        cb(1, data)
      } else {
        // uexWindow.closeToast()
        if (isToast) {
          /* alert('data.msg3');
          alert(data.msg)
          alert('data.msg4'); */
          // appcan.window.openToast(data.msg, 3000, '5', '0')
        }
        cb(1, data)
      }
    },
    error: function (xhr, erroType, error, msg) {
      // removeNoNetTips()
      // uexWindow.closeToast()
      if (isToast) {
        if (msg.indexOf('timed out') > -1) {
          alert('请求超时，请稍后重试')
          // appcan.window.openToast('请求超时，请稍后重试', 2000, '5', '0')
        } else {
          // alert('请求失败，请稍后重试')
          // appcan.window.openToast('请求失败，请稍后重试', 2000, '5', '0')
        }
      }
      cb(1, error)
    }
  })

  // getNetworkStatue(function(dataType) {
  //     if (dataType == '-1') {
  //         //appcan.window.openToast('无网络，请稍后重试', 1000, '5', '0');
  //         isNet = false;
  //         cb(1, '');
  //         return;
  //     }
  //     // if (!isNet) {
  //         // return;
  //     // }
  //     appcan.request.ajax({
  //         url : url,
  //         type : reqType,
  //         data : postData,
  //         datatype : "json",
  //         timeout : 30000,
  //         headers : {
  //             token : appcan.locStorage.val("token")
  //         },
  //         success : function(data, status, requestCode, response, xhr) {
  //             removeNoNetTips();
  //             uexWindow.closeToast();
  //             if (requestCode != 200) {
  //                 if (isToast) {
  //                     appcan.window.openToast('请求失败，请稍后重试', 2000, '5', '0');
  //                 }
  //                 cb(1, data);
  //                 return;
  //             }
  //             data = JSON.parse(data);
  //             if (data.statue == "0") {
  //                 uexWindow.closeToast();
  //                 cb(0, data);
  //             } else if (data.statue == '9') {
  //                 if (isToast) {
  //                     appcan.window.openToast('登录失效，请重新登录！', 1000, '5', '0');
  //                     //appcan.window.publish("AutoLogin",1);
  //                 }
  //                 cb(1, data);
  //                 toLoginPage();
  //             } else if (data.statue == '8') {
  //                 if (isToast) {
  //                     appcan.window.openToast(data.msg, 3000, '5', '0');
  //                     //appcan.window.publish("AutoLogin",1);
  //                 }
  //                 appcan.window.publish("toLoginPage",1);
  //                 cb(1, data);
  //             } else {
  //                 uexWindow.closeToast();
  //                 if (isToast) {
  //                     appcan.window.openToast(data.msg, 3000, '5', '0');
  //                 }
  //                 cb(1, data);
  //             }
  //         },
  //         error : function(xhr, erroType, error, msg) {
  //             removeNoNetTips();
  //             uexWindow.closeToast();
  //             if (isToast) {
  //                 if (msg.indexOf('timed out') > -1) {
  //                     appcan.window.openToast('请求超时，请稍后重试', 2000, '5', '0');
  //                 } else {
  //                     appcan.window.openToast('请求失败，请稍后重试', 2000, '5', '0');
  //                 }
  //             }
  //             cb(1, error);
  //         }
  //     });
  // });
}
// vpn登陆
function initVpn () {
  var VPN_IP = '222.92.132.145'
  var VPN_PORT = 443
  var AUTH_MODULE = 1
  uexSXFVpn.initVpnModel(VPN_IP, VPN_PORT, AUTH_MODULE) // ios android
}
// vpn登陆
function loginVpn () {
  var loginName = 'founderapp'
  var password = 'Founder@123'
  var param = {
    authType: 1,
    userName: loginName,
    passWord: password
  }
  uexSXFVpn.doVpnLogin(JSON.stringify(param)) // ios android
}
// vpn登出
function logoutVpn () {
  uexSXFVpn.logouts() // android ios
}

function initYSP () {
  uexYSP.initYSP()
}
function openYSP (title, url) {
  /* var param = {
    url: url,
    title: title
  }
  uexYSP.openYSP(JSON.stringify(param)) // appcan方法 */

  var oem = appcan.locStorage.val('oem')
  if (oem == 'APPLE') {
    // window.open(url);
    location.href = 'iosYSP://' + title + '~$~' + url
  } else {
    window.XWalkFunction.setXwalkUrl(url, title)
  }
}
function showNoNetTips () {
  if ($('.isNoNetExistsClass').length > 0) {
    $('.isNoNetExistsClass').remove()
  }
  var netHtml =
    '<div class="ub ub-ver ub-ac ub-pc ub-con isNoNetExistsClass" style="z-index: 999;background:rgba(0,0,0,0.5);" >' +
    '<div class="ub ub-ac ub-pc ub-ver" style="background-color: #FFFFFF;padding: 1.5em 0;width: 80%;text-align: center;border-radius: 0.5em;">' +
    '<div class="ulev2" style="margin-bottom: 1em;">暂无网络,请稍后重试</div>' +
    '<div class="btn ub uc-a3 ub-ac bc-text-head ub-pc bc-btn umar-a" onclick="location.reload(true)" style="width: 5em;"  >刷新试试</div>' +
    '</div>' +
    '</div>'
  if ($('#page_0').length > 0) {
    $('#page_0').prepend(netHtml)
  } else {
    $('body').prepend(netHtml)
  }
}
function removeNoNetTips () {
  if ($('.isNoNetExistsClass').length > 0) {
    $('.isNoNetExistsClass').remove()
  }
}
// 替换头像的路径
function changeFacePath () {
  var facePath = appcan.locStorage.val('facePath')
  // var facePathStr = 'http://58.211.245.60:9080/imgserver/oa/faceImage/'
  var facePathStr = 'http://58.211.245.60:9080/imgserver/oa/faceImage/'
  if (facePath == facePathStr) {
    facePath = ''
  }
  if (
    facePath != null &&
    facePath != undefined &&
    facePath != 'null' &&
    facePath != 'undefined' &&
    facePath != ''
  ) {
    if (facePath.indexOf('faceImage') == -1) {
      appcan.locStorage.val('facePath', facePathStr + facePath)
    }
  }
}
/**
 * 打开top搜索框，当templateCmd 有值时，有历史搜索项。
 */
function openSearch (options) {
  if (options.length < 2) {
    return
  }
  var fromPageName = options.fromPageName
  var fromPageType = options.fromPageType || '1'
  var cbFuncName = options.cbFuncName
  var templateCmd = options.templateCmd
  var templateParams = options.templateParams || ''
  var htmlPath = options.htmlPath // 页面路径（不包括页面名字）
  var isClose = options.isClose == true

  var pName = fromPageName + '_searchBar'
  appcan.locStorage.val('search_fromPageName', fromPageName)
  appcan.locStorage.val('search_fromPageType', fromPageType)
  appcan.locStorage.val('search_templateParams', templateParams)
  appcan.locStorage.val('search_templateCmd', templateCmd)
  appcan.locStorage.val('search_cbFuncName', cbFuncName)
  appcan.locStorage.val('search_isClose', isClose)

  appcan.window.open(pName, htmlPath + 'template_search_top.html', 5, 4)
}
function closeSearch (pageName) {
  var name = pageName + '_searchBar'
  appcan.window.evaluateScript(name, 'back()')
}
/**
 * 打开分类搜索页面
 * type-分类搜索类型，0为两层；1为三层。
 */

function openClassifiedSearch (type, cmd, template, params) {
  if (getPlatf() == 'android') {
    hideKeyBoard()
  }
  if (type == 0) {
    appcan.locStorage.val('search_fromPageName', fromPageName)
    appcan.locStorage.val('search_fromPageType', fromPageType)
    appcan.locStorage.val('search_templateParams', params)
    appcan.locStorage.val('search_templateCmd', cmd)
    appcan.locStorage.val('search_cbFuncName', '')
    appcan.locStorage.val('search_isClose', true)
    var html = 'template_classifiedSearch.html'
    var name = cmd
    var bodyHeight = appcan.locStorage.val('contentHeight')
    var conWidth = $('#content').offset().width
    appcan.window.openPopover({
      name: name,
      dataType: 0,
      url: html,
      top: 0,
      left: 0,
      width: conWidth,
      height: bodyHeight,
      type: 0
    })
    initClosePop(function () {
      appcan.window.closePopover(name)
    })
  } else if (type == 1) {
    appcan.locStorage.val('templateParams', params)
    appcan.locStorage.val('template_cmd', cmd)
    appcan.locStorage.val('fromPageName', thisPageName)
    appcan.locStorage.val('fromPageType', fromPageType)
    appcan.locStorage.val('thisPageName', cmd)

    appcan.locStorage.val('templateIsAppend', 1)
    appcan.window.open(cmd, template + '.html', 0, 4)
  }
}
/**
 * 当打开pop页面的时候，注册拦截返回键为关闭pop页面。
 * 当pop页面被关闭的时候，注册拦截返回键为返回上一页
 */
function initClosePop (callback) {
  uexWindow.onKeyPressed = function (keyCode) {
    if (keyCode == 0) {
      if (callback) callback()
      initClosePage()
    }
  }
  uexWindow.setReportKey(0, 1)
}
function initClosePage () {
  uexWindow.onKeyPressed = function (keyCode) {
    if (keyCode == 0) {
      appcan.window.close(-1)
    }
  }
  uexWindow.setReportKey(0, 1)
}
/**
 * 显示软键盘-暂时只支持android
 */
function showKeyBord () {
  uexWindow.showSoftKeyboard()
}
function hideKeyBoard () {
  uexWindow.hideSoftKeyboard()
}
/**
 * 获取网络状态 callback(dataType,data)
 *  dataType - 网络状态，-1没有网络，0-wifi，1-3g，2-2g
 *
 */
function getNetworkStatue (callback) {
  uexDevice.cbGetInfo = function (opCode, dataType, data) {
    var device = JSON.parse(data)
    var connectStatus = device.connectStatus
    if (connectStatus != null && connectStatus.length > 0) {
      callback(connectStatus)
      // if (connectStatus == -1) {
      // callback("-1");
      // //uexWindow.toast(0, 5,"网络错误",1000);
      // }
    }
  }
  uexDevice.getInfo('13')
}

/*
 * 清楚本地账号信息
 */
function exitAccount () {
  /*
   * 1.关闭页面
   */
  appcan.window.evaluateScript('index', 'closePage()')
  appcan.window.evaluateScript('myTask', 'closePage()')
  appcan.window.evaluateScript('contacts', 'closePage()')
  appcan.window.evaluateScript('my', 'closePage()')
  /*
   * 2.清除local信息
   */
  var keys = appcan.locStorage.keys()
  if (keys != null && keys != '') {
    for (var i = 0; i < keys.length; i++) {
      if (
        keys[i] != 'templateUpdateTime' &&
        keys[i] != 'updateTemplateIds' &&
        keys[i] != 'firstLogin'
      ) {
        appcan.locStorage.remove(keys[i])
      }
    }
  }
  /*
   * 3.跳转到登录页面
   */
  appcan.window.open({
    name: 'root',
    data: 'login.html',
    aniId: 10,
    type: 4
  })
  var params = {
    alias: ''
  }
  var paramsStr = JSON.stringify(params)
  uexJPush.setAlias(paramsStr)
}

/**
 * 将回车符做转义
 */

// function addEnter(value){
// value = value.replace('/\n/g','<br\/>');
// return value;
// }
function addEnter (str) {
  if (str != null) {
    str = str.replace(/\n/g, '<br/>')
  }
  return str
}

/**
 *
 *loading效果
 *
 */
function loading (content) {
  if (content == undefined) {
    content = '正在加载中...'
  }
  if ($('#loading').length > 0) {
    // $('#loading').removeClass('uhide');
    $('#loading .loadingContent').html(content)
    return
  }
  var shtml =
    '<div class="remodal-overlay remodal-is-opened" style="display: block;">' +
    '<div class="remodal-wrapper remodal-is-opened" style="display: block;">' +
    '<div class="remodal remodal-is-initialized remodal-is-opened" data-remodal="0">' +
    '<div class="ub ub-ac" style="text-align: left;white-space: nowrap;">' +
    '<div class="fa fa-2x fa-spinner fa-spin"></div>' +
    '<div class="loadingContent" style="margin-left: .5em;">' +
    content +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  var target = document.body
  var first = document.body.firstChild
  // 得到页面的第一个元素
  var loading = document.createElement('div')
  loading.id = 'loading'
  $(shtml).appendTo(loading)
  target.insertBefore(loading, first)
}

/**
 *关闭loading效果
 */

function closeLoading () {
  var _this = document.getElementById('loading')
  if (_this != null) {
    // $('#loading').addClass('uhide');
    // $('#loading').remove();
    _this.parentNode.removeChild(_this)
  }
}

/**
 *验证值是否为空
 * @return false-数据格式有问题。true-数据是正常的数据
 */
function IsNull (str) {
  if (
    str === '' ||
    str === undefined ||
    str === 'undefined' ||
    str === null ||
    str === 'null'
  ) {
    return false
  } else {
    return true
  }
}

/**
 *获取应用版本号
 */
function getAppVersion (callback) {
  getVersions(function (v) {
    return v
  })
}

function getVersions (callback) {
  uexWidgetOne.cbGetCurrentWidgetInfo = function (a, b, c) {
    var json = JSON.parse(c)
    callback(json.version)
    // setLocalVal('versioncode',json.version);
  }
  uexWidgetOne.getCurrentWidgetInfo()
}

/**
 *获取版本 android，ios， simulator
 */
function getPlatf () {
  return uexWidgetOne.platformName.toLowerCase()
}

/**
 * 执行js脚本
 * @param {Object} wn--窗口名称，默认为当前窗口
 * @param {Object} scr--js脚本内容
 */
function uescript (wn, scr) {
  uexWindow.evaluateScript(wn, '0', scr)
}

/**
 * 在浮动窗口中执行js脚本
 * @param {Object} wn--窗口名称，默认为当前窗口
 * @param {Object} pn--浮动窗口名称
 * @param {Object} scr--js脚本内容
 */
function ueppscript (wn, pn, scr) {
  uexWindow.evaluatePopoverScript(wn, pn, scr)
}

// /**
// * 打开窗口
// * @param {string} winName--窗口名字
// * @param {string} url--要打开文件路径
// * @param {string} type--窗口类型
// * @param {string} anim--动画ID
// */
function openwin (winName, url, type, anim) {
  if (!type) {
    type = 0
  }
  if (!anim) {
    anim = 2
  }
  // 从右向左推入
  // uexWindow.open(winName, "0", url, anim, "", "", type, "275");
  uexWindow.open(winName, '0', url, anim, '', '', type)
}

function closewin (anim) {
  var a = '-1'
  if (anim) {
    a = anim
  }
  uexWindow.close(a)
}

function resetBV (type) {
  uexWindow.resetBounceView(type)
}

/**
 * 设置页面弹动方法
 * @param {Object} downcb--下拉弹动方法
 * @param {Object} upcb--上拉弹动方法
 */
function setPageBounce (downcb, upcb) {
  var s = ['0', '0']
  var str = ''
  uexWindow.onBounceStateChange = function (type, status) {
    // logs('onBounceStateChange-->type='+type+', status='+status);
    if (downcb && type == 0 && status == 2) {
      downcb()
    }
    if (upcb && type == 1 && status == 2) {
      upcb()
    }
  }

  uexWindow.setBounce('1')

  if (downcb) {
    s[0] = '1'
    uexWindow.notifyBounceEvent('0', '1')
    str = '{"pullToReloadText":"下拉刷新..."}'
    if (!isSML) {
      uexWindow.setBounceParams('0', str)
    }
  }
  uexWindow.showBounceView('0', '#E6E6E6', s[0])

  if (upcb) {
    s[1] = '1'
    uexWindow.notifyBounceEvent('1', '1')
    str = '{"pullToReloadText":"上拉加载更多..."}'
    if (!isSML) {
      uexWindow.setBounceParams('1', str)
    }
  }
  uexWindow.showBounceView('1', '#E6E6E6', s[1])
}

function hiddenPageBounce () {
  uexWindow.showBounceView('0', '#E6E6E6', '0')
  uexWindow.showBounceView('1', '#E6E6E6', '0')
}

function showPageBounce () {
  uexWindow.showBounceView('0', '#E6E6E6', '1')
  uexWindow.showBounceView('1', '#E6E6E6', '1')
}

function setHtml (id, html) {
  if (typeof id === 'string') {
    var ele = $$(id)
    if (ele != null) {
      ele.innerHTML = html == null ? '' : html
    }
  } else if (id != null) {
    id.innerHTML = html == null ? '' : html
  }
}
