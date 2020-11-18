<template>
  <div class="has-comment project-community-detail">
    <headerx :cat-title="catTitle">
      <template slot="right">
        <span class="community-detail-s" @click="toNewReply">
          <img
            src="@/assets/images/edit.png"
            alt="分类搜索"
            class="classify-search-edit"
          >
        </span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <div v-if="detail" class="block-community-detail">
        <div class="block-header">
          <p class="title">
            <span>{{ formatTime(detail.progressDate) }}</span>
            <span>添加人：{{ detail.createName }}</span>
          </p>
          <p class="content" v-html="detail.progressHtml"/>
        </div>
        <div v-if="progressList.length" class="block-list" >
          <div v-for="(item,index) in progressList" :key="index" class="block-item">
            <div class="block-item-top">
              <div class="block-item-top-l">
                <avator :data="detail" :params="avatorParams" class="avator-img"/>
                <div>
                  <span class="name">{{ item.createName }}</span>
                  <span class="time">{{ formatTime(item.commentDt) }}</span>
                </div>
              </div>
              <div class="block-item-top-r">
                <img v-if="item.isEditDelete===0" class="del-icon" src="@/assets/images/shanchu@2x.png" alt="" @click="deleteHandle(item.commentId)">
                <span v-if="item.isEditDelete===0" class="br"/>
                <img class="pj-icon" src="@/assets/images/pj@2x.png" alt="" @click="toReply(item)" >
              </div>
            </div>
            <p class="block-item-content" v-html="item.commentHtml"/>
          </div>
        </div>
      </div>
    </div>
    <loading-box v-model="showLoading"/>
  </div>
</template>

<script>
export default {
  components: {
    avator: () => import('@/components/avator/index')
  },
  data() {
    return {
      progressId: '',
      detail: null,
      progressList: [],
      params: {
        currPage: 1,
        pageSize: 1,
        projectObject: '',
        inveId: '',
        groupId: '',
        progressId: ''
      },
      avatorParams: {
        avatorAttr: 'filePath', // 用户头像地址属性名
        needUrl: false, // 用户头像地址是否需要加前缀
        nameAttr: 'createName', // 用户名称属性名
        colorAttr: 'COLOR' // 用户头像颜色属性名
      },
      showLoading: true,
      catTitle: '进展详情'
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}

    const progressId = this.$route.query.progressId
    const flag = this.$route.query.flag

    let projObject = ''
    let inveId = ''
    let groupId = ''

    if (!flag) {
      projObject = this.model.projObject
      inveId = this.model.inveId
      groupId = this.model.groupId
      const name = this.model.enName ? this.model.enName : this.model.projObjectName
      this.catTitle = name
    }

    const params = {
      currPage: 1,
      pageSize: 1,
      projObject,
      inveId,
      groupId,
      progressId
    }
    this.params = params
    this.getInit(this.params)
  },
  mounted() {
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
  methods: {
    toReply(item) {
      const progressId = item.progressId
      const status = item.status
      this.$router.push({
        path: '/projectReply',
        query: { progressId, status }
      })
    },
    toNewReply() {
      const model = this.detail
      const progressId = model.progressId
      const status = model.status
      const name = model.projectObjectName
      this.$router.push({
        path: '/projectHomeProcessNew1',
        query: { progressId, status, name }
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
      const LIST = this.progressList
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
      const LIST = this.progressList
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
      const LIST = this.progressList
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
    async getInit(params) {
      const data = await this.getDetails(params)
      const list = await this.getDetail(params)
      const createDt = data.createDt
      // 第二层判断
      for (const citem of list) {
        const sdayDiff = this.timeFn(createDt)
        if (sdayDiff > 30 || citem.thatLoginUserId !== citem.createBy) {
          citem.isEditDelete = 1
        } else {
          citem.isEditDelete = 0
        }
      }
      this.progressList = list
    },
    getDetails(params) {
      this.showLoading = true
      const URL = '/projectProgress/appList'
      return new Promise((resolve, reject) => {
        this.$axios.postJson(
          URL,
          params,
          res => {
            this.showLoading = false
            const model = res.data[0]
            this.detail = model
            resolve(model)
          }
        )
      })
    },
    getDetail(params) {
      params.pageSize = 100
      const URL = '/progressComment/list'
      return new Promise((resolve, reject) => {
        this.$axios.get(
          URL,
          params,
          res => {
            const data = res.data
            resolve(data)
          }
        )
      })
    },
    deleteHandle(keyValue, tableName = 'PROGRESS_COMMENT', keyName = 'COMMENT_ID') {
      const URL = '/deleteTableDataById'
      this.$dialog.confirm({
        title: '',
        message: '是否需要删除此条评论？',
        cancelButtonText: '放弃删除'
      }).then(() => {
        this.$axios.put(
          URL,
          {
            tableName,
            keyValue,
            keyName
          },
          res => {
            this.getInit(this.params)
          }
        )
      }).catch(() => {})
    },
    // 后端模板字符串event事件-end
    timeFn(time) {
      // 如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      if (typeof time === 'string') {
        time = time.replace(/-/g, '/')/* new Date()时IE只能识别2018/01/12，不能识别2018-01-12 */
      }
      var dateBegin = new Date(time)// 将-转化为/，使用new Date
      var dateEnd = new Date()// 获取当前时间
      var dateDiff = dateEnd.getTime() - dateBegin.getTime()// 时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))// 计算出相差天
      return dayDiff
    }
  }
}
</script>

<style lang="scss" scoped>
.project-community-detail{
  .community-detail-s{
    display: flex;
    align-items: center;
    justify-content: center;
    .classify-search-edit{
      width:68px;
      height:79px;
    }
  }
  .block-community-detail{
    .block-header{
      padding: 40px 40px 50px 40px;
      background-color: #fff;
      .title{
        display: flex;
        justify-content: space-between;
        span{
          height:44px;
          font-size:24px;
          font-weight:400;
          color:rgba(142,141,140,1);
          line-height:44px;
        }
      }
      .content{
        padding-top: 10px;
        font-size:24px;
        font-weight:500;
        color:rgba(76,76,76,1);
        line-height:1.2;
        word-break: keep-all;
        white-space: pre-line;
      }
    }
    .block-list{
      margin-top: 20px;
      margin-bottom: 20px;
      padding: 3px 40px 0;
      background-color: #fff;
      .block-item{
         padding-bottom: 30px;
         padding-top: 34px;
        &+.block-item{
          border-top: 1px solid #F0F0F0;
        }
        .block-item-top{
          display: flex;
          justify-content: space-between;
          .block-item-top-l{
            display: flex;
            .avator-img{
              width: 66px;
              height: 66px;
              padding-left: 0;
            }
            div{
              display: flex;
              flex-direction: column;
              padding-left: 18px;
              .name{
                font-size:28px;
                font-weight:500;
                color:rgba(76,76,76,1);

              }
              .time{
                padding-top: 10px;
                font-size:20px;
                font-weight:400;
                color:rgba(142,141,140,1);
              }
            }
          }
          .block-item-top-r{
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
          }
        }
        .block-item-content{
          font-size:24px;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:1.2;
          padding-top: 21px;
          word-break: keep-all;
          white-space: pre-line;
        }
        .block-item-reply-list{
          padding-top: 30px;
          .block-item-reply-item{
            display: flex;
            &+.block-item-reply-item{
              padding-top: 18px;
            }
            .name{
              font-size:24px;
              font-weight:500;
              color:rgba(76,76,76,1);
            }
            .value{
              font-size:24px;
              font-weight:400;
              color:rgba(76,76,76,1);
            }
          }
        }
      }
    }
  }
}
</style>
