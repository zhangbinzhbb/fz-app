
/**
 *actionsheet 打开方法，放到哦你click事件中
 */
function fillActionSheetItems () {
  if (checkMaxLength() && checkRequire()) {
    var actionSheetItems = $('#actionSheetItems').html()
    var name = 'template_actionSheet'
    appcan.locStorage.val('fromPageName', thisPageName)
    appcan.locStorage.val('fromPageType', fromPageType)
    appcan.locStorage.val('thisPageName', name)
    appcan.locStorage.val('templateActionSheetItems', actionSheetItems)
    openTemplateActionSheeet(name)
  }
}

/**
 * 打开actionsheet
 */
function openTemplateActionSheeet (name) {
  var s = $('#content')
  var x = 0
  var y = parseInt(s.css('font-size')) * 2
  var html = '../template/template_actionSheet.html'
  appcan.frame.open(name, html, 0, 0)
}
/**
 * 修改RMB数字展示方式为 123,233,111这种带有都好的方式
 * fromID : 是值来源input的id
 * selectID : 是select框的id,当select框值为1（人民币）时，才会跟toID的input框联动
 * toID : 被联动的input框
 */
function changeRMB (fromID, selectID, toID) {
  if (selectID == '' || selectID == null || selectID == undefined) {
    var fromID1 = fromID + 'Num'
    var toID1 = toID + 'Num'
    var fromVal = $('#' + fromID).val()
    $('#' + fromID1).val(RestoreNumCom(fromVal))
    $('#' + fromID).val(formatNumCom(fromVal))
    if (toID != '' && toID != null && toID != undefined) {
      $('#' + toID).val(formatNumCom(fromVal))
      $('#' + toID1).val(RestoreNumCom(fromVal))
    }
    return
  }
  if ($('#' + selectID).val() == '1') {
    var fromID1 = fromID + 'Num'
    var toID1 = toID + 'Num'
    var fromVal = $('#' + fromID).val()
    $('#' + fromID1).val(RestoreNumCom(fromVal))
    $('#' + fromID).val(formatNumCom(fromVal))
    if (toID != '' && toID != null && toID != undefined) {
      $('#' + toID).val(formatNumCom(fromVal))
      $('#' + toID1).val(RestoreNumCom(fromVal))
    }
  }
}
/**
 * 格式化数字为带逗号的格式 123,222,312
 */
function formatNumCom (num) {
  var str = new String(num)
  str = RestoreNumCom(str)
  var decimalLen = 3
  var str3 = ''
  if (str.indexOf('.') > -1) {
    str3 = str.substring(str.indexOf('.'), str.length)
    str3 = str3.length > decimalLen ? str3.substring(0, decimalLen) : str3
    str = str.substring(0, str.indexOf('.'))
  }
  var len = str.length
  var str2 = ''
  var max = Math.floor(len / 3)
  for (var i = 0; i < max; i++) {
    var s = str.slice(len - 3, len)
    if (str.length == 3) {
      str2 = s + str2
    } else {
      str2 = (',' + s) + str2
    }
    str = str.substr(0, len - 3)
    len = str.length
  }
  str += str2
  return str + str3
}
/**
 * 将带有逗号的数字串格式化为 纯数字
 */
function RestoreNumCom (str) {
  str = str.replace(new RegExp(/(，)/g), ',')
  var s = str.split(',')
  var a = ''
  for (var i = 0; i < s.length; i++) {
    a += s[i]
  }
  return a
}

/**
 * 关闭actionsheet
 */
function closeTemplateActionSheeet (name) {
  appcan.frame.close(name)
}

/**
 * 传入模板字符串、数据、渲染domid来渲染页面
 * @param str 模板字符串
 * @param data 要渲染的数据
 * @param domId 被渲染的domId
 * @param isAppend 是否追加 0-是 1-不是
 */
