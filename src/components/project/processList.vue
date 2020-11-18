<template>
  <div
    v-infinite-scroll="loadMore"
    class="tool-tip process-contanier"
    infinite-scroll-disabled="pageInfo.isLoading"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false"
    style="height:100%;"
  >

    <div
      v-for="(item,index) in pageInfo.list"
      :key="index"
      class="tool-list"
    >
      <div class="im-info-list">
        <div class="tool-info-l">
          <div class="avator-logo" @click.stop="avaClick(item)">
            <avator :data="item" :params="avatorParams"/>
          </div>
          <div class="tool-info-l-name" @click="goDetail(item)">
            <p>{{ item.createName }}</p>
            <p>{{ formatTime(item.progressDate) }}</p>
          </div>
        </div>
        <div class="tool-info-r">
          <img
            v-if="item.isEditDelete=='0'"
            class="del-icon"
            src="@/assets/images/shanchu@2x.png"
            alt=""
            @click.stop="iconDelet(item.progressId,'评论')"
          >
          <span v-if="item.isEditDelete=='0'" class="br"/>
          <div class="comment-count" @click="toReply(item)">
            <img class="pj-icon" src="@/assets/images/pj@2x.png" alt="">
            <span class="count">{{ item.commentCount }}</span>
          </div>
        </div>
      </div>
      <div class="clear"/>
      <div class="tool-con">
        <p class="tool-con-p1">添加了项目{{ item.projectObjectName }}的项目进展</p>
        <div class="tool-con-lv2">
          <p class="tool-con-p2" v-html="item.progressHtml"/>
        </div>
      </div>
    </div>
    <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
    <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0"/>
    <loading-box v-model="showLoading"/>
  </div>
</template>

