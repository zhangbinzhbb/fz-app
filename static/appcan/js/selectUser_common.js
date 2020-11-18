/**
 *人员选择控件赋值
 * Multiselect:0单选 ,1多选
 */
function userAssignment (radio) {
  var user = appcan.locStorage.val('userJson')
  var controlUserId = appcan.locStorage.val('controlUserId')
  var controlUserName = appcan.locStorage.val('controlUserName')
  var objJson = eval('(' + user + ')')
  if (radio == 1) {
    $('#per').css('display', 'none')
    $('.fa-times-circle').each(function (index) {
      $(this).parent().remove()
      $(this).remove()
    })
    for (var i = 0; i < objJson.length; i++) {
      var userHtml = "<span id='" + objJson[i].id + "' name='" + objJson[i].name + "' style='float: left; z-index: 10'>" + objJson[i].name + "<i class='fa fa-times-circle'></i></span>"
      $('#' + controlUserId).before(userHtml)
    }
    $('.fa-times-circle').each(function (index) {
      $(this).click(function () {
        $(this).parent().remove()
        $(this).remove()
        if ($('.fa-times-circle').length < 1) {
          $('#' + controlUserId).before('<input id="per" placeholder="请选择人员" readonly="readonly" />')
        }
        var userIds = []
        var userNames = []
        $('.fa-times-circle').each(function (index) {
          userIds.push($(this).parent().attr('id'))
          userNames.push($(this).parent().attr('name'))
        })
        $('#' + controlUserId).val(userIds.toString())
        $('#' + controlUserName).val(userNames.toString())
      })
      var userIds = []
      var userNames = []
      $('.fa-times-circle').each(function (index) {
        userIds.push($(this).parent().attr('id'))
        userNames.push($(this).parent().attr('name'))
      })
      $('#' + controlUserId).val(userIds.toString())
      $('#' + controlUserName).val(userNames.toString())
    })
  } else {
    for (var i = 0; i < objJson.length; i++) {
      $('#' + controlUserId).val(objJson[i].id)
      $('#' + controlUserName).val(objJson[i].name)
      $('#' + controlUserName).attr('UserLoginName', objJson[i].loginName)
    }
  }
  appcan.locStorage.val('userJson', '')
}

/**
 *打开人员选择页面
 * controlUserId:赋值用户Id控件ID
 * controlUserName:赋值用户名称控件ID
 * openPageName:当前页面名称
 * popName:当前页面content页面名称
 * radio:0打开单选页面 1打开多选页面
 */
function openSelectUser (controlUserId, controlUserName, openPageName, popName, radio) {
  appcan.locStorage.val('controlUserId', controlUserId)
  appcan.locStorage.val('controlUserName', controlUserName)
  appcan.locStorage.val('openPageName', openPageName)
  appcan.locStorage.val('popName', popName)
  var cmd = ''
  if (radio == 1) {
    appcan.locStorage.val('usersArr', '')
    appcan.locStorage.val('usersStr', '')
    cmd = 'ContactListSelect'
    appcan.locStorage.val('template_cmd', cmd)
    appcan.locStorage.val('thisPageName', cmd)
    // appcan.window.open(cmd, 'template_list.  html', 10, 4);
    appcan.locStorage.val('usersArr', '')
    window.open('template_list.html')
    // window.location.href="template_list.html?backurl="+window.location.href;
  } else {
    cmd = 'contactSelectOneList'
    appcan.locStorage.val('template_cmd', cmd)
    appcan.locStorage.val('thisPageName', cmd)
    appcan.window.open(cmd, 'template_list.html', 10, 0)
  }
}

/**
 *清除已选择的人员
 * @param {Object} controlUserId userId控件id
 * @param {Object} controlUserName userName控件id
 */
function clearMultiselectUser (controlUserId, controlUserName) {
  $('#' + controlUserId).val('')
  $('#' + controlUserName).val('')
}

/**
 * 移除指定人员
 */
function removeUser (obj, controlUserId, controlUserName) {
  $(obj).parent().remove()
  $(obj).remove()
  if ($('.fa-times-circle').length < 1) {
    $('#' + controlUserId).before('<input id="per" placeholder="请选择人员" readonly="readonly" />')
  }
  var userIds = []
  var userNames = []
  $('.fa-times-circle').each(function (index) {
    userIds.push($(this).parent().attr('id'))
    userNames.push($(this).parent().attr('name'))
  })
  $('#' + controlUserId).val(userIds.toString())
  $('#' + controlUserName).val(userNames.toString())
}


/**
 * 移除指定人员
 */
function removeUser(obj, controlUserId, controlUserName) {
  $(obj).parent().remove();
  $(obj).remove();
  if ($('.fa-times-circle').length < 1) {
    $("#" + controlUserId).before('<input id="per" placeholder="请选择人员" readonly="readonly" />');
  }
  var userIds = [];
  var userNames = [];
  $('.fa-times-circle').each(function(index) {
    userIds.push($(this).parent().attr('id'));
    userNames.push($(this).parent().attr('name'));
  });
  $("#" + controlUserId).val(userIds.toString());
  $("#" + controlUserName).val(userNames.toString());

}


/**
 * 移除指定人员
 */
function removeUser(obj, controlUserId, controlUserName) {
  $(obj).parent().remove();
  $(obj).remove();
  if ($('.fa-times-circle').length < 1) {
    $("#" + controlUserId).before('<input id="per" placeholder="请选择人员" readonly="readonly" />');
  }
  var userIds = [];
  var userNames = [];
  $('.fa-times-circle').each(function(index) {
    userIds.push($(this).parent().attr('id'));
    userNames.push($(this).parent().attr('name'));
  });
  $("#" + controlUserId).val(userIds.toString());
  $("#" + controlUserName).val(userNames.toString());

}
