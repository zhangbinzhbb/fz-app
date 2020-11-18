<template>
  <div class="Fundperdetail">
    <headerx :cat-title="cattitle" page-type="back" @closeBack="$router.push({path: '/Fundperformance'})" />

    <form class="yh-search" action @submit.prevent="search">
      <input
        ref="searchInput"
        type="search"
        placeholder="搜索"
        v-model="searchId"
      >
      <van-icon :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}" name="search" class="searIcon"/>
    </form>
    <div class="tabs-con-globle">
      <span v-for="(item,key) in tabFound" :key="key" :class="{'active':tabIndex==item.id}" @click="getDetail(item.id)">
        {{ item.value }}
        <span>
          <img v-if="tabIndex==item.id && showTop" src="@/assets/images/icon/fundTop.png" alt="">
          <img v-else src="@/assets/images/icon/fundTopB.png" alt="">
        </span>
        <span>
          <img v-if="tabIndex==item.id && showDown" src="@/assets/images/icon/fundDown.png" alt="">
          <img v-else src="@/assets/images/icon/fundDownB.png" alt="">
        </span>
<!--        <img v-if="tabIndex==item.id" src="@/assets/images/icon/foundTab.png" alt="">-->
<!--        <img v-else src="@/assets/images/icon/foundTabB.png" alt="">-->
      </span>
    </div>
    <div class="list">
      <div v-for="(item,index) in list" :key="index" @click="toFund(item)">
        <div class="title">
          <span>{{ item.FUND_NAME }}</span>
          <span>累计投资项目数{{ item.PROJ_COUNT }}个</span>
        </div>

        <div class="bottom">
          <div>
            <div>IRR</div>
            <div>{{ item.IRR?item.IRR: '--' }}</div>
          </div>
          <div>
            <div>DPI</div>
            <div>{{ item.DPI?item.DPI:'--' }}</div>
          </div>
          <div>
            <div>TVPI</div>
            <div>{{ item.TVPI?item.TVPI:'--' }}</div>
          </div>
          <div>
            <div>IRR调整后</div>
            <div>{{ item.PIC?item.PIC:'--'}}</div>
          </div>
        </div>
      </div>
    </div>
    <blank v-if="list&&list.length==0"/>
    <bottom v-if="list.length>5"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      showIndex: 0,
      showTop: false,
      showDown: true,
      cattitle: this.$route.query.timeName,
      tabFound: [
        {
          id: 'irr',
          value: 'IRR'
        },
        {
          id: 'dpi',
          value: 'DPI'
        },
        {
          id: 'tvpi',
          value: 'TVPI'
        },
        {
          id: 'pic',
          value: 'IRR调整后'
        }
      ],
      tabIndex: '',
      searchId: '',
      orderType: 'desc'
    }
  },
  mounted() {
    this.getNowTime()
    this.getDetailList()
  },
  methods: {
    getDetailList() {
      let time = ''
      if (this.$route.query.time) {
        time = this.$route.query.time
      }
      const URL = '/fundCharts/fundListData'
      this.$axios.postJson(URL, {
        valuDt: time,
        groupId: '',
        orderColumn: this.tabIndex,
        searchId: this.searchId,
        orderType: this.orderType
      }).then(res => {
        this.list = res.fundList
      })
    },
    search() {
      this.$refs.searchInput.blur()
      this.getDetailList()
    },
    getDetail(id) {
      if (this.tabIndex != id) {
        this.showIndex = 0
      }
      this.tabIndex = id
      this.showIndex++
      const showTopOrDown = this.showIndex % 3
      switch (showTopOrDown) {
        case 0:
          this.showDown = false
          this.showTop = false
          this.orderType = ''
          break
        case 1:
          this.showDown = true
          this.showTop = false
          this.orderType = 'desc'
          break
        case 2:
          this.showDown = false
          this.showTop = true
          this.orderType = 'asc'
          break
        default:
          this.showDown = true
          this.showTop = false
      }
      console.log('showTopOrDown', showTopOrDown)
      console.log(this.showTop, this.showDown)
      this.getDetailList()
    },
    toFund(item){
      this.$axios.get(`/fundInfoDetail/${item.FUND_ID}`,
        null,
        res => {
          if (res.status === '0') {
            // this.detail = res.data.model
            this.storage.set('fundDetail', res.data.model)
            this.$router.push({ path: '/fund', query: { id: item.FUND_ID }})
          }
        }
      )
    },
    getNowTime() {
      const myDate = new Date()
      const month = myDate.getMonth() + 1
      if(this.$route.query.time){
        this.cattitle = this.$route.query.timeName
        return
      }
      if (month >= 2 && month <= 7) {
        this.cattitle = `${new Date().getFullYear() - 1}年12月31日`
      } else if (month < 2) {
        this.cattitle = `${new Date().getFullYear() - 1}年06月30日`
      } else {
        this.cattitle = `${new Date().getFullYear()}年06月30日`
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .yh-search {
    overflow: visible!important;
    position: relative;
    padding:30px;
    margin-bottom: 0;
    background: #F8F8F8;
    input {
      text-align: left!important;
      padding-left: 86px;
      margin:0;
      height:68px;
    }
    .searIcon {
      position: absolute;
      top: 42px;
      left: 49px;
      background-repeat: no-repeat;
      font-size: .426667rem;
      width: 45.5px;
      height: 45.5px;
      background-size: 100% 100%;
      &::before{
        content:""
      }
    }
  }
  .tabs-con-globle{
    background: white;
    margin-bottom:18px;
    >span{
      font-size:26px!important;
      color:#9E9E9D;
      margin:30px 40px;
      padding:0;
      padding-right:25px;
      position: relative;
      span{
        /*width:14px;*/
        /*height:9px;*/
        padding:0;
        vertical-align: top;
        position: absolute;
        img{
          width:14px;
          height:9px;
          vertical-align: top;
        }
      }
      span:nth-of-type(1){
          top:0;
          right:0
      }
      span:nth-of-type(2){
        bottom:0;
        right:0;
        vertical-align: bottom;
        img{
          vertical-align: bottom;
        }
      }
    }
    >span.active{
      font-size:26px!important;
      color:#B60005
    }
    .active:after{
      top:40px;
      left: calc(50% - 35px);
    }
  }
</style>
