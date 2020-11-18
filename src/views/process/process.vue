<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle" page-type="home">
      <template slot="right">
        <span class="yh-add-more" @click="$router.push({path:'/processSetting'})">
          <img
            src="@/assets/images/process/processSetting.png"
            alt="分类搜索"
            class="classify-search"
          >
        </span>
      </template>
    </headerx>
    <!-- &&List.length>0 -->
    <div :class="{ 'lessClass':List.length<5 }" class="comment-content no-comment">
      <van-pull-refresh
        v-model="isLoading"
        :head-height="50"
        @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <div class="mail-search">
            <form id="yh-search" class="yh-search" action @submit.prevent="search">
              <img src="@/assets/images/icon/search-img.png" class="search-img">
              <input
                id="searchbox"
                ref="searchInput"
                v-model="pageInfo.params.searchId"
                type="search"
                placeholder="搜索"
              >
            </form>
            <van-row class="new-big-tab">
              <van-col
                v-for="(item,index) in tabsList"
                :span="24/tabsList.length"
                :key="index"
                :class="{'active':tabIdx==index}"
                class="item"
              >
                <p class="item-title" @click="changeTab(index)">{{ item.name }}</p>
              </van-col>
            </van-row>
          </div>
          <ul class="process-list">
            <li v-for="(item,index) in List" :key="index">
              <div style="display:flex">
                <div class="process-list-l">
                  <div>
                    <div class="process-list-l-img" @click="avaClick(item)">
                      <avator :data="item" :params="avatorParams"/>
                    </div>
                    <div class="name" @click="turnToDetail(item)">
                      <span>{{ item.ATART_AUTHOR_NAME }}</span>
                    </div>
                  </div>
                </div>
                <div class="process-list-r" @click="turnToDetail(item)">
                  <p v-if="item.pi_start_time">{{ item.description }}</p>
                  <p v-else>{{ item.DESCRIPTION }}</p>
                  <p>
                    <span>当前步骤:<span>{{ item.NODE_NAME }}</span></span>
                  </p>
                  <p v-if="item.TO_CHAR">
                    <span>待处理人:<span>{{ item.assignee }}</span></span>
                  </p>
                  <p>
                    <span>到达时间:<span>{{ item.START_TIME }}{{ item.pi_start_time }}</span></span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <blank v-if="!pageInfo.isLoading&&List&&List.length==0"/>
        <bottom v-if="!pageInfo.isLoading&&isLoadAll&&List.length > 4"/>
      </van-pull-refresh>
      <div class="yh-home-footer"/>
    </div>

    <navbar ref="navbar"/>
    <loading-box v-model="showLoading"/>
  </div>
