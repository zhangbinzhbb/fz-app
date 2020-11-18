<template>
  <div ref="hasComment" class="home has-comment">
    <!-- 头部搜索框 -->
    <headerx page-type="home">
      <template slot="title">
        <div class="search-box" @click="$router.push({path:'/search'})">
          <van-icon name="search"/>
          <span>请输入关键字...</span>
        </div>
      </template>
    </headerx>
    <!-- 下拉刷新 -->
    <div ref="commentContent" class="comment-content">
      <van-pull-refresh
        v-model="isLoading"
        :loading-text="'当前版本 V'+version"
        :head-height="50"
        @refresh="onRefresh"
      >
        <!-- 搜索框下面的栏目 基金规模  项目  子基金 人员 -->
        <div v-if="hometop.length" class="dashboard">
          <ul class="board-list">
            <li
              v-for="(item,index) in hometop"
              :class="{'android-weight':isAndroid12}"
              :key="index">
              <div :class="{'largeClass':largeText && isAndroid12 }" class="large">{{ item.COUNT }}
                <span v-if="index==0">亿</span>
                <span v-else-if="index===3">人</span>
                <span v-else>个</span>
              </div>
              <span>{{ item.NAME }}</span>
            </li>
          </ul>
        </div>
        <!-- 九宫格-->
        <div class="slide-menus">
          <swiper v-if="totalMenuPage" ref="mySwiper" :options="swiperOption">
            <!-- totalMenuPage 代表从后台接口获取的九宫格数据/每页8个的个数 -->
            <swiper-slide v-for="index in totalMenuPage" :key="index">
              <div class="slide-menu">
                <ul class="menu-list">
                  <li v-for="(item, $index) in getMenusByPage(index)" :key="$index">
                    <div class="swiper-text" @click="$router.push({path: item.router})">
                      <div>
                        <img :src="item.applicationIcon" alt>
                      </div>
                      {{ item.applicationName }}
                      <!-- 301代表我的消息 -->
                      <div
                        v-if="item.applicationId==301 && numb.messageCount !==0"
                        class="numbMark"
                      >{{ numb.messageCount>99?'99+':numb.messageCount }}</div>
                      <!-- 302代表信息资讯 -->
                      <div
                        v-if="item.applicationId==302 && numb.informationCount!==0"
                        class="numbMark"
                      >{{ numb.informationCount>99?'99+':numb.informationCount }}</div>
                      <!-- 309代表 客户信息-->
                      <div
                        v-if="item.applicationId==309 && numb.knowledgeManageListCount!==0"
                        class="numbMark"
                      >{{ numb.knowledgeManageListCount>99?'99+':numb.knowledgeManageListCount }}</div>
                      <!-- 304代表工作日程 -->
                      <div
                        v-if="item.applicationId==304 && numb.scheduleCount!==0"
                        class="numbMark"
                      >{{ numb.scheduleCount>99?'99+':numb.scheduleCount }}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </swiper-slide>
            <div slot="pagination" class="swiper-pagination"/>
          </swiper>
        </div>
        <div>
          <!-- 轮播图区域 -->
          <div v-if="messageList.length&&!hideMessage" class="home-news">
            <img src="@/assets/images/b1.png" alt class="hot">
            <img src="@/assets/images/b2.png" alt>
            <div class="content">
              <van-swipe :autoplay="3000" :vertical="true" :show-indicators="false" class="van-swiper">
                <van-swipe-item v-for="(item,key) in messageList" :key="key">
                  <div class="b-item">
                    <div
                      class="news-item"
                      @click="$router.push({path:'/newsDetail',query:{id:item.MESSAGE_ID,type: '6'}})"
                    >{{ item.COLUMN_NAME }} {{ item.MESSAGE_TITLE }}
                    </div>
                    <div class="arrow-left">
                      <span class="dot"/>
                      <van-icon name="arrow"/>
                    </div>
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
          </div>
        </div>
        <!-- 日程 -->
        <div class="conTit">
          <img src="@/assets/images/icon/schedule.png">
          <span class="span">日程</span>
          <span class="more" @click="$router.push({path:'/mySchedule'})">所有<van-icon name="arrow"/></span>
        </div>
        <!-- 详细日程 -->
        <div class="cop-con">
          <myS :flag="1"/>
        </div>
        <div class="cop-con con-news">
          <img src="@/assets/images/icon/info.png" alt="">
          <news/>
        </div>
      </van-pull-refresh>
    </div>
    <short-cut/>

  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
