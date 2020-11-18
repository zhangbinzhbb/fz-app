var pushDBName = 'jxhdTemplateDB'
// 数据库名称
var DBID = 2
// 数据库唯一标识符
// 操作返回参数值
var ERR = 2
// 输入的数据不正确
var NO_DATA = 1
// 数据库没有查到数据

/**
 * 初始化操作
 */
function initDB () {
  uexDataBaseMgr.openDataBase(pushDBName, DBID)
  uexDataBaseMgr.cbOpenDataBase = function (opid, type, data) {
    if (type == 2 && data == 0) {
      // 打开成功
      uexDataBaseMgr.cbExecuteSql = function () {
        if (data == 0) {
          // alert("succ!");
          closeDB()
        } else {
          // alert("err!");
          closeDB()
        }
      }
      uexDataBaseMgr.executeSql(
        pushDBName,
        DBID,
        'CREATE TABLE IF NOT EXISTS FM_T_TEMPLATE (PK_TEMPLATE INTEGER PRIMARY KEY,cmd TEXT UNIQUE,url TEXT,template_Header TEXT,template_Content TEXT,template_Footer TEXT)'
      )
      // uexDataBaseMgr.executeSql(pushDBName, DBID, 'CREATE TABLE IF NOT EXISTS jxhdAPITable (apiId TEXT PRIMARY KEY,templateId TEXT,url TEXT)');
    }
  }
}

/**
 * 根据cmd来获取数据
 * @return  2-输入数据不正确，1-没有数据，data-查找到的数据，jsonArray  除了cmd项外都做了base64编码，请使用的时候先解码。
 */