</template>
<script>
import navbar from '@/components/navBar'
export default {
  components: {
    navbar,
    avator: () => import('@/components/avator/index')
  },
  data() {
    return {
      timerReload: null,
      temp: '0000',
      catTitle: '流程中心',
      userInfo: {},
      isLoading: false,
      tabsList: [
        { name: '待办事项' },
        { name: '已办事项' },
        { name: '我的发起' }
      ],
      List: [],
      tabIdx: 0,
      avatorParams: {
        avatorAttr: 'facePath', // 用户头像地址属性名
        needUrl: false, // 用户头像地址是否需要加前缀
        nameAttr: 'ATART_AUTHOR_NAME', // 用户名称属性名
        colorAttr: 'COLOR' // 用户头像颜色属性名
      },
      pageInfo: {
        params: {
          // IS_PAGE: true,
          IS_PAGE: 'Y',
          curPage: 1,
          pageSize: 10,
          searchId: null
        },
        list: [],
        postUrl: ''
      },
      showLoading: true
    }
  },
  created() {
    this.temp = '流程中心的Created方法被执行了'
    this.getList(true)
    // let createExeCount = this.storage.get('createExeCount')
    // if (!createExeCount) {
    //   createExeCount = 1
    // }

    this.userInfo = this.storage.get('yh-user')
    if (this.baseConfig.ENV === 'PROD') {
      appcan.window.on('resume', () => {
        this.getList(true)
        this.$refs.navbar && this.$refs.navbar.getList()
      }) // 窗口回到前台时执行回调函数
    }
    // createExeCount++
    // this.storage.set('createExeCount', createExeCount)
  },
  activated() {
    this.getList(true)
  },
  methods: {
    IfWindowClosed() {
      if (appcan.locStorage.val('reloadProcessCmd') === '') {
        window.clearInterval(timerVote)
        appcan.locStorage.val('reloadProcessCmd', '')
        location.reload()
      }
    },
    avaClick(item) {
      XWalkFunction.startChatPrivate(item.START_USER)
    },
    turnToDetail(item) {
      appcan.locStorage.val(
        'taskType',
        this.tabIdx === 0 ? 'pending' : item.TASKTYPE
      )
      appcan.locStorage.val('NodeShield', item.NodeShield)
      const openYSP = (title, url) => {
        /* var param = {
            url: url,
            title: title
          }
          uexYSP.openYSP(JSON.stringify(param)) // ios android*/
        var oem = appcan.locStorage.val('oem')
        if (oem == 'APPLE') {
          // window.open(url);
          location.href = 'iosYSP://' + title + '~$~' + url
        } else {
          window.XWalkFunction.setXwalkUrl(url, title)
        }
      }
      if (item.cmd === 'EASYSP') {
        openYSP(item.EAS_TYPE, item.FORMURI)
        return
      }
      const turnToDetail = (cmd, tempPageType, params, htmlPath) => {
        var name = cmd + '_detail'
        var thisPageName = appcan.locStorage.val('thisPageName') || 'myTaskList'
        appcan.locStorage.val('templateParams', params)
        appcan.locStorage.val('template_cmd', cmd)
        appcan.locStorage.val('fromPageName', thisPageName)
        // 必须有，调用父页面js需使用此页面名称
        appcan.locStorage.val('thisPageName', name)
        // appcan.window.open(name, htmlPath, 0, 4)
        appcan.locStorage.val('windowCloseType', 'close')
        window.open(htmlPath, name, '', '')
        // window.location.href = htmlPath
        /* if (appcan.locStorage.val('os') === '2') {
            appcan.locStorage.val('reloadProcessCmd', "reloadProcess");
            this.timerReload = window.setInterval('IfWindowClosed()', 500);
          }*/
      }

      const address_url = appcan.locStorage.val('os') === '2' ? 'template_detail_workflow.html'
        : appcan.locStorage.val('publicFileName') +
          'template/template_detail_workflow.html'

      if (this.tabIdx === 0) {
        const pkId = item.BIZKEY
        const BIZKEY = item.BIZKEY
        if (`${item.cmd}` === 'dailyHealthy') {
          this.$router.push({ path: '/healthy', query: { pkId }})
        } else if (`${item.cmd}` === 'orderingMeals') {
          this.$router.push({ path: '/orderingMeals', query: { BIZKEY }})
        } else {
          turnToDetail(
            `${item.cmd}`,
            `template_detail`,
            `&TASKINSTANCE_ID=${item.TASKINSTANCE_ID}&PROCESSINSTANCE_ID=${
              item.PROCESSINSTANCE_ID
            }&BIZKEY=${item.BIZKEY}&FORMURI=${item.FORMURI}&NODE_ID=${
              item.NODE_ID
            }&PROCESS_KEY=${item.PROCESS_KEY}`,
            `${address_url}`
          )
        }
      }
      // this.tabIdx为list的每一项
      if (this.tabIdx === 1) {
        const pkId = item.BIZ_KEY
        const BIZKEY = item.BIZ_KEY
        if (`${item.cmd}` === 'dailyHealthy') {
          this.$router.push({ path: '/healthDetail', query: { pkId }})
        } else if (`${item.cmd}` === 'orderingMeals') {
          this.$router.push({ path: '/orderingMeals', query: { BIZKEY }})
        } else {
          turnToDetail(
            `${item.cmd}`,
            `template_detail`,
            `&TASKINSTANCE_ID=${item.taskId}&PROCESSINSTANCE_ID=${
              item.instId
            }&BIZKEY=${item.BIZ_KEY}&FORMURI=${item.FORMURI}&NODE_ID=${
              item.NODE_ID
            }&PROCESS_KEY=${item.PROCESS_KEY}&NODE_TYPE=view`,
            `${address_url}`
          )
        }
      }
      if (this.tabIdx === 2) {
        turnToDetail(
          `${item.cmd}`,
          `template_detail`,
          `&TASKINSTANCE_ID=${item.taskId}&PROCESSINSTANCE_ID=${
            item.instId
          }&BIZKEY=${item.BIZ_KEY}&FORMURI=${item.FORMURI}&NODE_ID=${
            item.NODE_ID
          }&PROCESS_KEY=${item.PROCESS_KEY}&NODE_TYPE=start`,
          `${address_url}`
        )
      }
    },
    loadMore() {
      this.getList(false)
    },
    goback() {
      window.history.back(-1)
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    getList(isFirst) {
      this.getPostUrl()
      this.showLoading = true
      if (this.isLoadAll) {
        this.showLoading = false
      } else {
        this.showLoading = true
      }
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          this.showLoading = false
          let arr = res.list
          arr = arr || []
          arr.map(item => {
            if (this.tabIdx == 2) {
              item.facePath = this.userInfo.facePath
              item.ATART_AUTHOR_NAME = this.userInfo.name
            }
          })
          this.$set(this, 'List', arr)
        },
        error => {
          this.isLoading = false
          this.showLoading = false
        }
      )
    },
    getPostUrl() {
      switch (this.tabIdx) {
        case 0:
          this.pageInfo.postUrl = '/MyTaskAction/myTaskList.do'
          break
        case 1:
          this.pageInfo.postUrl = '/MyTaskAction/MyInvolvedTaskListManager.do'
          break
        case 2:
          this.pageInfo.postUrl = '/MyTaskAction/getMyStartTaskList.do'
          break
      }
    },
    changeTab(val) {
      if (this.isLoadAll) {
        this.isLoadAll = false
      }
      console.log('tab', this.showLoading)
      this.tabIdx = val
      this.getList(true, val)
    },
    onRefresh() {
      // this.Toast('刷新成功')
      // window.location.reload()
      this.getList(true)
    }
  }
}
</script>

