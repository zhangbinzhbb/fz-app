// 所有附件下载路径
var fileRootPath = 'wgt://eipFiles/'

/**
 *文件下载入口
 */
/*function doDownloadKM(fileId, fileName) {
    var remotePath = "/fileAction/downloadKI.do?fileId=" + fileId;
    remotePath = dealDataUrl(remotePath, "");
    downLoadFiles(downLoadFilesCallBack, remotePath, fileName, fileId);
} */

/**
 * 修改为文件在线打开，涉及模板较多，方法名保持不变
 * @type {number}
 */
function doDownloadKM (fileId, fileName) {
  // uat没有部署文件在线预览，用生产环境测试
  var url = dealDataUrl('/fileAction/loadKI.do?fileId=' + fileId, '')
  requestJson({
    uri: url,
    type: 'POST',
    isToast: true,
    callback: function (status, data) {
      if (status != 0) {
        return
      }
      appcan.locStorage.val('filePreviewUrl', data.dataContent.url)
      window.open('filePreview.html')
      // window.location.href ='filePreview.html';
    }
  })
}

/**
 *文件下载入口
 */
/*function doDownload(fileId, fileName,systemType) {
  /!*if(systemType==undefined || systemType==null || systemType =='undefined' || systemType == 'null'){
      var systemType = '';
  }
  var remotePath = "/fileAction/downloadFileOA.do?FILE_ID=" + fileId +"&systemType="+systemType;
  remotePath = dealDataUrl(remotePath, "");
  downLoadFiles(downLoadFilesCallBack, remotePath, fileName, fileId);*!/
} */

/**
 * 修改为文件在线打开，涉及模板较多，方法名保持不变
 * @type {number}
 */
function doDownload (fileId, fileName, systemType) {
  var url = dealDataUrl(
    '/fileAction/loadFileOA.do?fileId=' + fileId + '&systemType=' + systemType,
    ''
  )
  requestJson({
    uri: url,
    type: 'POST',
    isToast: true,
    callback: function (status, data) {
      if (status != 0) {
        return
      }
      // window.open(data.dataContent.url);
      appcan.locStorage.val('filePreviewUrl', data.dataContent.url)
      window.open('filePreview.html')
      // window.location.href ='filePreview.html';
    }
  })
}

/**
 *EHR文件下载入口
 * filedId(formKind,FormNo,fileID逗号拼接)
 *
 */
/*function doDownloadEhr(fileId, fileName) {
    var remotePath = "/fileAction/downloadFileEHR.do?FILE_ID=" + fileId;
    remotePath = dealDataUrl(remotePath, "");
    downLoadFiles(downLoadFilesCallBack, remotePath, fileName, fileId);
} */
function doDownloadEhr (fileId, fileName) {
  var url = dealDataUrl('/fileAction/loadFileEHR.do?FILE_ID=' + fileId, '')
  requestJson({
    uri: url,
    type: 'POST',
    isToast: true,
    callback: function (status, data) {
      if (status != 0) {
        return
      }
      appcan.locStorage.val('filePreviewUrl', data.dataContent.url)
      window.open('filePreview.html')
      // window.location.href ='filePreview.html';
    }
  })
}

// 单文件下载
function downLoadFiles (callback, remotePath, fileName, fileId) {
  // 下载唯一标识
  var id = Math.floor(Math.random() * (1000 + 1))
  var headers = {}
  // 保存路径
  var savePath = fileRootPath + fileName
  /*
   * 判断文件本地是否已存在
   */
  // uexFileMgr.isFileExistByPath(id, savePath);
  // uexFileMgr.cbIsFileExistByPath = function(opId, dataType, data) {
  // if (data == 0) {
  // 创建下载对象回调方法
  uexDownloaderMgr.cbCreateDownloader = function (opId, dataTpye, data) {
    if (data == 0) {
      // headers["user-Agent"] = 'MSIE';
      headers = '{"user-Agent":"MSIE"}'
      uexDownloaderMgr.setHeaders(id, headers)
      if (remotePath != null) {
        // 开始下载
        uexWindow.toast(1, 5, '正在下载文件', 0)
        uexDownloaderMgr.download(id, remotePath, savePath, 0)
      }
    }
  }
  // 监听下载状态
  uexDownloaderMgr.onStatus = function (opId, fileSize, percent, status) {
    callback(opId, fileSize, percent, status, savePath, fileId)
  }
  // 创建下载对象
  uexDownloaderMgr.createDownloader(id)

  // } else if (data == 1) {
  // //文件存在，本地打开
  // uexFileMgr.getFileRealPath(savePath);
  // uexFileMgr.cbGetFileRealPath = function(opId, dataType, data) {
  // if (dataType == 0) {
  // uexDocumentReader.openDocumentReader(data);
  // }
  // }
  // } else {
  // }
  // }
}

function downLoadFilesCallBack (
  opId,
  fileSize,
  percent,
  status,
  savePath,
  fileId
) {
  if (status == 0) {
    // 1:有进度条5：居中0：非正整数一直不关闭
    uexWindow.toast(1, 5, '正在下载文件：' + progress + '%', 0)
    // $("#" + fileId).html("下载进度:" + percent);
    // alert("文件大小:" + fileSize + "字节<br>下载进度:" + percent);
    // 下载中
  } else if (status == 1) {
    uexWindow.closeToast()
    // 下载完成
    // 文件存在，本地打开
    uexFileMgr.getFileRealPath(savePath)
    uexFileMgr.cbGetFileRealPath = function (opId, dataType, data) {
      if (dataType == 0) {
        uexDocumentReader.openDocumentReader(data)
      }
    }
  } else if (status == 2) {
    uexWindow.closeToast()
    alert('下载失败！')
  } else if (status == 3) {
    uexWindow.closeToast()
    alert('取消下载！')
  }
}