function getDataByCmd (cmd, callback) {
  var updateTemplateIds = JSON.parse(appcan.locStorage.val('updateTemplateIds'))
  if (cmd === '' || cmd === null || cmd === undefined) {
    appcan.window.openToast('cmd值为空，请确认', 2000, '5', '0')
    callback(ERR)
  }

  getTemplateServer(cmd, function (d) {
    callback(d)
  })
}
function getTemplateFromServer (cmd, callback) {
  var serverUrl = centerIP + '/loginAction/loadTemplateSingle.do'
  // console.log(cmd)
  // var uri = serverUrl + '?cmd=' + cmd + appcan.locStorage.val('commonParams')
  var uri = serverUrl + '?cmd=' + cmd
  var url = encodeURI(uri)

  var json = {}
  var isNet = true

  // getNetworkStatue(function (dataType) {
  //   if (dataType == '-1') {
  //     // appcan.window.openToast('无网络，请稍后重试', 1000, '5', '0');
  //     isNet = false
  //     // 网络提示
  //     showNoNetTips()
  //     return
  //   }
  //   // if (!isNet) {
  //   // showNoNetTips();
  //   // return;
  //   // }
  //   requestJson({
  //     uri: url,
  //     type: 'POST',
  //     postData: json,
  //     callback: function (status, data) {
  //       removeNoNetTips()
  //       if (status !== 0) {
  //         return
  //       }
  //       var templateBean = data.template

  //       templateBean.template_Header = data.template.templateHeader
  //       templateBean.template_Content = data.template.templateContent
  //       templateBean.template_Footer = data.template.templateFooter

  //       templateBean.templateHeader = null
  //       templateBean.templateContent = null
  //       templateBean.templateFooter = null

  //       callback(templateBean)
  //       templateUpdate(data)
  //     }
  //   })
  // })

  requestJson({
    uri: url,
    type: 'POST',
    postData: json,
    callback: function (status, data) {
      // alert('== request ==')
      if (status !== 0) {
        return
      }
      var templateBean = data.template

      templateBean.template_Header = data.template.templateHeader
      templateBean.template_Content = data.template.templateContent
      templateBean.template_Footer = data.template.templateFooter

      templateBean.templateHeader = null
      templateBean.templateContent = null
      templateBean.templateFooter = null

      callback(templateBean)
      templateUpdate(data)
    }
  })

  // if (!isNet) {
  // showNoNetTips();
  // return;
  // }
  // requestJson({
  // uri:url,
  // type:'POST',
  // postData:json,
  // callback:function(status,data){
  // removeNoNetTips();
  // if(status!=0){
  // return;
  // }
  // var templateBean = data.template;
  //
  // templateBean.template_Header = data.template.templateHeader;
  // templateBean.template_Content = data.template.templateContent;
  // templateBean.template_Footer = data.template.templateFooter;
  //
  // templateBean.templateHeader = null;
  // templateBean.templateContent = null;
  // templateBean.templateFooter = null;
  //
  // callback(templateBean);
  // templateUpdate(data);
  // }
  // });
  // alert(url)
  // appcan.request.ajax({
  // url : url,
  // type : "POST",
  // data : json,
  // datatype : "json",
  // timeout : 30000,
  // success : function(data, status, requestCode, response, xhr) {
  // removeNoNetTips();
  // if (requestCode != 200) {
  // appcan.window.openToast('获取模板失败，请稍后重试', 2000, '5', '0');
  // }
  // // alert('getTemplateFromServer===='+data)
  // data = JSON.parse(data);
  // var templateBean = data.template;
  //
  // templateBean.template_Header = data.templateHeader;
  // templateBean.template_Content = data.templateContent;
  // templateBean.template_Footer = data.templateFooter;
  //
  // templateBean.templateHeader = null;
  // templateBean.templateContent = null;
  // templateBean.templateFooter = null;
  //
  // // alert(JSON.stringify(templateBean))
  //
  // callback(templateBean);
  // templateUpdate(data);
  // },
  // error : function(xhr, erroType, error, msg) {
  // removeNoNetTips();
  // if (msg.indexOf('timed out') > -1) {
  // appcan.window.openToast('获取模板超时，请稍后重试', 2000, '5', '0');
  // } else {
  // appcan.window.openToast('获取模板失败，请稍后重试', 2000, '5', '0');
  // }
  // return;
  // }
  // });
}
function getTemplateServer (cmd, callback) {
  // var centerIP = 'http://58.211.245.60:9080/eipserver'
  var centerIP = 'http://58.211.245.60:9080/eipserver'
  // var centerIP = 'http://172.29.201.164:8086/eipserver'
  var serverUrl = centerIP + '/loginAction/loadTemplateSingle.do'
  // console.log(cmd)
  // var uri = serverUrl + '?cmd=' + cmd + appcan.locStorage.val('commonParams')
  var uri = serverUrl + '?cmd=' + cmd
  var url = encodeURI(uri)
  console.log(url)
  var json = {}
  var isNet = true
  console.log('DB==URL', url)
  requestJson({
    uri: url,
    type: 'POST',
    postData: json,
    callback: function (status, data) {
      // alert('==request==')
      if (status !== 0) {
        return
      }
      console.log(data)
      var templateBean = data.template

      templateBean.template_Header = data.template.templateHeader
      templateBean.template_Content = data.template.templateContent
      templateBean.template_Footer = data.template.templateFooter

      templateBean.templateHeader = null
      templateBean.templateContent = null
      templateBean.templateFooter = null

      callback(templateBean)
    }
  })
}
function inArray (a, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (a == arr[i]) {
      return true
    }
  }
  return false
}
function removeInArray (a, arr) {
  var index = indexOf(a, arr)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}