function renderTemplate (str, data, domId, isAppend) {
  // debugger
  // uexWindow.toast(1, 5, '加载中...', '');
  if ($('#tips').length > 0) {
    $('#tips').remove()
  }
  appcan.locStorage.val('_templateData', data)
  /**
     * MoneyUnit-单位，默认是1-个位。2-十位。3-百位。4-千位。5-万位。6-十万位。7-百万位。8-千万位。9-亿位。10-十亿位。以此类推
     */
  template.helper('changeMoneyUnit', function (Money1, MoneyType, MoneyUnit) {
    if (MoneyType == null || MoneyType == undefined) {
      MoneyType = ''
    }
    // 默认是个位
    if (MoneyUnit == null || MoneyUnit == undefined || MoneyUnit < 0) {
      MoneyUnit = 1
    }
    var unit = Math.pow(10, (MoneyUnit - 1))
    var Money2 = ''
    var Money3 = Money1
    Money1 = new String(Money1)
    if (Money1.indexOf(',') > -1) {
      Money1 = Money1.split(',').join('')
    }
    if (Money1.indexOf('，') > -1) {
      Money1 = Money1.split('，').join('')
    }
    Money1 = new Number(Money1)
    // 将金额换算成单位为个位
    Money1 = unit * Money1
    Money1 = new String(Money1)
    // 取小数点前的数字
    Money1 = Money1.substring(0, (Money1.lastIndexOf('.') == -1 ? Money1.length : Money1.lastIndexOf('.')))
    Money1 = new Number(Money1)
    // 如果数值为负数，则直接返回原值+单位
    if (Money1 < 0) {
      return Money3 + '&nbsp;' + MoneyType
    }
    if ((Money1 >= 10) && (Money1 < 10000)) {
      var vv = Math.pow(10, 4)// 保留2位小数，四舍五入
      var kk = (Money1 / 10000) * vv
      Money2 = Math.round(kk) / vv + '万'
    }
    if ((Money1 >= 10000) && (Money1 < 100000000)) {
      var vv = Math.pow(10, 2)// 保留2位小数，四舍五入
      Money2 = Math.round((Money1 / 10000) * vv) / vv + '万'
    }
    if (Money1 >= 100000000) {
      var vv = Math.pow(10, 2)// 保留2位小数，四舍五入
      Money2 = Math.round((Money1 / 100000000) * vv) / vv + '亿'
    }
    return Money3 + '&nbsp;' + MoneyType + '&nbsp;<font style="color:#FF0000; display: block;">' + Money2 + '</font>'
  })

  template.config('escape', false)
  var render = template.compile(str)
  var html = render(data)

  // uexWindow.closeToast()// 关闭加载进度条

  // alert(html);

  // 此处过滤了template error
  if (html != '{Template Error}') {
    if (isAppend == 0) {
      if (data.dataContent != '') {
        // $("#"+domId).html($("#"+domId).html()+html);
        $('#' + domId).append(html)
      } else {
        appcan.window.openToast('数据已是最后一条', 2000, '5', '0')
      }
    } else if (isAppend == 2) { // 在最前面添加
      if (data.dataContent != '') {
        $('#' + domId).prepend(html)
      } else {
        appcan.window.openToast('数据已是最后一条', 2000, '5', '0')
      }
    } else {
      $('#' + domId).html(html)
    }
  }

  // 数据为空时，列表页面显示无记录提示
  if (data.dataContent == '' || data.dataContent == null) {
    try {
      if (curPage == '1') {
        var nodataHtml = '<div class="ub ub-ac ub-pc" id="tips" style="height:90%;font-family: Georgia,Times New Roman,Serif;"><div>暂无数据</div></div>'
        $('#' + domId).after(nodataHtml)
      }
    } catch (e) {}
  }

  /*
    * 页面加载完成后执行方法
    */
  try {
    readyAfter()
  } catch (e) {}
}

/**
 * 把方法绑定到template
 *  @param funcArr 要绑定的方法名的数组--这些方法名必须有方法
 */
