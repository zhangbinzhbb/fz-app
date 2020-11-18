* @Last Modified by: Wendy
* @Last Modified time: 2019-11-27 08:23:33
* 隐藏：政府公文二级分类
*/
<template>
  <!--
    首页点击咨询进详情返回不要刷新 ，查看更多跳转后定位相应页签,已经处理了，
    现在遗留了个问题，来回切换tab标签，都会请求一次数据，这样很耗性能，待处理
  -->
  <div style="height:100%">
    <div
      v-infinite-scroll="loadMore"
      :style="{height: list.length<3 && list.length ?'68vh':'100%'}"
      infinite-scroll-disabled="pageInfo.isLoading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false"
    >
      <div style="height:100%">
        <form v-if="page=='list'" class="yh-search" action @submit.prevent="search">
          <img src="@/assets/images/icon/search-img.png" class="search-img">
          <input
            ref="searchInput"
            v-model="pageInfo.params.searchId"
            type="search"
            placeholder="搜索"
          >
        </form>
        <!-- 信息资讯 -->
        <!-- tabs -->
        <!-- style="paddingBottom:0;" -->
        <div :class="{'mb-20':page=='list'}" class="tabs-con-globle" >
          <span v-if="homeName=='home'&& projectFlag" :class="{'active':tabIdx=='2'}" @click="tabIdx='2'">项目</span>
          <span v-for="(item,key) in tabOpiton" :key="key" :class="{'active':tabIdx==item.id}" @click="getPostUrl(item.id)">{{ item.name }}</span>
          <div v-if="tabIdx==6" class="border-bottom1"/>
        </div>
        <div v-if="tabIdx==6" class="second-tabs-section">
          <div class="second-tabs">
            <span
              v-for="(item, index) in fourOptions"
              :key="index"
              :label="item.label"
              :class="item.checked?'tab-checkbox-select':''"
              class="tab-checkbox"
              @click="selectedfour(item, index, fourOptions)"
            >{{ item.label }}</span>
          </div>
          <div class="order" @click="show = true">
            <img src="@/assets/images/news/order.png">
            <span>订阅</span>
          </div>
        </div>
        <div v-if="tabIdx ===4" class="sub-tab-list">
          <div v-for="(item,index) in subList" :class="{ 'activeSubItem': subActive === item.value}" :key="index" class="sub-item" @click="subTabsHandler(item,index)">
            <span>{{ item.label }}</span>
            <ul v-if="item.subList.length && item.active" class="sub-menu">
              <li v-for="(sitem,sindex) in item.subList" :class="{ 'activeSubItem1': level2 === sitem.value}" :key="sindex" @click.stop="subClickHandle(sitem,index)">
                <span>{{ sitem.label }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div style="text-align: center">
          <router-link
            v-if="proMessageCount>0&&homeName=='home'&&tabIdx=='2'"
            class="tool-updated"
            to="/"
          >{{ proMessageCount }} 条新消息</router-link>
        </div>
        <progre v-show="tabIdx=='2' && homeName=='home' && projectFlag" :selected="selectedProj" :flag="1"/>
        <div v-if="tabIdx!=='2'">
          <div v-for="(item,index) in list" :key="index" class="list-container">
            <i v-if="item.AMOUNT == 0"/>
            <div class="list-item" @click="toDetail(item)">
              <p
                :class="{'title-full':!item.PICTURE||item.PICTURE==''}"
                class="list-item-title"
              >{{ item.MESSAGE_TITLE || item.TITLE }}</p>
              <!--行业资讯标签-->
              <img v-if="item.PICTURE && item.PICTURE!=''" :src="item.PICTURE" alt>
              <span
                class="fl"
              >{{ item.SENDER_NAME||item.PUBLISHER || '--' }} <span> {{ formatTimeDivide(item.START_TIME) || formatTimeDivide(item.PUBLISH_DATE) }}</span></span>
              <div class="fr">
                <div class="lf">
                  <img src="@/assets/images/news/view1.png">
                  <span>{{ item.ISTOTAL }}</span>
                </div>
                <div v-if="tabIdx!='6'" :style="{backgroundImage:'url('+require('@/assets/images/news/msg2.png')+')'}" class="rightmiss">
                  <span>{{ item.TICK_CN }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="homeName=='home'&&tabIdx!=2&&list.length>0" class="knowMore" @click="toListUrl(tabIdx)">查看更多</div>
        <!--行业资讯-->
        <blank v-if="!pageInfo.isLoading&&list&&list.length==0" style="height:82%;"/>
        <bottom v-if="!pageInfo.isLoading&&isLoadAll&&list.length>10"/>
      </div>
    </div>
    <van-overlay :show="show" z-index="1000" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="order-block">
          <h2>订阅</h2>
          <div class="edit-box">
            <van-field v-model="orderValue" placeholder="请输入订阅信息" />
          </div>
          <div class="order-button">
            <span @click="cancelOrder">取消</span>
            <span @click="toOrder(orderValue)">确认</span>
          </div>
        </div>
      </div>
    </van-overlay>
</div></template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'NewsList',
  components: {
    swiper,
    swiperSlide,
    progre: () => import('@/components/project/process')
  },
  props: {
    page: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      show: false,
      orderValue: '',
      itemSelect: false,
      selectedProj: '2',
      homeName: this.$route.name,
      proMessageCount: 0,
      tabOpiton: [{
        id: 3,
        name: '公告'
      }, {
        id: 4,
        name: '公文'
      }, {
        id: 5,
        name: 'HR'
      }, {
        id: 6,
        name: '资讯'
      }],
      subList: [
        {
          label: '元禾相关',
          value: '0',
          subList: []
        },
        {
          label: '工业园区',
          value: '1',
          active: false,
          subList: [
            {
              label: '全部',
              value: 'a1'
            },
            {
              label: '组织人事',
              value: '13'
            },
            {
              label: '会议相关',
              value: '14'
            },
            {
              label: '安全生产',
              value: '15'
            },
            {
              label: '政策规定',
              value: '16'
            },
            {
              label: '党建纪检',
              value: '17'
            },
            {
              label: '其他通知',
              value: '18'
            }
          ]
        },
        {
          label: '市级以上',
          value: '2',
          active: false,
          subList: [
            {
              label: '全部',
              value: 'a2'
            },
            {
              label: '组织人事',
              value: '23'
            },
            {
              label: '会议相关',
              value: '24'
            },
            {
              label: '安全生产',
              value: '25'
            },
            {
              label: '政策规定',
              value: '26'
            },
            {
              label: '党建纪检',
              value: '27'
            },
            {
              label: '其他通知',
              value: '28'
            }
          ]
        }
      ],
      fourOptions: [
        {
          value: '',
          label: '全部',
          checked: true
        }
      ],
      // 信息资讯的 通知公告  最新消息  HR专栏对应的Idx
      tabIdx: this.$route.name === 'home' ? '2' : '3',
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          searchId: null,
          searchType: '',
          subType: '',
          keyword: null,
          subscribe: ''
        },
        list: [],
        info: [],
        postUrl: ''
      },
      // 用于存放信息资讯的list数据
      list: [],
      subActive: '',
      level1: '',
      level2: '',
      projectFlag: false
    }
  },
  watch: {
    tabIdx(val) {
      if (val === 4) {
        this.subActive = '1'
        this.level1 = '1'
        this.level2 = 'a1'
        this.pageInfo.params.searchType = this.subActive
        this.pageInfo.params.subType = ''
      }
      this.storage.set('tabIdx', val)
      this.getInformationList(true)
    }
  },
  created() {
    this.tabIdx = this.storage.get('tabIdx') || '2'
    const yhApplications = this.storage.get('yh-applications') || {}
    yhApplications.slideMenu.map(item => {
      if (item.cmd === 'project') {
        this.projectFlag = true
      }
    })
    if (!this.projectFlag) {
      this.tabIdx = '3'
    }
    this.getSubscribeList()
    if (this.$route.query.showIndex) {
      this.tabIdx = this.$route.query.showIndex
      this.getPostUrl(parseInt(this.tabIdx))
      this.getFirstInformationList(true)
    } else {
      this.getInformationList(true)
      this.checkRead()
    }
  },
  activated() {
    this.tabIdx = this.storage.get('tabIdx') || '2'
    // console.log('activated')
    // if (this.storage.get('refresh-news-list')) {
    //   this.getInformationList(true)
    //   this.storage.remove('refresh-news-list')
    // }
    // this.getInformationList(true)
  },
  destroyed() {
    // console.log('组件销毁')
    // 组件销毁前设置页面数据缓存
    // this.storage.set('news-list-cache-data', {
    //   tabIdx: this.tabIdx,
    //   pageInfo: this.pageInfo,
    //   list: this.list
    // })
  },
  methods: {
    cancelOrder() {
      this.orderValue = ''
      this.show = false
    },
    toOrder(value) {
      if (!value) {
        this.Toast('请输入订阅信息')
        return
      }
      if (value.length > 6) {
        this.Toast('请输入小于6个字符')
        return
      }
      const URL = '/InformationAction/addSubscribe.do'
      const userSubscribe = value
      this.$axios.get(
        URL,
        {
          userSubscribe
        },
        res => {
          this.show = false
          this.fourOptions = [{
            value: '',
            label: '全部',
            checked: true
          }]
          this.orderValue = ''
          this.getSubscribeList()
        },
        err => {
          this.Toast(err.msg)
        }
      )
    },
    subTabsHandler(item, index) {
      // 初始化
      this.subList.map(item => {
        item.active = false
      })

      if (item.value === '0') {
        this.level2 = ''
      }

      this.$set(this.subList[index], 'active', true)
      this.subActive = item.value
      this.level1 = item.value

      this.pageInfo.params.searchType = this.level1
      this.pageInfo.params.subType = this.level2
      if (item.value === '0') {
        this.getInformationList(true)
      }
    },
    subClickHandle(sitem, index) {
      this.$set(this.subList[index], 'active', false)
      this.level2 = sitem.value
      this.pageInfo.params.subType = this.level2
      if (sitem.value === 'a1' || sitem.value === 'a2') {
        this.pageInfo.params.subType = ''
      }
      this.getInformationList(true)
    },
    formatTimeDivide(value) {
      if (!value) return
      const time = value.replace(/-/g, '/')
      return time
    },
    selected(item, index, options) {
      if (!item.checked) {
        item.checked = !item.checked
      }
      this.itemSelect = item.checked
      options.map((option, key) => {
        if (key != index) {
          option.checked = false
        }
      })
      if (!this.itemSelect) {
        this.pageInfo.params.searchType = '0'
      } else {
        this.pageInfo.params.searchType = item.value
      }
      this.getInformationList(true)
    },
    // 二级咨询选择
    selectedfour(item, index, options) {
      if (!item.checked) {
        item.checked = !item.checked
      }
      this.itemSelect = item.checked
      options.map((option, key) => {
        if (key != index) {
          options[key].checked = false
        }
      })
      if (!this.itemSelect) {
        this.pageInfo.params.subscribe = ''
      } else {
        this.pageInfo.params.subscribe = item.value
      }
      this.getInformationList(true)
    },
    toListUrl(tabToIndex) {
      if (this.tabIdx === '2') {
        this.$router.push({
          path: 'projectXm'
        })
      } else {
        this.tabIdx = tabToIndex
        this.$router.push({
          path: 'newsList',
          query: {
            showIndex: tabToIndex
          }
        })
        this.onRefresh()
      }
    },
    getSubscribeList() {
      this.$axios.get(
        '/InformationAction/getSubscribeList.do',
        {},
        res => {
          const subscribeList = res.dataContent
          subscribeList.map(item => {
            this.fourOptions.push(
              {
                value: item.userSubscribe,
                label: item.userSubscribe,
                checked: false
              }
            )
          })
        }
      )
    },
    toDetail(citem) {
      for (const item of this.list) {
        if (citem.MESSAGE_ID) {
          if (item.MESSAGE_ID === citem.MESSAGE_ID) {
            item.ISTOTAL++
            item.AMOUNT++
          }
        }

        if (citem.PK_ID) {
          if (item.PK_ID === citem.PK_ID) {
            // item.ISTOTAL++
            // console.log ("111111")
          }
        }
      }
      const address_url =
        appcan.locStorage.val('publicFileName') +
        'template/template_detail.html'
      const turnToDetail = (cmd, tempPageType, params, htmlPath) => {
        var name = cmd + '_detail'
        var thisPageName = appcan.locStorage.val('thisPageName') || 'myTaskList'
        appcan.locStorage.val('templateParams', params)
        appcan.locStorage.val('template_cmd', cmd)
        appcan.locStorage.val('fromPageName', thisPageName)
        // // 必须有，调用父页面js需使用此页面名称
        appcan.locStorage.val('thisPageName', name)
        appcan.window.open(name, htmlPath, 0, 4)
      }
      if (citem.PUBLISHER === 'eHR') {
        turnToDetail(
          `informationEHRDetail1`,
          `template_detail`,
          `&MSG_ID=${citem.MESSAGE_ID}`,
          `${address_url}`
        )
      } else {
        this.$router.push({
          path: '/newsDetail',
          query: { id: citem.MESSAGE_ID || citem.PK_ID, type: this.tabIdx }
        })
      }
    },
    search() {
      this.pageInfo.params.keyword = this.pageInfo.params.searchId
      this.$refs.searchInput.blur()
      this.getInformationList(true)
    },
    getInformationList(isFirst) {
      this.getPostUrl(this.tabIdx)
      // if (this.tabIdx != '6') {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.$emit('refreshcb')
          this.$set(this, 'list', res.list)
          this.$emit('get-list', res.list)
        },
        err => {
          this.$emit('refreshcb')
          this.isLoading = false
        }
      )
    },
    getFirstInformationList(isFirst) {
      // if (this.tabIdx != '6') {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.$emit('refreshcb')
          this.$set(this, 'list', res.list)
          this.$emit('get-list', res.list)
        },
        err => {
          this.$emit('refreshcb')
          this.isLoading = false
        }
      )
    },
    getPostUrl(val) {
      this.tabIdx = val
      switch (val) {
        case 3:
          this.pageInfo.postUrl = '/InformationAction/informationList.do'
          break
        case 4:
          this.pageInfo.postUrl = '/InformationAction/informationListTwo.do'
          break
        case 5:
          this.pageInfo.postUrl = '/InformationAction/informationListThree.do'
          break
        case 6:
          this.pageInfo.postUrl = '/InformationAction/informationListFour.do'
          break
        default:
          this.pageInfo.postUrl = '/InformationAction/informationList.do'
          break
      }
    },
    loadMore() {
      // this.getInformationList(false)
      if (this.page === 'list') {
        this.getInformationList(false)
      }
    },
    onRefresh() {
      this.subActive = '1'
      this.level1 = '1'
      this.level2 = 'a1'
      this.pageInfo.params.searchType = this.subActive
      this.pageInfo.params.subType = ''

      this.getInformationList(true)
    },
    checkRead() {}
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .order-block {
    width: 100%;
    margin: 0 104px;
    background:rgba(255,255,255,1);
    border-radius:10px;
    h2{
      font-size:30px;
      font-weight:bold;
      color:rgba(0,0,0,1);
      text-align: center;
      padding-top: 24px;
    }
    .edit-box{
      padding: 34px 24px 50px;
      .van-field{
        border:1px solid rgba(188,188,188,1);
        border-radius:4px;
      }
    }
    .order-button{
      display: flex;
      span{
        flex: 1;
        text-align: center;
        line-height: 76px;
        height:76px;
        font-size:27px;
        font-weight:bold;
        &:nth-child(1){
          background:rgba(233,233,233,1);
          color:rgba(0,0,0,1);
          border-bottom-left-radius:10px;
          opacity:0.5;
        }
        &:nth-child(2){
          background:rgba(182,0,5,1);
          color:rgba(255,255,255,1);
          border-bottom-right-radius:10px;
        }
      }
    }
  }
}