function indexOf (val, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) return i
  }
  return -1
}
function decode (data) {
  data = JSON.parse(data)
  data = data[0]
  for (var key in data) {
    if (key != 'PK_TEMPLATE' && key != 'cmd') {
      data[key] = decode64(data[key])
    }
  }
  return data
}
function templateUpdate (updateData) {
  // alert('templateUpdate')
  if (typeof updateData === 'string') {
    updateData = JSON.parse(updateData)
  }
  var str = updateData.template.pkTemplate
  var deleteTemplateTable = (updateTemplateTable =
    "DELETE FROM FM_T_TEMPLATE WHERE PK_TEMPLATE='" + str + "'")
  // alert('deleteTemplateTable=='+deleteTemplateTable)

  uexDataBaseMgr.openDataBase(pushDBName, DBID)
  uexDataBaseMgr.cbOpenDataBase = function (opid, type, data) {
    if (type == 2 && data == 0) {
      // 打开成功a
      uexDataBaseMgr.cbExecuteSql = function (opid, type, data) {
        // alert('templateUpdate='+data)
        closeDB()
        if (data == 0) {
          templateInsert(updateData.template)
        }
      }
      uexDataBaseMgr.executeSql(pushDBName, DBID, deleteTemplateTable)
    }
  }

  // appcan.database.exec({
  // name:pushDBName,
  // sql:deleteTemplateTable,
  // callback:function(err,data,dataType,optId){
  // if(err){
  // //如果创建过程中出错了
  // return;
  // }
  // //data中的值为sql返回的内容
  // alert('templateUpdate='+data)
  // if(data == 0){
  // templateInsert(updateData.template);
  // }
  // }
  // });
}
function templateInsert (data) {
  if (typeof data === 'string') {
    data = JSON.parse(data)
  }
  var pkTemplate = data.pkTemplate
  var insertDataToTemplateTable =
    'INSERT INTO FM_T_TEMPLATE (PK_TEMPLATE,cmd,url,template_Header,template_Content,template_Footer)'
  insertDataToTemplateTable +=
    ' SELECT "' +
    data.pkTemplate +
    '","' +
    data.cmd +
    '","' +
    encode64(data.url) +
    '","' +
    encode64(data.templateHeader) +
    '","' +
    encode64(data.templateContent) +
    '","' +
    encode64(data.templateFooter) +
    '"'
  // alert(insertDataToTemplateTable)

  appcan.database.exec({
    name: pushDBName,
    sql: insertDataToTemplateTable,
    callback: function (err, data, dataType, optId) {
      if (err) {
        // 如果创建过程中出错了
        return
      }
      // data中的值为sql返回的内容
      // alert('templateInsert='+data)
      if (data == 0) {
        var updateTemplateIds = JSON.parse(
          appcan.locStorage.val('updateTemplateIds')
        )
        // alert(updateTemplateIds)
        // alert('pkTemplate='+pkTemplate);
        var newArr = removeInArray(pkTemplate, updateTemplateIds)
        // alert(newArr);
        appcan.locStorage.val('updateTemplateIds', newArr)
      }
    }
  })
}
/**
 * 清除本地的所有的模板数据
 */
function deleteAllTemp () {
  var deleteAllTemp = (updateTemplateTable = 'DELETE FROM FM_T_TEMPLATE')
  uexDataBaseMgr.openDataBase(pushDBName, DBID)
  uexDataBaseMgr.cbOpenDataBase = function (opid, type, data) {
    if (type == 2 && data == 0) {
      // 打开成功a
      uexDataBaseMgr.cbExecuteSql = function (opid, type, data) {
        // alert(data+'-delete')
        if (data == 0) {
          // 重新插入需要更新的数据
          uexDataBaseMgr.cbSelectSql = function (opid, type, data) {
            // alert('123cbSelectSql=' + data)
            closeDB()
          }
          uexDataBaseMgr.selectSql(
            pushDBName,
            DBID,
            'select * from FM_T_TEMPLATE'
          )
        }
      }
      uexDataBaseMgr.executeSql(pushDBName, DBID, deleteAllTemp)
    }
  }
}

function closeDB () {
  uexDataBaseMgr.closeDataBase(pushDBName, DBID)
  uexDataBaseMgr.cbCloseDataBase = function (opid, type, data) {
    if (data == 0) {
      // alert("数据库关闭成功！");
    } else {
      // alert("数据库关闭失败！");
    }
  }
}