let getPageInfoFromLocal
// let fromPath
export default {
  components: {
    swiper,
    swiperSlide,
    shortCut: () => import('@/components/shortcut/index'),
    news: () => import('../news/componets/newsList'),
    progre: () => import('@/components/project/process'),
    myS: () => import('../schedule/mySchedule')
  },
  data() {
    return {
      // showProcess: false, // 判断是否有项目菜单
      loading: false, // 是否处于加载状态
      finished: false, // 是否已加载完所有数据
      userId2: 'xxxx',
      show: true,
      isLoading: false,
      projectAndNews: false, // 控制项目进展 和 信息资讯的显示
      slideMenu: [],
      hideMessage: false,
      // 轮播图请求后的接口数据
      messageList: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        }
        // autoplay: true // 可选选项，自动滑动
      },
      totalMenuPage: null,
      selected: '1',
      isNetwork: true,
      // 获取角标值得到的对象
      numb: {},
      hometop: [],
      proMessageCount: 0,

      // 下拉刷新
      state: 0,
      top: 0,
      startY: 0, // 保存 y轴点的位置
      touching: false, // 代表当前是否处于 下拉刷新行为的开关，也就是当属于滚动行为时，就要退出该事件机制
      largeText: false
    }
  },
  computed: {
    currentTabComponent() {
      const view = this.selected === '2' ? 'news' : 'progress'
      return 'tab-' + view
    }
  },
  watch: {
    hometop(value) {
      if (value.length) {
        value.map(item => {
          if (item.NAME === '基金规模') {
            this.largeText = item.COUNT.length >= 6
          }
        })
      }
    }
  },
  // 为了在加载页面之前展现动画
  mounted() {
    this.getApplications()
    this.getMessageList()
    window.localStorage.setItem('completed', '加载完成')
  },
  created() {
    console.log('==home==')
    // 新加的
    this.getApplications()
    this.getMessageList()
    this.getUnreadNum()
    this.getProgressComment()
    this.showProjectAndNews() // 获取yes 和 no
  },
  beforeRouteEnter(to, from, next) {
    if (from.path.indexOf('List') > -1 || from.path.indexOf('list') > -1) {
      getPageInfoFromLocal = true
    }
    if (from.path.indexOf('login-new') > -1) {
      getPageInfoFromLocal = false
    }
    next()
  },
  beforeRouteLeave(to, from, next) {
    this.hideMessage = true
    next()
  },
  activated() {
    this.getMessageList()
  },
  destroyed() {
    // 页面销毁 前设置页面数据缓存
    this.storage.set('home-cache-data', {
      slideMenu: this.slideMenu,
      messageList: this.messageList,
      totalMenuPage: this.totalMenuPage,
      numb: this.numb,
      hometop: this.hometop,
      proMessageCount: this.proMessageCount
    })
  },
  methods: {
    getString(key) {
      return window.localStorage.getItem(key)
    },
    // mint-ui的下拉刷新
    loadTop() {
      // 加载更多数据
      this.$refs.loadmore.onTopLoaded()
      this.getApplications()
      this.getMessageList()
      this.getUnreadNum()
      this.getProgressComment()
      this.showProjectAndNews() // 获取yes 和 no
      setTimeout(() => {
        window.location.reload()
      }, 600)
    },
    onRefresh() {
      // 销毁首页进展列表数据
      this.storage.remove('process-cache-data')
      this.storage.remove('tabIdx')
      this.getApplications()
      this.getMessageList()
      this.getUnreadNum()
      this.getProgressComment()
      this.showProjectAndNews() // 获取yes 和 no
      setTimeout(() => {
        window.location.reload()
        this.isLoading = false
      }, 600)
    },
    // 获取yes 和 no 控制项目进展和信息资讯的显示与隐藏
    showProjectAndNews() {
      this.$axios.get('/projectInfo/isGQ', {}, res => {
        if (res.data.isGQ === 'YES') {
          this.projectAndNews = true
          this.selected = '1'
        } else {
          this.projectAndNews = false
          this.selected = '2'
        }
      })
    },
    // 获取进展消息数量
    getProgressComment() {
      this.$axios.get(
        'progressComment/messagelist',
        { pageSize: 1, currPage: 1 },
        res => {
          // console.log(res)
          this.proMessageCount = res.totalCount
        }
      )
    },
    // 角标值显示数量
    getUnreadNum() {
      this.$axios.get('/EipCountAction/getCountStatistics.do', {}, res => {
        this.userId2 = this.storage.get('yh-user')
        this.numb = res.dataContent
      })
      this.$axios.post('/EipCountAction/getIndexStatistics.do', {}, res => {
        // console.log(res)
        this.hometop = res.dataContent
        this.storage.set('yh-IndexStatistics', this.hometop)
      })
    },
    getMenusByPage(page) {
      const start = (page - 1) * 8
      const slideMenu = this.slideMenu.slice(start, start + 8)
      return slideMenu
    },
    // 获取home页的九宫格数据
    toqichacha(item) {
      if (item.cmd === 'qichacha') {
        this.$router.push({
          path: item.router
        })
      } else {
        this.$router.push({
          path: item.router
        })
      }
    },
    getApplications() {
      this.$axios.get('/loginAction/getApplications.do', null, res => {
        this.slideMenu = res.dataContent.info
        this.totalMenuPage = Math.ceil(this.slideMenu.length / 8)
        this.slideMenu.map(item => {
          // console.log(item)
          switch (item.cmd) {
            case 'dailyHealthy':
              item.router = '/healthList'
              break
            case 'orderingMeals':
              item.router = '/orderingList'
              break
            case 'qichacha':
              item.router = '/qichacha'
              break
            case 'myMessageListAll':
              item.router = 'messageList' // 我的消息
              break
            case 'informationList':
              item.router = 'newsList' // 信息资讯
              break
            case 'receptionSheet':
              item.router = 'visitList' // 来访接待
              break
            case 'myAgendaList':
              item.router = 'mySchedule' // 工作日程
              break
            case 'meetingList':
              item.router = 'meetingRoom' // 会议申请
              break
            case 'leaveList':
              item.router = 'leaveApply' // 请假申请
              break
            case 'monitor':
              item.router = 'fundPerformance' // 运营监控
              break
            case 'allApplication':
              item.router = `it?id=${item.applicationId}`
              break
            case 'customerViewList':
              item.router = 'customerList' // 客户信息
              break
            case 'knowledgeManageList':
              item.router = 'knowledgeList' // 知识管理
              break
            case 'platform':
              item.router = 'platformList' // 平台
              break
            case 'fund':
              item.router = 'fundsList' // 基金
              break
            case 'project':
              // this.showProcess = true
              item.router = 'projectXm' // 项目
              break
            case 'subFund':
              item.router = 'subFoudsList' // 子基金
              break
            case 'meetingMinutes':
              item.router = 'meetingRecordList' // 会议纪要
              break
            case 'signInCode':
              item.router = 'signInCode' // 签到
              break
          }
        })
        this.storage.set('yh-applications', {
          slideMenu: this.slideMenu,
          totalMenuPage: this.totalMenuPage
        })
      })
    },
    // 轮播图的数据获取
    getMessageList() {
      this.hideMessage = false
      // /InformationAction/informationListFour.do
      const URL = `/InformationAction/informationListFour.do`
      this.$axios.post(
        URL,
        {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 5
        },
        res => {
          this.messageList = res.dataContent

          // if (res.statue === '0') {
          //   this.message = res.msg
          // }
          // const userName = res.dataContent
          // window.sessionStorage.setItem('userName', userName)
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.home a {
  color: inherit;
}
.search-box {
  left: 24px;
  top: 12px;
  position: absolute;
  display: inline-block;
  width: 700px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  box-sizing: border-box;
  font-size: 29px;
  overflow: hidden;
  line-height: 60px;
  i {
    display: inline-block;
    vertical-align: middle;
    margin-top: 5px;
    font-size: 41px;
    line-height: 50px;
    float: left;
    margin-left: 20px;
  }
  span {
    position: relative;
    opacity: 0.7;
    float: left;
  }
}
.dashboard {
  .board-list {
    font-size: 27px;
    background: #fff;
    padding-bottom: 10px;
    text-align: center;
    padding: 20px 0;
    li {
      width: 25%;
      display: inline-block;
      text-align: center;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        right: 0;
        height: 55%;
        top: 35px;
        display: inline-block;
        border-right: 2px solid #f5f5f5;
      }
      &:last-child:after {
        display: none;
      }
      .largeClass{
        font-size: 34px!important;
      }
      .large {
        font-size: 56px;
        /*margin-bottom: 10px;*/
        font-family:DINCondensed-Bold!important;
        font-weight:bold;
        color:rgba(62,60,58,1);
        line-height:67px;
        padding:8px 0;
      }
      span {
        font-size: 23px;
        line-height: 40px;
        color: #8E8D8C;
      }
    }
  }
}
.slide-menus {
  background: #fff;
  margin-top: 18px;
  font-size: 29px;
  margin-bottom: 20px;
  .menu-list {
    text-align: left;
    padding: 30px 0;
    li {
      display: inline-block;
      width: 25%;
      text-align: center;
      margin-bottom: 35px;
      img {
        width: 48px;
        padding-bottom: 20px;
      }
      .swiper-text {
        position: relative;
        font-size: 29px !important;
        color:rgba(64, 64, 64, 1);
        .numbMark {
          height: 25px;
          padding: 0 10px;
          background: #d30006;
          border-radius: 40px;
          position: absolute;
          top: -9px;
          right: 18px;
          line-height: 30px;
          font-size: 21px;
          color: #fff;
        }
      }
    }
  }
}

.tool-updated {
  font-size: 26px;
  color: #fff;
  display: inline-block;
  width: 366px;
  height: 62px;
  background: rgba(56, 57, 57, 1);
  margin: 18px auto 0px auto;
  border-radius: 50px;
  text-align: center;
  line-height: 62px;
}
/deep/ .schedule-son2 .schedule-son-lv2 .schedule-son-ul li{
  padding-right:9px!important;
  padding-top:4px!important;
}
/deep/ .tabs-con-globle{
  span{
    font-size:28px!important;
  }
  span.active{
    font-size:32px!important;
  }
  .active:after{
    top:80px;
  }
}
/deep/ .schedule-son2 .schedule-son-lv2 ul li .img-conter{
  top:-6px!important;
}
/deep/ .schedule-son2 .schedule-son-lv2 ul li[data-v-ff277876]:before{
  top:0!important;
}
/deep/
// .tool-tip .tool-list .tool-con .tool-con-lv2 .tool-con-p2{
//   width: 103%!important;
// }
  /*信息资讯标题*/
.conTit {
  background: #fff;
  overflow: hidden;
  border-bottom: 1px solid #F0F0F0;
  padding:0 40px;
  padding-right:45px;
  img {
    float: left;
    width: 26px;
    height:26px;
    vertical-align: bottom;
    padding-top: 26px;
    margin-right: 20px;
  }
  .span {
    font-size: 32px;
    color: rgba(76, 76, 76, 1);
    float: left;
    line-height: 80px ;
    font-weight: bold;
  }
  .more {
    float: right;
    font-size: 23px;
    color: rgba(188, 195, 210, 1);
    line-height: 80px ;
    i{
      font-size: 23px;
      vertical-align: middle;
      margin-top: -1px;
    }
  }
}
.cop-con{
  margin-bottom: 20px;
  background: white;
}
.con-news{
  position: relative;
  img{
    position: absolute;
    left:42px;
    top:12px;
    width: 30px;
    height:30px;
    vertical-align: bottom;
    padding-top: 26px;
    margin-right: 20px;
  }
}
.projectMsgList{
  margin-bottom: 0;
  text-align: center;
}

.home-news {
  position: relative;
  margin-bottom: 12px;
  .hot{
    width: 39px;
    height: 43px;
    position: absolute;
    left: 40px;
    top: 35px;
  }
  .content {
    position: absolute;
    left:98px;
    height: 114px;
    top: 6px;
    width: calc(100% - 80px);
    z-index: 99;
    padding: 24px 61px 10px 0;
    box-sizing: border-box;
    text-align: left;
    background: none;
    .van-swiper {
      width: 100%;
      height: 100%;
    }
    .b-item{
      display: flex;
      justify-content: space-between;
      .news-item {
        font-size: 26px;
        color: #222121;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        height: calc(100% - 20px);
        box-sizing: border-box;
        width: 100%;
        position: relative;
      }
      .arrow-left{
        display: flex;
        align-items: center;
        margin-top:20px;
        .dot{
          width:10px;
          height:10px;
          background:rgba(182,0,5,1);
          border-radius:50%;
        }
        .van-icon{
          font-size: 24px;
        }
      }
    }
  }
  img {
    width: 100%;
  }
}
</style>