function jxhdBindFunc (funcArr) {
  for (var i = 0; i < funcArr.length; i++) {
    template.helper(funcArr[i], eval(funcArr[i]))
  }
}

// 获取选中的图片的pic
function getSelectPicPaths () { // 1
  var picArr = []
  var node = document.getElementById('pic')
  if (node == null) {
    return picArr
  }
  var childNodes = node.children
  var nodeLength = childNodes.length
  if (nodeLength > 1) { // 有图片
    for (var i = 0; i < nodeLength - 1; i++) {
      picArr.push(childNodes[i].id)
    }
    return picArr
  } else { // 没有图片
    return picArr
  }
}

/**
 * 获取页面所有输入参数
 * @return object类型，key-参数名，value-参数值
 */
function getValue () {
  var params = {}
  var select = $('select')
  var inputRadio = $('input[type="radio"]:checked')
  var inputCheckBox = $('input[type="checkbox"]')
  var inputHidden = $('input[type="hidden"]')
  var inputText = $('input[type="text"]')
  var inputSearch = $('input[type="search"]')
  var inputNumber = $('input[type="number"]')
  var inputTel = $('input[type="tel"]')
  var textarea = $('textarea')
  for (var i = 0; i < select.length; i++) {
    var key = $(select[i]).attr('name')
    var value = $(select[i]).val()
    if (value == '' || value == '-1') {
      continue
    }
    params[key] = value
  }
  for (var i = 0; i < inputRadio.length; i++) {
    var key = $(inputRadio[i]).attr('name')
    var value = $(inputRadio[i]).val()
    params[key] = value
  }
  for (var i = 0; i < inputText.length; i++) {
    var key = $(inputText[i]).attr('name')
    var value = $(inputText[i]).val()
    params[key] = value
  }
  for (var i = 0; i < inputHidden.length; i++) {
    var key = $(inputHidden[i]).attr('name')
    var value = $(inputHidden[i]).val()
    params[key] = value
  }

  for (var i = 0; i < inputSearch.length; i++) {
    var key = $(inputSearch[i]).attr('id')
    var value = $(inputSearch[i]).val()
    if (value == '') {
      continue
    }
    params[key] = value
  }
  for (var i = 0; i < inputNumber.length; i++) {
    var key = $(inputNumber[i]).attr('name')
    var value = $(inputNumber[i]).val()
    if (value == '') {
      continue
    }
    params[key] = value
  }
  for (var i = 0; i < inputTel.length; i++) {
    var key = $(inputTel[i]).attr('name')
    var value = $(inputTel[i]).val()
    if (value == '') {
      continue
    }
    params[key] = value
  }
  for (var i = 0; i < inputCheckBox.length; i++) {
    var key = $(inputCheckBox[i]).attr('name')
    var checkedValue = $('input[name="' + key + '"]:checked')
    var value = []
    for (var j = 0; j < checkedValue.length; j++) {
      value.push($(checkedValue[j]).val())
    }
    if (value.length <= 0) {
      continue
    }
    params[key] = value.join(',')
  }
  for (var i = 0; i < textarea.length; i++) {
    var key = $(textarea[i]).attr('name')
    var value = addEnter($(textarea[i]).val())
    if (value == '') {
      continue
    }
    params[key] = value
  }
  return params
}

/**
 * 将回车符做转义
 */
function addEnter (str) {
  if (str != null) { str = str.replace(/\n/g, '<br\/>') }
  return str
}

function checkMaxLength () {
  var area = $('textarea')
  for (var i = 0; i < area.length; i++) {
    var maxlength = $(area[i]).attr('maxlength')
    if (maxlength == '' || maxlength == undefined || maxlength == null) {
      continue
    }
    if ($(area[i]).val() != '' && $(area[i]).val().length > maxlength) {
      return false
    }
  }
  return true
}

/**
 * 验证页面所有添加required属性的是否为空
 */
