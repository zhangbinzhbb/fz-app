function openDate(obj, isSelectTime) {
    var inputId = obj.id;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var ids = '';
    ids = $('#' + inputId).val();
    selectTime = ids;
    appcan.locStorage.val('openDatepickerInputId', inputId);
    // appcan.locStorage.val('isSelectTime', isSelectTime);
    if (ids != '') {
        year = ids.substring(0, 4);
        month = ids.substring(5, 7);
        day = ids.substring(8, 11);
    }
    //日期选择器
    uexControl.cbOpenDatePicker = function(opCode, dataType, data) {
        var inputId = appcan.locStorage.val('openDatepickerInputId');
        // var isSelectTime = appcan.locStorage.val('isSelectTime');
        if (dataType == 1) {
            var obj = eval('(' + data + ')');
            //将年月日都放到相应的input框中
            if (obj.month < 10) {
                month = '0' + obj.month;
            } else {
                month = obj.month;
            }
            if (obj.day < 10) {
                day = '0' + obj.day;
            } else {
                day = obj.day;
            }
            var att_bgTime = obj.year + '-' + month + '-' + day;
            $('#' + inputId).val(att_bgTime);
            appcan.locStorage.val('inputDate',att_bgTime);
            if (isSelectTime=="true") {
                $('#' + inputId).val('');
                openTime();
            }
        }
    }
    uexControl.openDatePicker(year, month, day);
}

function openTime() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    if (selectTime.indexOf(':') > -1) {
        hour = selectTime.substring(11, 13);
        minute = selectTime.substring(14, 16);
    }
    
    //时间选择器
    uexControl.cbOpenTimePicker = function(opCode, dataType, data) {
        var inputId = appcan.locStorage.val('openDatepickerInputId');
        if (dataType == 1) {
            var obj = eval('(' + data + ')');
            //将年月日时分都放到相应的input框中
            if (obj.hour < 10) {
                hour = '0' + obj.hour;
            } else {
                hour = obj.hour;
            }
            if (obj.minute < 10) {
                minute = '0' + obj.minute;
            } else {
                minute = obj.minute;
            }
            var att_bgTime = hour + ':' + minute;
            att_bgTime = appcan.locStorage.val('inputDate') + " " + att_bgTime;
            $('#' + inputId).val(att_bgTime);
        }
    }
    
    uexControl.openTimePicker(hour, minute);
}