.sub-tab-list{
  display: flex;
  padding: 10px 20px 20px;
  background-color: #fff;
  .activeSubItem{
    color:rgba(182,0,5,1) !important;
    background:rgba(182,0,5,0.1);
    border:1px solid rgba(182,0,5,1) !important;
  }
  .activeSubItem1{
    color:rgba(182,0,5,1) !important;
  }
  .sub-item{
    flex: 1;
    height:64px;
    line-height: 64px;
    text-align: center;
    border-radius:4px;
    border:1px solid rgba(225,225,225,1);
    font-size:26px;
    font-weight:500;
    color:rgba(51,51,51,1);
    position: relative;
    .sub-menu{
      position: absolute;
      z-index: 10;
      border:1px solid rgba(182,0,5,1);
      color: #444;
      width: 100%;
      background-color: #fff;
    }
    &+.sub-item{
      margin-left: 10px;
    }
  }
}
/* 搜索框 */
.yh-search{
  position: relative;
  background: #fff!important;
    input{
    text-align: left;
    /*margin: 30px 0;*/
    // line-height: 68px;
    // height: 68px;
    }
}
.yh-search .search-img{
  width: 40px;
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}
.list-container {
  padding: 20px 40px;
  padding-bottom: 0;
  background: #fff;
  position: relative;
  i {
    width: 10px;
    height: 10px;
    background: rgba(183, 0, 7, 1);
    border-radius: 50%;
    position: absolute;
    top: 34px;
    left: 20px;
  }
  .list-item {
    border-bottom: 2px solid #F0F0F0;
    padding-bottom: 20px;
    position: relative;
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    p {
      width: 450px;
      text-align: left;
      max-height: 115px;
      height: 115px;
      margin-bottom: 15px;
      font-size: 28px;
      color: #4C4C4C;
      line-height:40px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      word-break: break-all;
    }
    img {
      position: absolute;
      right: 0;
      top: 0;
      width: 200px;
      height: 120px;
      border-radius: 10px;
      object-fit: cover;
    }
    span {
      font-size: 24px;
      color: #8E8D8C;
    }
    span.fl{
      display: inline-block;
      width:70%;
      span{
        padding-left:10px;
      }
    }
    p.newsListLabel{
      height:auto!important;
      width: 100%;
      span{
        padding:5px 10px;
        margin:0 10px 10px 0;
        display: inline-block;
      }
      span:nth-of-type(n+1){
        color:#03AA4A;
        background: rgba(58,204,120,0.23);
      }
      span:nth-of-type(n+2){
        color:#E89E00;
        background:rgba(248,187,57,0.23);
      }
      span:nth-of-type(n+3){
        color:#3195FC;
        background:rgba(49,149,252,0.23);
      }
    }

  }
  .title-full {
      width: 101% !important;
      height: auto !important;
      box-sizing: border-box;
    }
  .fr {
    /*<!--margin-top: -40px;-->*/
    position: absolute;
    bottom: 13px;
    right: 0;
    div.lf{
      display: inline-block;
      font-size: 24px;
      color: #BCC3D2;
      span{
        display: inline-block;
        color: #bcc3d2;
        margin-top: -1px;
        display: inline-block;
        margin-bottom: 4px;
      }
    }
    img {
      width: 30px!important;
      height: 20px!important;
      position: relative!important;
      top: 0px!important;
      right: 0!important;
      float: none!important;
      vertical-align: top;
      margin-top: 3px;
      margin-right:0!important;
      display: inline-block;
      &:nth-of-type(2){
        margin-left: 42px;
      }
    }
    .rightmiss{
      /*img{*/
        /*width: 36px!important;*/
        /*height: 30px!important;*/
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 28px 20px;
        padding-left: 30px;
        /*padding-top: 14px;*/
        font-size: 0px;
        /*vertical-align: bottom;*/
        line-height: 18px;
        margin-bottom: 2px;
      >span{
        margin-left:5px;
        color: #bcc3d2;
        /*padding-top: 3px;*/
        display: inline-block;
        /*line-height: 26px;*/
      }
      /*}*/
    }
  }
}
.second-tabs-section{
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding:5px 24px 12px 24px;
  .order{
    font-size:17px;
    font-weight:bold;
    color:rgba(185,11,16,1);
    padding-top: 20px;
    img{
      width: 12PX;
      height: 14PX;
      vertical-align: middle;
    }
  }
  .second-tabs{
    width: 82%;
    span{
      margin-left:16px;
      text-align: center;
      /*height: 64px;*/
      line-height: 15px;
      padding:20px 15px;
      /*min-width: 118px;*/
      box-sizing: border-box;
      font-size: 26px;
      color:#666666;
      background:rgba(137,137,137,0.1);
      border-radius:4px;
      height: auto;
    }
    .tab-checkbox-select{
      color: #b60005!important;
      font-weight: 500;
      background:rgba(182,0,5,0.1);
      border-radius:4px;
    }
  }
}

.tabs-con-globle{
  background: white;
  span{
    font-size:28px!important;
  }
  >span:nth-of-type(2){
    margin-left: -15px;
  }
  span.active{
    font-size:32px!important;
  }
  .active:after{
    top:80px;
  }
}
.mb-20{
  margin-bottom: 20px;
  margin-top: -20px;
  padding-bottom: 10px;
}
.knowMore{
  text-align: center;
  font-size: .306667rem;
  color: #bcc3d2;
  line-height: 1.066667rem;
}
.border-bottom1{
  border-top: 2px solid #f0f0f0;
}

</style>