function checkRequire () {
  var objTel = $('input[type="tel"][required="required"]')
  var objText = $('input[type="text"][required="required"]')
  var objPassword = $('input[type="password"][required="required"]')
  var objNumber = $('input[type="number"][required="required"]')
  var objRadio = $('div[type="radio"][required="required"]')
  var objCheckBox = $('div[type="checkbox"][required="required"]')
  var objSelect = $('select[required="required"]')
  var objArea = $('textarea[required="required"]')
  for (var i = 0; i < objText.length; i++) {
    if ($(objText[i]).val() == '' || $(objText[i]).val() == null) {
      var tips = $(objText[i]).attr('tip')
      if (tips == '' || tips == null || tips == undefined || tips == 'null' || tips == 'undefined') {
        tips = $(objText[i]).attr('placeholder')
      }
      appcan.window.openToast(tips, 1000, '5', '0')
      return false
    }
  }
  for (var i = 0; i < objPassword.length; i++) {
    if ($(objPassword[i]).val() == '' || $(objPassword[i]).val() == null) {
      var tips = $(objPassword[i]).attr('tip')
      if (tips == '' || tips == null || tips == undefined || tips == 'null' || tips == 'undefined') {
        tips = $(objPassword[i]).attr('placeholder')
      }
      appcan.window.openToast(tips, 1000, '5', '0')
      return false
    }
  }
  for (var i = 0; i < objTel.length; i++) {
    if ($(objTel[i]).val() == '' || $(objTel[i]).val() == null) {
      var tips = $(objTel[i]).attr('tip')
      if (tips == '' || tips == null || tips == undefined || tips == 'null' || tips == 'undefined') {
        tips = $(objTel[i]).attr('placeholder')
      }
      appcan.window.openToast(tips, 1000, '5', '0')
      return false
    }
  }
  for (var i = 0; i < objNumber.length; i++) {
    if ($(objNumber[i]).val() == '' || $(objNumber[i]).val() == null) {
      var tips = $(objNumber[i]).attr('tip')
      if (tips == '' || tips == null || tips == undefined || tips == 'null' || tips == 'undefined') {
        tips = $(objNumber[i]).attr('placeholder')
      }
      appcan.window.openToast(tips, 1000, '5', '0')
      return false
    }
  }
  for (var j = 0; j < objRadio.length; j++) {
    var inputArr = $(objRadio[j]).find('input')
    var radioFlag = false
    for (var i = 0; i < inputArr.length; i++) {
      if ($(inputArr[i]).is(':checked')) {
        radioFlag = true
      }
    }
    if (!radioFlag) {
      appcan.window.openToast($(objRadio[j]).attr('tip'), 1000, '5', '0')
      return false
    }
  }
  for (var j = 0; j < objCheckBox.length; j++) {
    var inputArr = $(objCheckBox[j]).find('input')
    var radioFlag = false
    for (var i = 0; i < inputArr.length; i++) {
      if ($(inputArr[i]).is(':checked')) {
        radioFlag = true
      }
    }
    if (!radioFlag) {
      appcan.window.openToast($(objCheckBox[j]).attr('tip'), 1000, '5', '0')
      return false
    }
  }
  for (var i = 0; i < objSelect.length; i++) {
    if ($(objSelect[i]).val() == '' || $(objSelect[i]).val() == '-1') {
      var textTips = $(objSelect[i]).find('option')[0].text
      appcan.window.openToast(textTips, 1000, '5', '0')
      return false
    }
  }
  for (var i = 0; i < objArea.length; i++) {
    if ($(objArea[i]).val() == '' || $(objArea[i]).val() == null) {
      var tips = $(objArea[i]).attr('tip')
      if (tips == '' || tips == null || tips == undefined || tips == 'null' || tips == 'undefined') {
        tips = $(objArea[i]).attr('placeholder')
      }
      appcan.window.openToast(tips, 1000, '5', '0')
      return false
    }
  }
  return true
}