<style lang="scss">
.lessClass{
  .van-pull-refresh{
    height: 100%;
  }
  .van-pull-refresh__track{
    height: 100%;
  }
}
</style>

<style scoped lang="scss">
  .yh-header-x .title{
    font-size: 32px;
  }
  .classify-search{
    width:44px;
    height:44px;
  }
  .yh-add-more .van-icon-setting-o{
    font-size: 44px;
    vertical-align: middle;
  }
  .van-icon-setting-o::before{
    content:'' !important;
    background-size:100% 100%;
  }
  .new-big-tab{
    display: flex;
    width: 100%;
    padding: 0 0 17px 0;
    height: 60px;
    .van-col{
      width: 33.3%;
      .item-title{
        font-size: 24px;
        line-height: 40px;
        margin: 0px 0 4px 0;
        color: #4C4C4C;
        text-align: center;
      }
    }
    .active {
      border: none;
      color: #b70007;
      position: relative;
      .item-title{
        color: #b80008;
        border-color: #b80008;
        font-weight: 500;
        font-size: 26px;
      }
      &:after {
        content: '';
        display: block;
        position: absolute;
        // bottom: 2px;
        left: 50%;
        border-top: 4px solid #B60005 !important;
        width: 44px;
        margin-left: 0;
        transform: translateX(-50%);
      }
    }
  }
  .process-list {
    height: auto;
    margin-top: 18px;
    overflow: hidden;
    li {
      overflow: hidden;
      padding: 40px 30px 40px 40px;
      margin-bottom: 18px;
      background-color: #fff;
      .process-list-l {
        display: inline-block;
        width: 15%;
        font-size: 28px;
        font-family: HiraginoSansGB-W3;
        color: #000;
        display: flex;
        align-items: center;
        .process-list-l-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          margin: 0 auto;
          img {
            width: 100%;
          }
        }
        .name {
          text-overflow: ellipsis;
          height:33px;
          font-size:24px;
          font-weight:500;
          color:#4C4C4C;
          line-height:33px;
          margin-top: 10px;
          text-align: center;
        }
      }
      .process-list-r {
        width: 80%;
        margin-left: 5%;
        display: inline-block;
        p {
          text-align: left;
          word-break: break-all;
          width:100%;
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:40px;
          margin-bottom: 5px;
          &:nth-of-type(1){
            margin-bottom: 10px;
          }
        }
        span {
          text-align: left;
          line-height:37px;
          font-size:26px;
          font-weight:500;
          color:rgba(158,158,157,1);
          line-height:37px;
          span{
            margin-left:8px;
          }
        }
        .tianshu {
          color: #b70007;
        }
      }
    }
  }
  .yh-search{
    position: relative;
    background: #fff!important;
    padding:0 30px!important;
  }
  .yh-search input{
    text-align: left;
    margin: 40px 0px 40px 0px!important;
    line-height: 68px;
    height: 68px;
  }
  .yh-search .search-img{
    width: 40px;
    position: absolute;
    left: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>