<script>
export default {
  name: 'Process',
  components: {
    avator: () => import('@/components/avator/index')
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      avatorParams: {
        avatorAttr: 'filePath', // 用户头像地址属性名
        needUrl: false, // 用户头像地址是否需要加前缀
        nameAttr: 'createName', // 用户名称属性名
        colorAttr: 'COLOR' // 用户头像颜色属性名
      },
      pageInfo: {
        params: {
          pageSize: 10,
          currPage: 1,
          projectObject: '',
          inveId: '',
          groupId: ''
        },
        isLoading: false,
        list: [],
        postType: 'postJson',
        postUrl: '/projectProgress/appList'
      },
      showLoading: true,
      model: null,
      isLoadingAll: false
    }
  },
  created() {
    // 查找首页是否有数据缓存，有则设置 start

    this.model = this.storage.get('businessObj') || {}
    const projObject = this.model.projObject
    const inveId = this.model.inveId
    const groupId = this.model.groupId

    this.pageInfo.params.projectObject = projObject
    this.pageInfo.params.inveId = inveId
    this.pageInfo.params.groupId = groupId

    this.getList(true)
  },
  activated() {
    if (this.storage.get('refresh-progress-list')) {
      this.storage.remove('refresh-progress-list')
      this.getList(true)
      this.$emit('countRefresh', true)
    }
  },
  destroyed() {
    // 组件销毁前设置页面数据缓存
    this.storage.set('process-cache-data', {
      avatorParams: this.avatorParams,
      pageInfo: this.pageInfo
    })
  },
  mounted() {},
  methods: {
    updataList() {
      this.$nextTick(() => {
        const _self = this
        setTimeout(() => {
          $('.viewprojectObjectInfo').on('click', function() {
            const firstId = $(this)[0].dataset.id
            _self.getViewprojectObjectInfo(firstId)
          })

          $('.viewFundInfo').on('click', function() {
            const firstId = $(this)[0].dataset.id
            _self.getViewFundInfo(firstId)
          })

          $('.viewProjectInfo').on('click', function() {
            const firstId = $(this)[0].dataset.id
            _self.getViewProjectInfo(firstId)
          })

          $('.viewWorkflow').on('click', function() {
            const bizkey = $(this)[0].dataset.bizkey
            const processinstid = $(this)[0].dataset.processinstid
            const cmd = $(this)[0].dataset.cmd
            const contractType = $(this)[0].dataset.contracttype
            const projectId = $(this)[0].dataset.projectid
            const groupId = $(this)[0].dataset.groupid
            _self.turnToDetail(cmd, processinstid, bizkey, contractType, projectId, groupId)
          })
        }, 2000)
      })
    },
    toReply(item) {
      const progressId = item.progressId
      const status = item.status
      this.$router.push({
        path: '/projectReply',
        query: { progressId, status }
      })
    },
    turnToDetail(cmd, processInstId, bizkey, contractType, projectId, groupId) {
      const turnToDetail = (cmd, tempPageType, params, htmlPath) => {
        var name = cmd + '_detail'
        var thisPageName = appcan.locStorage.val('thisPageName') || 'myTaskList'
        appcan.locStorage.val('templateParams', params)
        appcan.locStorage.val('template_cmd', cmd)
        appcan.locStorage.val('fromPageName', thisPageName)
        // 必须有，调用父页面js需使用此页面名称
        appcan.locStorage.val('thisPageName', name)
        window.open(htmlPath)
      }
      const address_url = appcan.locStorage.val('os') === '2' ? 'template_detail_workflow.html'
        : appcan.locStorage.val('publicFileName') + 'template/template_detail_workflow.html'

      // const cmd = 'contractApproval'
      const taskId = ''
      const instId = processInstId
      const BIZKEY = bizkey
      const FORMURI = ''
      const NODE_ID = 'EndEvent_1'
      const PROCESS_KEY = ''

      appcan.locStorage.val('windowCloseType', 'close')

      const params = `&TASKINSTANCE_ID=${taskId}&PROCESSINSTANCE_ID=${instId}&BIZKEY=${BIZKEY}&FORMURI=${FORMURI}&NODE_ID=${NODE_ID}
          &PROCESS_KEY=${PROCESS_KEY}&NODE_TYPE=start&contractType=${contractType}&projectId=${projectId}&groupId=${groupId}`

      turnToDetail(
        `${cmd}`,
        `template_detail`,
        params,
        `${address_url}`
      )
    },
    async getViewprojectObjectInfo(firstId) {
      const LIST = this.pageInfo.list
      const lists = [
        { name: '工商信息', img: 'gongshangxinxi', url: 'projectDetailBusiness' },
        { name: '基本信息', img: 'renyuanjiegou', url: 'projectBasicInfo' },
        { name: '更新记录', img: 'jinyingjihua', url: 'projectChangeRecord' },
        { name: '投资信息', img: 'guanlijijin', url: 'projectProgress' },
        { name: '项目进展', img: 'tongjitianbao', url: 'projectXmProgress' },
        { name: '后续融资', img: 'wenjianku', url: 'projectFinancing' },
        { name: '定期报告', img: 'touzijuece', url: 'projectAssess' },
        { name: '人事财务', img: 'zhongyaoshixiang', url: 'projectMoney' },
        { name: '合同签署', img: 'touzifukuan', url: 'projectContract' },
        { name: '重要事项', img: 'zhongyaoshixiang', url: 'projectImportant' },
        { name: '上市公司公告', img: 'touzifukuan', url: 'projectList' },
        { name: '现金流', img: 'touzifukuan', url: 'projectCash' },
        { name: '邮件往来', img: 'touzifukuan', url: 'projectEmail' },
        { name: '文件库', img: 'wenjianku', url: 'projectFile' },
        { name: '关联社群', img: 'touzifukuan', url: 'projectCommunity' }
      ]
      let item = ''
      for (const a in LIST) {
        if (LIST[a].progressId === firstId) {
          item = LIST[a]
        }
      }
      // 九宫格
      lists.map((sitem, index) => {
        if (item.groupId !== '4' && sitem.name === '上市公司公告') {
          lists.splice(index, 1)
        }
      })
      const gridData = JSON.parse(JSON.stringify(lists))
      this.storage.set('gridData', gridData)
      const data = {
        currPage: 1,
        pageSize: 1,
        groupId: item.groupId,
        inveId: item.inveId,
        memberId: '',
        myOrAll: 'all',
        projObject: item.projectObject
      }

      const obj = await this.getListViewIdMy(data)
      if (obj.length === 0) return
      const dataObj = JSON.parse(JSON.stringify(obj[0]))
      this.storage.set('businessObj', dataObj)
      this.$router.push({ path: '/projectDetail' })
    },
    getListViewIdMy(params) {
      return new Promise((resolve, reject) => {
        const URL = '/projectPC/listViewIdMyEnterpriaseForApp'
        this.$axios.postJson(
          URL,
          params,
          res => {
            resolve(res.data)
          },
          error => {}
        )
      })
    },
    getViewProjectInfo(firstId) {
      const LIST = this.pageInfo.list
      let item = ''
      for (const a in LIST) {
        if (LIST[a].progressId === firstId) {
          item = LIST[a]
        }
      }
      const projId = item.projectId
      const projObject = item.projectObject
      this.$router.push({ path: '/projectXmDetail', query: { projId, projObject }})
    },
    getViewFundInfo(firstId) {
      const LIST = this.pageInfo.list
      let item = ''
      for (const a in LIST) {
        if (LIST[a].progressId === firstId) {
          item = LIST[a]
        }
      }
      const projId = item.projectId
      this.$axios.get('/fundInfoListByUserId', {
        fundId: projId,
        keyWord: '',
        currPage: 1,
        length: 10
      }, res => {
        this.storage.set('fundDetail', res.data[0])
        this.$router.push({ path: '/fund', query: { id: projId }})
      })
    },
    avaClick(item) {
      XWalkFunction.startChatPrivate(item.createLoginName)
    },
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.showLoading = false
          this.isLoadingAll = res.isAll
          const list = res.list
          for (const item of list) {
            // 第一层判断
            const dayDiff = this.timeFn(item.progressDate)
            if (
              dayDiff > 30 ||
              item.thatLoginUserId != item.createBy ||
              item.progressResource == '1'
            ) {
              item.isEditDelete = 1
            } else {
              item.isEditDelete = 0
            }
            // 第二层判断
            for (const citem of item.progressCommentList) {
              const sdayDiff = this.timeFn(item.createDt)
              if (sdayDiff > 30 || citem.thatLoginUserId != citem.createBy) {
                citem.isEditDelete = 1
              } else {
                citem.isEditDelete = 0
              }
            }
          }
          this.pageInfo.list = list
          this.updataList()
        }
      )
    },
    goDetail(item) {
      this.$router.push({
        path: 'projectCommunityDetail',
        query: {
          progressId: item.progressId
        }
      })
    },
    loadMore() {
      if (this.isLoadingAll) return
      this.getList(false)
    },
    iconDelet(sid, name) {
      // 删除
      var tableName, keyName, id
      if (name === '评论删除') {
        tableName = 'PROGRESS_COMMENT'
        keyName = 'COMMENT_ID'
        id = sid
      } else {
        tableName = 'PROJECT_PROGRESS'
        keyName = 'PROGRESS_ID'
        id = sid
      }
      const URL = '/deleteTableDataById'
      const getUrl = `${URL}?tableName=${tableName}&keyValue=${sid}&keyName=${keyName}`
      const _self = this
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否删除'
        })
        .then(() => {
          // on confirm
          this.$axios({
            url: getUrl,
            method: 'PUT'
          }).then(response => {
            if (response.status === '0') {
              _self.Toast(`${response.msg}`)
              _self.getList(true)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    timeFn(time) {
      // 如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      if (typeof time === 'string') {
        time = time.replace(
          /-/g,
          '/'
        ) /* new Date()时IE只能识别2018/01/12，不能识别2018-01-12 */
      }
      var dateBegin = new Date(time) // 将-转化为/，使用new Date
      var dateEnd = new Date() // 获取当前时间
      var dateDiff = dateEnd.getTime() - dateBegin.getTime() // 时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天
      return dayDiff
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style lang="scss" scoped>
.im-info-list{
  display: flex;
  justify-content: space-between;
  .tool-info-l{
    display: flex;
    .avator-logo{
      height: 66px;
      width: 66px;
    }
    .tool-info-l-name{
      padding-left: 18px;
      p{
        &:first-child{
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
        }
        &:last-child{
          padding-top: 10px;
          font-size:20px;
          font-weight:400;
          color:rgba(142,141,140,1);
        }
      }
    }
  }
  .tool-info-r{
    display: flex;
    align-items: center;
    .del-icon{
      width: 32px;
      height: 33px;
    }
    .br{
      width:2px;
      height:16px;
      background:rgba(188,195,210,1);
      opacity:0.49;
      display: inline-block;
      margin: 0 19px;
    }
    .pj-icon{
      width: 34px;
      height: 30px;
    }
    .comment-count{
      position: relative;
      display: flex;
      align-items: center;
      padding-right: 20px;
      .count{
        font-size:26px;
        font-weight:400;
        color:rgba(188,195,210,1);
        position: absolute;
        top: 0px;
        right: -10px;
      }
    }
  }
}
.tool-tip {
  background: #fff;
  margin-top: -1px;
}
.tool-tip {
  .noData {
    font-size: 28px;
    line-height: 48px;
  }
  .tool-Message {
    position: relative;
    float: right;
    font-size: 20px;
    font-family: HiraginoSansGB-W3;
    color: #a3a3a3;
    padding: 18px 20px 0px 0px;
    img {
      width: 30px;
      height: 28px;
    }
    span {
      position: absolute;
      top: 5px;
      right: 0;
    }
  }
  .tool-list {
    width: 660px;
    margin: 0 auto;
    border-bottom: 2px solid #f5f5f5;
    background-color: #fff;
    padding-top: 22px;
    padding-bottom: 15px;
    padding-right: 12px;
    overflow: hidden;
    position: relative;
    .tool-xt {
      display: block;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      float: left;
    }
    .nameTime {
      float: left;
      height: 80px;
      margin-left: 20px;
      p {
        float: left;
        text-align: left;
        font-size: 28px;
        line-height: 50px;
        font-weight: bold;
        color: rgba(76, 76, 76, 1);
      }
      .tool-con-lv1 {
        width: 100%;
        margin-top: 10px;
        overflow: hidden;
        i {
          float: left;
          font-size: 22px;
          font-style: normal;
          color: rgba(142, 141, 140, 1);
          line-height: 40px;
        }
      }

    }
    .tool-con {
      text-align: left;
      font-size: 18px;
      /*width: 473px;*/
      /*float: right;*/
      height: 100%;
      letter-spacing: 1px;
      padding-right: 10px;
      padding-top: 20px;
      .tool-con-lv2 {
        .tool-con-p2 {
          position: relative;
          margin-top: 10px;
          font-size: 26px;
          font-weight: bold;
          .ql-align-center {
            text-align: center;
          }
          ol {
            padding-left: 40px;
            li {
              list-style: decimal !important;
            }
          }
          ul {
            padding-left: 40px;
            li {
              list-style: disc !important;
            }
          }
        }
        a {
          // position: absolute;
          font-size: 24px;
          color: #b70007;
          // right: 14px;
          // bottom: -10px;
        }
      }
      .tool-con-lv3 {
        width: 100%;
        overflow: hidden;
        background: url(/assets/img/icon/up.png);
        font-size: 26px;
        ul {
          /*background-color: #f3f3f5;*/
          margin-top: 10px;
          padding: 10px 0;
          li {
            display: flex;
            margin: 10px 0px;
            color: #004071;
            font-size: 24px;
            img {
              width: 25px;
              height: 25px;
            }
          }
          .name {
            display: inline-block;
            // width: 90px;
            /*width: 120px;*/
            box-sizing: border-box;
            vertical-align: top;
            margin-right: 15px;
            color: rgba(76, 76, 76, 0.5);
            font-weight: bold;
          }
          div {
            display: inline-block;
            width: calc(100% - 100px);
            box-sizing: border-box;
            color: rgba(76, 76, 76, 1);
            font-size: 24px;
            vertical-align: top;
          }
        }
      }
      .tool-con-p1 {
        font-size: 26px;
        text-align: left;
        margin-top: 15px;
        font-weight: bold;
      }
    }
    .oneline {
      overflow: hidden;
      text-overflow: ellipsis;
      -ms-text-overflow: ellipsis;
      white-space:nowrap;
    }
  }
}
</style>
<style lang="scss">
.process-contanier{
  a{
    display: inline-block;
  }
}
</style>