function back () {
  // appcan.window.close(-1)
  window.history.back(-1)
}

/**
 *拼接参数信息
 * @param {Object} url
 * @param {Object} cmd
 */
function dealDataUrl (url, cmd) {
  if (url.indexOf('?') == -1) {
    url = url + '?startXXX=' + Math.random()
  } else {
    if (url.indexOf('=') == -1) {
      url = url + 'startXXX=' + Math.random()
    } else {
      url = url + '&startXXX=' + Math.random()
    }
  }
  var uri = centerIP + url + '&cmd=' + cmd + appcan.locStorage.val('commonParams')
  return encodeURI(uri)
}

/**
 *拼接外部http参数信息
 * @param {Object} url
 * @param {Object} cmd
 */
function dealForigDataUrl (url, cmd) {
  if (url.indexOf('?') == -1) {
    url = url + '?startXXX=' + Math.random()
  } else {
    if (url.indexOf('=') == -1) {
      url = url + 'startXXX=' + Math.random()
    } else {
      url = url + '&startXXX=' + Math.random()
    }
  }
  var uri = url + '&cmd=' + cmd + appcan.locStorage.val('commonParams')
  return encodeURI(uri)
}

/**
 *按页面名称跳转
 */
function turnPageByName (name, path) {
  appcan.window.open({
    name: name,
    data: path,
    aniId: 10,
    type: 4
  })
}

function call (num) {
  if (num != '') {
    uexCall.dial(num)
  }
}
function sendEmail (email) {
  var subject = ''
  var content = ''
  var attachmentPath = ''

  uexEmail.open(email, subject, content, attachmentPath)
}
function addContact () {
  appcan.window.confirm({
    title: '提示',
    content: '确定导入通讯录？',
    buttons: ['确定', '取消'],
    callback: function (err, data, dataType, optId) {
      if (err) {
        // 如果出错了
        return
      }
      if (data == 1) {
        return
      }
      var contactData = JSON.parse(appcan.locStorage.val('dataContentData'))
      var option = {
        isNeedAlertDialog: false
      }
      uexContact.addItem(contactData.dataContent.NAME, contactData.dataContent.MOBILEPHONE, contactData.dataContent.EMAIL, JSON.stringify(option))
    }
  })
}
/**
 *关闭当前窗口
 */
function closeWindow () {
  // appcan.window.close()
  window.history.back(-1)
}
/* 设置返回顶部 */
function setBackWindowTop () {
  $('#backHome').on('click', function () {
    // window.scrollTo(0, 0);
    $('body,html').animate({scrollTop: 0}, 500)
  })
  $(window).scroll(function (event) {
    var winPos = $(window).scrollTop()
    if (winPos > 500) {
      $('#backHome').css('display', 'block')
    } else {
      $('#backHome').css('display', 'none')
    }
  })
}
/* IOS设置头部高度
* isDetail 区分是否是template_detail.html页面*/
function setHeader(isDetail) {
  var oem = appcan.locStorage.val('oem')
  var model = appcan.locStorage.val('model')
  //设置IOS手机头部高度
  if ("APPLE" == oem) {
    var type = model.substr(6,2);
    if (type >= 11) {
      $("#headerTop").css('height', '42px');
      $("#header").css("top", "42px");
      if ($("#content")) {
        $("#content").css("margin-top", "89px");
      }
      if ($("#listview"))  {
        if (isDetail){
          $("#listview").css("margin-top", "89px");
        } else {
          $("#listview").css("margin-top", "124px");
        }
      }
    }else {
      $("#headerTop").css('height', '15px');
      $("#header").css("top", "15px");
      if ($("#content")) {
        $("#content").css("margin-top", "62px");
      }
      if ($("#listview"))  {
        if (isDetail){
          $("#listview").css("margin-top", "62px");
        } else {
          $("#listview").css("margin-top", "96px");
        }
      }
    }

  }
}
