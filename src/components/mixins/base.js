import baseConfig from '../../utils/constant'
export default {
  data() {
    return {
      // 版本号修改
      version: '2',
      isLoadAll: false,
      baseConfig: baseConfig,
      isAndroid:
        /android/i.test(navigator.userAgent) ||
        (baseConfig.ENV === 'PROD' &&
          (appcan.locStorage.val('sv') != null &&
            appcan.locStorage.val('sv').indexOf(12) === 0)),
      isIos12: false,
      isAndroid12: false,
      isIos: false,
      chartsColors: ['#F76D55', '#FD9553', '#FFC958', '#E8E243', '#BED951',
        '#64E3AC', '#67C6DD', '#64ABF4', '#8D6DE1', '#BA73CF', '#E18EB9'], // 蓝黄红
      PROJECTSTATUS:
        'blank,blank,储备项目,立项中,已立项,已决策,已签订,已删除,已废弃,已中止,blank,已出资,已决议退出,已部分退出,已退出,决策中', // 子基金
      FUNDSTATUS:
        'blank,未注册,申请中,已立项,投资期,回收期,延展期,已关闭,已删除,已废弃',
      CURRENCY: 'blank,人民币,美元,欧元,港币,日元',
      FILEGLOBAL: {
        default: 'ATTA_',
        setting: [
          {
            name: 'FILE_NAME',
            nameOld: 'fileName'
          },
          {
            name: 'FILE_OLD_NAME',
            nameOld: 'fileOldName'
          },
          {
            name: 'FILE_PATH',
            nameOld: 'filePath'
          },
          {
            name: 'FILE_SIZE',
            nameOld: 'fileSize'
          },
          {
            name: 'FILE_TYPE',
            nameOld: 'fileType'
          },
          {
            name: 'SERIAL_NO',
            nameOld: 'serialNo'
          }
        ]
      },
      globalLoading: false
    }
  },
  components: {
    headerx: () => import('@/components/headerx'),
    blank: () => import('@/components/blank'),
    bottom: () => import('@/components/blank/bottom'),
    'loading-box': () => import('@/components/loadingBox'),
    vueTreeSelect: () => import('@/components/vueTreeSelect/index')
  },
  computed: {
    isToggleAll(status, content) {
      return (status, content) => {
        if (content && content.length > 50) {
          content = content.substring(0, 48) + '...'
        }
        return content
      }
    },
    // fileTypeImg可以删除
    fileTypeImg(fileObj) {
      return (fileObj) => {
        let src = ''
        fileObj.fileName = fileObj.FILE_NAME || fileObj.fileName
        if (fileObj) {
          src = '@/assets/images/file/comment-' + fileObj.fileName.split('.')[fileObj.fileName.split('.').length - 1].slice(0, 3) + '.png'
        }
        return src
      }
    }
  },
  created() {
    // this.downLoadFiles()
    this.setHeightTitle()
  },
  methods: {
    // 设置IOS手机头部高度
    setHeightTitle() {
      const oem = appcan.locStorage.val('oem')
      const model = appcan.locStorage.val('model')
      const os = appcan.locStorage.val('os')
      // os
      // value：1-android  2-ios

      if (os === '1') {
        this.isAndroid12 = true
        return
      }
      // if (os === '2') {
      //   this.isIos = true
      //   return
      // }
      if (oem === 'APPLE') {
        const type = model.substr(6, 2)
        if (type >= 11) {
          this.isIos12 = true
          return
        } else {
          this.isIos = true
          return
        }
        // this.isIos12 = false
      }
    },
    clearReffer() {
      // this.baseConfig.ENV === 'PROD' ? appcan.locStorage.val('refferPageName', ''):this.storage.remove('refferPageName')
    },
    emoji2Str(str) {
      if (unescape(escape(str).replace(/\%uD.{3}/g, '')) === 'undefined') {
        return
      }
      return unescape(escape(str).replace(/\%uD.{3}/g, ''))
    },
    getProjectStatus(val, type) {
      type = type || 'PROJECTSTATUS'
      const arr = this[type].split(',')
      let string
      arr.map((item, index) => {
        if (Number(val) === index) {
          string = item
        }
      })
      return string
    },
    // 格式化日期
    formatDateTime(time, format) {
      if (typeof time === 'string') {
        return time
      }
      var t = new Date(time)
      var tf = function(i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
            break
          case 'MM':
            return tf(t.getMonth() + 1)
            break
          case 'mm':
            return tf(t.getMinutes())
            break
          case 'dd':
            return tf(t.getDate())
            break
          case 'HH':
            return tf(t.getHours())
            break
          case 'ss':
            return tf(t.getSeconds())
            break
        }
      })
    },
    // 获取每月天数
    mGetDate(year, month) {
      var d = new Date(year, month, 0)
      return d.getDate()
    },
    // 人员选择控件回显设置
    personFnSet(optionIdName) {
      if (this.detail[optionIdName]) {
        this.basicForm.map((item, key) => {
          if (item.type === 'person') {
            const idArr = this.detail[item.nameId].split(',')
            const nameArr = this.detail[item.name].split(',')
            item.options = []
            idArr.map((option, key) => {
              const obj = {}
              obj[item.optionIdName] = option
              obj[item.optionLabelName] = nameArr[key]
              item.options.push(obj)
            })
          }
        })
      }
    },
    // vant设置日期选择样式
    vantFormatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
      return value
    },
    // 关注取消关注通用方法
    focusUpdate(isFocus, callback) {
      const postUrl = isFocus
        ? '/agendaAction/addAttention.do'
        : '/agendaAction/removeAttention.do'
      const paramsName = isFocus ? 'addAttArray' : 'removeAttArray'
      const params = {}
      params[paramsName] = this.checkedArray.join(',')
      this.$axios.post(postUrl, params, res => {
        this.globalLoading = true
        setTimeout(() => {
          this.globalLoading = false
        }, 1000)
        if (callback) {
          callback()
        }
      })
    },
    // 附件上传字段设置
    fileFnSetting(settingName, subName) {
      subName = subName || this.FILEGLOBAL.default
      settingName = settingName || 'settingFile'
      this[settingName] = []
      this.FILEGLOBAL.setting.map(item => {
        this[settingName].push({
          name: subName + item.name,
          nameOld: item.nameOld
        })
      })
    },
    // 附件上传赋值设置
    fileFnSetParams(settingName, dataName, params) {
      settingName = settingName || 'settingFile'
      dataName = dataName || 'uploadFiles'
      console.log('settingName', settingName, this[settingName])
      this[settingName].map(set => {
        params[set.name] = ''
      })
      params[dataName].map(file => {
        this[settingName].map(set => {
          const name = set.name
          const nameOld = set.nameOld
          params[name] += file[nameOld] + ','
        })
      })
    },
    // 附件上传回显设置
    fileFnSetFiles(detailListName, settingName, uploadFileName) {
      settingName = settingName || 'settingFile'
      uploadFileName = uploadFileName || 'uploadFiles'
      const ATTACHMENT_LIST = []
      this.detail[detailListName].map(file => {
        const obj = {}
        this[settingName].map((set, idx) => {
          obj[set.nameOld] = file[this.FILEGLOBAL.setting[idx].name]
        })
        ATTACHMENT_LIST.push(obj)
      })
      this.$set(this.detail, uploadFileName, ATTACHMENT_LIST)
    },
    // 单文件下载
    async downLoadFiles(callback, remotePath, fileName, fileId, postUrl) {
      // postUrl = postUrl || 'downloadFileOA' // downloadFileEHR
      postUrl = postUrl || 'loadFileOA' // downloadFileEHR
      remotePath = `${
        this.baseConfig.downloadUrl
      }/fileAction/${postUrl}.do?fileId=${fileId}`
      console.log(remotePath)

      const page = this.$route.name
      console.log(page)
      if (page === 'knowledgeDetail') {
        const url = `${
          this.baseConfig.downloadUrl
        }/fileAction/loadKI.do?fileId=${fileId}`
        this.$axios.post(url, null, res => {
          console.log(res)
          const myUrl = res.dataContent.url
          this.$router.push({ path: '/attachDetail', query: { src: myUrl }})
        })
      }

      if (
        page.indexOf('fund') > -1 ||
        page.indexOf('Foud') > -1 ||
        page.indexOf('project') > -1 ||
        page.indexOf('subFouds') > -1 ||
        page.indexOf('platform') > -1 ||
        page.indexOf('presentation') > -1
      ) {
        const url = `${
          this.baseConfig.downloadUrl
        }/fileAction/loadEI.do?fileId=${fileId}`
        this.$axios.post(url, null, res => {
          console.log(res)
          const myUrl = res.dataContent.url
          this.$router.push({ path: '/attachDetail', query: { src: myUrl }})
        })
      }
      if (
        page === 'jobsNew' ||
        page === 'workFlowNew' ||
        page === 'resumeNew'
      ) {
        const url = `${
          this.baseConfig.downloadUrl
        }/fileAction/loadBase.do?fileId=${fileId}`
        this.$axios.post(url, null, res => {
          console.log(res)
          const myUrl = res.dataContent.url
          this.$router.push({ path: '/attachDetail', query: { src: myUrl }})
        })
      }

      // 实现预览功能---------------------------------------------------------------
      const url = `${
        this.baseConfig.downloadUrl
      }/fileAction/${postUrl}.do?fileId=${fileId}`
      this.$axios.post(url, null, res => {
        console.log(res)
        const myUrl = res.dataContent.url
        this.$router.push({ path: '/attachDetail', query: { src: myUrl }})
      })

      // console.error('filePath', remotePath, fileName)
      const fileRootPath = 'wgt://eipFiles/'
      const downLoadFilesCallBack = (
        opId,
        fileSize,
        percent,
        status,
        savePath,
        fileId
      ) => {
        if (status === 0) {
          // 1:有进度条5：居中0：非正整数一直不关闭
          uexWindow.toast(1, 5, '正在下载文件：' + progress + '%', 0)
          // $("#" + fileId).html("下载进度:" + percent);
          // alert("文件大小:" + fileSize + "字节<br>下载进度:" + percent);
          // 下载中
        } else if (status === 1) {
          uexWindow.closeToast()
          // 下载完成
          // 文件存在，本地打开
          uexFileMgr.getFileRealPath(savePath)
          uexFileMgr.cbGetFileRealPath = function(opId, dataType, data) {
            if (dataType === 0) {
              uexDocumentReader.openDocumentReader(data)
            }
          }
        } else if (status === 2) {
          uexWindow.closeToast()
          alert('下载失败！')
        } else if (status === 3) {
          uexWindow.closeToast()
          alert('取消下载！')
        }
      }
      // 下载唯一标识
      const id = Math.floor(Math.random() * (1000 + 1))
      let headers = {}
      // 保存路径
      const savePath = fileRootPath + fileName
      // 创建下载对象回调方法
      uexDownloaderMgr.cbCreateDownloader = function(opId, dataTpye, data) {
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
      uexDownloaderMgr.onStatus = function(opId, fileSize, percent, status) {
        downLoadFilesCallBack(opId, fileSize, percent, status, savePath, fileId)
      }
      // 创建下载对象
      uexDownloaderMgr.createDownloader(id)
    },
    // 现金流(基金 项目)
    getLedgerMagAppList(entId, projectObject, inveId) {
      this.$axios.get(
        '/ledgerMagAppList',
        {
          pageSize: 100,
          currPage: '1',
          entId: entId || '',
          companyNumber: projectObject || '',
          inveId: inveId || ''
        },
        res => {
          const topChart = {
            columns: ['日期', '出资', '收款'],
            rows: []
          }
          const btmChart = JSON.parse(JSON.stringify(topChart))
          const caculate = (rows, item) => {
            const rowLastIdx = rows.length - 1
            if (
              rows.length === 0 ||
              item.bizDate !== rows[rowLastIdx]['日期']
            ) {
              rows.push({
                日期: item.bizDate,
                出资: item.financeType === '付款' ? 0 - item.actuallocamt : 0,
                收款: item.financeType === '出资' ? item.actuallocamt : 0
              })
            } else {
              const financeType = item.financeType
              const actuallocamt =
                financeType === '出资'
                  ? 0 - item.actuallocamt
                  : item.actuallocamt
              rows[rowLastIdx][financeType] += actuallocamt
            }
          }
          // for (let i = res.data.length - 1; i >= 0; i--) {
          //   if (res.data[i].customerNum == 0) {
          //     caculate(topChart.rows, res.data[i])
          //   } else {
          //     caculate(btmChart.rows, res.data[i])
          //   }
          // }
          res.data.map((item, index) => {
            if (item.customerNum == 0) {
              caculate(topChart.rows, item)
            } else {
              caculate(btmChart.rows, item)
            }
          })
          const toUnit = chart => {
            let totalPlus = 0,
              totalMinus = 0
            chart.rows.map(row => {
              const arr = ['出资', '收款']
              arr.map(type => {
                row[type] = Math.round(row[type] / 10000)
                if (type === '出资') {
                  totalMinus -= row[type]
                } else {
                  totalPlus += row[type]
                }
              })
            })
            this.barSetting.legendName['出资'] = `出资${totalMinus}万元`
            this.barSetting.legendName['收款'] = `收款${totalPlus}万元`
          }
          toUnit(topChart)
          toUnit(btmChart)
          const compare = property => {
            return function(obj1, obj2) {
              var value1 = new Date(obj1[property])
              var value2 = new Date(obj2[property])
              return value1 - value2 // 升序
            }
          }
          topChart.rows = topChart.rows.sort(compare('日期'))
          btmChart.rows = btmChart.rows.sort(compare('日期'))
          this.$set(this.detail, 'ledgerMagAppList', [topChart, btmChart])
        }
      )
    },
    formatTime(time) {
      if (typeof time === 'string') {
        time = time.replace(
          /-/g,
          '/'
        ) /* new Date()时IE只能识别2018/01/12，不能识别2018-01-12 */
      }
      const d = new Date(time)
      const now = Date.now()

      const diff = (now - d) / 1000

      if (diff < 10) {
        return '几秒前'
      } else if (diff < 3600) {
        return Math.ceil(diff / 60) + '分钟前'
      } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
      } else if (diff < 3600 * 24 * 2) {
        return '1天前'
      }
      return time
    },
    getNowTime() {
      var date = new Date()
      this.year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      this.month = month < 10 ? '0' + month : month
      this.date = day < 10 ? '0' + day : day
      this.hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      this.minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      // this.second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      var currentTime = this.year + '-' + this.month + '-' + this.date + ' ' + this.hour + ':' + this.minute
      return currentTime
    }
  }
}
