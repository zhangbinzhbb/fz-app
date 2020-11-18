<template>
  <div class="has-comment">
    <!-- 分类筛选 -->
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="pageInfo.isLoading"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false"
      >
        <form class="yh-search" action @submit.prevent="search">
          <input
            id="searchbox"
            ref="searchInput"
            v-model="pageInfo.params.searchId"
            type="search"
            placeholder="公司/姓名/工作经历/职称/学历/学校/专业/婚育/证书/性别"
          >
          <van-icon :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}" name="search" class="searIcon"/>
        </form>
        <van-tabs active="halfYear" @click="onClick">
          <van-tab id="currMonth" title="本月" name="currMonth">本月</van-tab>
          <van-tab id="oneMonth" title="近一个月" name="oneMonth">近一个月</van-tab>
          <van-tab id="halfYear" title="近半年" name="halfYear">近半年</van-tab>
          <van-tab id="currYear" title="当年" name="currYear">当年</van-tab>
          <van-tab id="lastYear" title="上一年" name="lastYear">上一年</van-tab>
          <van-tab id="custom" title="自定义" name="custom">自定义</van-tab>
        </van-tabs>
        <!--日期选择-->
        <div v-if="pageInfo.params.dataType=='custom'" class="date-search-box">
          <span
            class="datepicker-item"
            @click="openDatePicker('startDate')"
          >{{ pageInfo.params.startDate }}</span>
          <span :style="{backgroundImage:'url('+require('@/assets/images/icon/fundDownB.png')+')'}" class="dateIcon" @click="openDatePicker('startDate')"/>
          至
          <span
            class="datepicker-item"
            @click="openDatePicker('endDate')"
          >{{ pageInfo.params.endDate }}</span>
          <span :style="{backgroundImage:'url('+require('@/assets/images/icon/fundDownB.png')+')'}" class="dateIcon" @click="openDatePicker('endDate')"/>
          <!--          <van-icon @click="search" :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}" name="" class="searIcon"/>-->
        </div>
        <van-popup v-model="datePicker.show" position="bottom">
          <van-datetime-picker
            :formatter="formatter"
            v-model="currentDate"
            type="date"
            class="yh-datePicker"
            @cancel="datePicker.show = false"
            @confirm="dateConfirm"
          />
        </van-popup>

        <div v-for="(item,index) in pageInfo.list" :key="index" style="background: #fff">
          <div class="tar-lv2-son tar-lv2-son-new" @click="toResume(item.personId)">
            <div class="leftdismiss">
              <div class="pic">
                <!--                <img :src="item.facePath" alt>-->
                <img v-if="item.facePath && item.facePath!=''" :src="item.facePath" alt="">
                <div v-else :style="{backgroundColor: item.color}" class="nameImg">{{ filterImg(item.trueName) }}</div>
              </div>
              <span class="name">{{ item.trueName }}</span>
            </div>
            <div class="right-dismiss">
              <span>{{ item.corp | filtercom }}</span>
              <span>离职：{{ item.dimissionDate | filterDate }}</span>
              <span>入职：{{ item.attendonDate | filterDate }}</span>
            </div>
            <!-- <div class="rightdismiss">
              <div class="company">
                {{ item.corp | filtercom }}
              </div>
              <div class="deptName" style="">
                <span>{{ item.deptName }}</span>
                <span>{{ item.jobCode }}</span>
              </div>
              <div class="attendonDate" style="text-align:left;">
                离职:<span>{{ item.dimissionDate | filterDate }}</span>  入职:<span>{{ item.attendonDate | filterDate }}</span>
              </div>
            </div> -->
          </div>
        </div>

        <!--<blank v-if="!showBlank"></blank>-->
      </div>
      <!-- </van-pull-refresh> -->
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length>5"/>
    </div>
    <search-filter
      ref="rightPopup"
      :flag-arr="flagArr"
      :filter-list="filterList"
      page="mail"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
  </div>
</template>

<script>
import { filterArr } from '@/utils/common.js'
export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half'),
    more: () => import('@/components/more/index')
  },
  filters: {
    filterDate(val) {
      if (val === '') {
        return
      }
      const arr = val.replace(/-/g, '/')
      return arr
    },
    filtercom(val) {
      if (val === '') {
        return '--'
      }

      return val
    }
  },
  data() {
    return {
      datePicker: {
        show: false
      },
      currentDate: new Date(),
      formatter(type, value) {
        if (type === 'year') {
          return `${value}`
        } else if (type === 'month') {
          return `${value}`
        }
        return value
      },
      isLoading: false,
      flagArr: [],
      catTitle: '离职人员',
      isShow: false,
      isShow1: false,
      isShow2: false,
      showBlank: true,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 13,
          searchId: '',
          isQuit: 1,
          // dataType: ''
          dataType: 'halfYear',
          startDate: new Date().getFullYear() + '-01-01',
          endDate: new Date().getFullYear() + '-12-31'
        },
        list: [],
        // postType: 'postJson',
        postUrl: '/ehrCVAction/search.do'
      },
      filterList: [
        {
          name: '公司',
          subList: [],
          labelName: 'NAME',
          labelId: 'ID'
        },
        {
          name: '部门',
          subList: [],
          labelName: 'NAME',
          labelId: 'ID'
        }
      ],
      selectList: []
    }
  },
  watch: {
    // '$route.name'(val) {
    //   this.pageInfo = {
    //     params: {
    //       IS_PAGE: true,
    //       curPage: 1,
    //       pageSize: 13,
    //       searchId: '',
    //       isQuit: 1,
    //       dataType: ''
    //     },
    //     list: [],
    //     // postType: 'postJson',
    //     postUrl: '/ehrCVAction/search.do'
    //   }
    //   this.selectList = []
    //   this.pageInfo.params.ORGID = ''
    //   this.pageInfo.params.DEPTID = ''
    //   this.getList(true)
    // },
    'pageInfo.params.dataType'(val) {
      if (val) {
        this.pageInfo.params.searchId = ''
        if (val === 'custom') {
          console.log(val)
          this.pageInfo.params.startDate = new Date().getFullYear() + '-01-01'
          this.pageInfo.params.endDate = new Date().getFullYear() + '-12-31'
          this.getList(true)
        } else {
          this.getList(true)
        }
      }
    }
  },
  created() {
    this.getList(true)
    this.getFilterList()
    console.log(this.pageInfo)
  },
  activated() {
    if (this.storage.get('refresh-dismiss-list')) {
      this.getList(true)
      this.storage.get('refresh-dismiss-list')
      this.storage.remove('refresh-dismiss-list')
    }
  },
  methods: {
    toResume(id) {
      const page = '0'
      this.$router.push({
        path: '/dismissDetail',
        query: { id, page }
      })
    },
    filterImg: function(val) {
      if (val && val != '') {
        return val.substring(val.length - 1, val.length)
      }
    },
    onClick(event) {
      this.pageInfo.params.dataType = `${event}`
      this.getList(true)
    },
    handleClick() {
      this.$refs.rightPopup.showPopup()
    },
    getFilterList() {
      this.$axios.get('/MyContactAction/getOrgList.do', {}, res => {
        this.filterList[0].subList = res.dataContent
      })
    },
    searchConfirm(obj) {
      const getChecked = (list, keyWord) => {
        const arr = []
        list.map(item => {
          if (item.isChecked) {
            arr.push(item[keyWord])
          }
        })
        return arr.join()
      }
      this.filterList.map(item => {
        item.checkIds = getChecked(item.subList, item.labelId)
      })
      // tags-select-fiter
      this.selectList = Array.from(new Set(filterArr(this.filterList)))
      // 新增条件
      if (obj !== undefined && obj.sindex === '0') {
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].sindex === 1) {
            this.selectList.splice(i, 1)
            i = i - 1
          }
        }
        this.flagArr = this.selectList
        this.$set(this.filterList[1], 'checkIds', '')
      }

      this.pageInfo.params.ORGID = this.filterList[0].checkIds
      this.pageInfo.params.DEPTID = this.filterList[1].checkIds
      this.getList(true)
    },
    popupConfirm() {
      this.$refs.timePicker.showPicker()
    },
    searchReset() {
      this.selectList = []
      this.pageInfo.params.ORGID = ''
      this.pageInfo.params.DEPTID = ''
      this.getList(true)
    },
    search() {
      this.$refs.searchInput.blur()
      if (this.pageInfo.params.searchId) {
        this.pageInfo.params.dataType = ''
        this.pageInfo.params.startDate = ''
        this.pageInfo.params.endDate = ''
      }
      const searchTrue = this.compareDate(this.pageInfo.params.startDate, this.pageInfo.params.endDate)
      if (searchTrue) {
        this.getList(true)
      }
    },
    compareDate(date1, date2) {
      var oDate1 = new Date(date1)
      var oDate2 = new Date(date2)
      if (oDate1.getTime() > oDate2.getTime()) {
        this.Toast('开始时间不能早于结束时间')
        return false
      } else {
        return true
      }
    },
    dataSearch(params) {
      this.pageInfo.params.dataType = params
      this.pageInfo.params.searchId = ''
      this.getList(true)
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          console.log(res)
          this.isLoading = false
          if (this.pageInfo.list.length > 0) {
            this.showBlank = true
          } else {
            this.showBlank = false
          }
        },
        err => {
          this.isLoading = false
        }
      )
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      // ;(this.pageInfo = {
      //   params: {
      //     IS_PAGE: true,
      //     curPage: 1,
      //     pageSize: 13,
      //     searchId: ''
      //   },
      //   list: [],
      //   // postType: 'postJson',
      //   postUrl: '/ehrCVAction/search.do'
      // }),
      this.getList(true)
    },

    // 离职日期查询
    openDatePicker(dateName) {
      this.datePicker.show = true
      this.datePicker.value = new Date(
        typeof this.pageInfo.params[dateName] === 'string'
          ? this.pageInfo.params[dateName].replace(/-/g, '/')
          : this.pageInfo.params[dateName]
      )
      this.datePicker.dateName = dateName
      setTimeout(() => {
        this.datePicker.show = true
        // this.$refs.datePicker.showPicker()
      })
    },
    dateConfirm(val) {
      const dateName = this.datePicker.dateName
      this.pageInfo.params[dateName] = this.formatDateTime(val, 'yyyy-MM-dd')
      this.datePicker.show = false
      if (dateName === 'endDate') {
        this.search()
      }
    },
    dateCancel() {
      this.datePicker.show = false
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .van-tabs__content{
    display: none!important;
  }
  .classify-search {
    width: 68px;
    margin-top: 10px;
  }
  .labelsShow {
    text-align: left;
    background: #fff;
    border-bottom: 2px solid#dfdcdc;
    padding: 0 0 10px 8px;
    span {
      color: rgba(183, 0, 7, 1);
      border: 1px solid rgba(183, 0, 7, 1);
      font-size: 25px;
      padding: 10px;
      margin: 5px;
      display: inline-block;
      margin-right: 10px;
      /*font-weight: lighter;*/
    }
  }
  .right-dismiss{
    display: flex;
    flex-direction: column;
    span{
      text-align: right;
      font-size:26px!important;
      font-weight:500!important;
      color:rgba(158,158,157,1) !important;
      &:nth-child(1){
        font-size:28px!important;
        font-weight:500!important;
        color:rgba(76,76,76,1)!important;
      }
      &+span{
        padding-top: 14px;
      }
    }
  }
  .approval-form {
    width: 573px;
    height: 91px;
    background: rgba(183, 0, 7, 1);
    border-radius: 5px 5px 5px 5px;
    color: white;
    font-size: 36px;
    margin-top: 20px;
  }
  .titaltop {
    text-align: center;
    color: #000;
    font-size: 32px;
    padding: 26px;
    background: #fff;
  }
  .buttop {
    padding: 20px 0;
    text-align: center;
    font-size: 24px;
    background: #fff;
    .iconbut {
      transform: rotate(90deg);
      font-size: 22px;
      line-height: 24px;
      width: 50px;
    }
  }
  .butcon {
    border-left: 2px solid#ccc;
    border-right: 2px solid#ccc;
    box-sizing: border-box;
  }
  .butcontent {
    width: 94.5%;
    position: fixed;
    background: #fff;
    padding: 20px 18px 20px 18px;
    border-top: 2px solid#dfdcdc;
    border-bottom: 2px solid#dfdcdc;
    z-index: 100px;
    .butbox {
      .but {
        font-size: 24px;
        padding: 7px 20px;
        border-radius: 10px;
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
        float: left;
        margin: 0 10px 25px 12px;
      }
    }
  }
  .tar-lv2-son-new {
    display: flex;
    justify-content: space-between;
    padding:18px 40px 10px 40px!important;
    .leftdismiss {
      width:100px;
      margin-right:44px;
      padding-top:5px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .pic {
        width: 80px;
        height: 80px;
        img{
          width:80px;
          height:80px;
          border-radius: 50%;
        }
        div{
          width:80px;
          height:80px;
          border-radius: 50%;
          text-align: center;
          line-height: 80px;
          font-size:30px;
          color:rgba(255,255,255,1);
        }
      }
      .name {
        margin-right: 0px;
        text-align: center;
        width: 100%;
        display: inline-block;
        vertical-align: top;
        margin-top: 10px;
        font-size: 24px;
        font-family: PingFangSC-Medium,PingFang SC;
        font-weight: 500;
        color: rgba(76,76,76,1);
        line-height: 33px;
      }
    }
    .rightdismiss {
      margin-top: -12px;
      width: 90%;
      padding: 15px 0px;
      text-align:right;
      >div{
        margin-bottom:10px;
      }
      .company{
        font-size:28px;
        font-weight:500;
        padding-right:8px;
        color:rgba(76,76,76,1);
        line-height:40px;
      }
      .attendonDate {
        font-size:24px;
        /*padding-right:8px;*/
        font-weight:400;
        text-align: right!important;
        color:rgba(158,158,157,1);
        line-height:33px;
        span {
          margin-top: 0;
          margin-right: 0;
          padding:0 8px
        }
      }
      .deptName {
        font-size: 21px;
        color: #888888;
        margin-top: 18px;
        margin-bottom: 18px;
        span{
          font-size:22px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(3,170,74,1);
          line-height:30px;
          padding:7px 12px;
          background:rgba(58,204,120,0.23);
          margin-right:14px;
        }
        span:last-child{
          color:rgba(49,149,252,1);
          background:rgba(49,149,252,0.23);
        }
      }
    }
  }
  .tar-lv2-son {
    overflow: hidden;
    padding: 16px;
    background-color: #fff;
    border-bottom: 18px solid #f0f0f0;
    .tital1 {
      font-size: 33px;
      color: #000;
    }
    p {
      font-size: 26px;
      color: rgba(68, 68, 68, 1);
      // line-height: 45px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      .position {
        font-size: 28px;
        color: #000;
      }
      .phone {
        font-size: 26px;
      }
    }
    img {
      /*position: absolute;*/
      /*right: 22px;*/
      /*top: 36px;*/
      /*float: right;*/
      /*width: 128px;*/
      /*height: 115px;*/
      /*border-radius: 10px;*/
    }
    span {
      font-size: 21px;
      color: #888888;
      // margin: 25px 22px 0px 0;
      // z-index: 50px;
    }
    #time {
      display: block;
      margin-top: 7px;
    }
  }
  // 搜索框
  .yh-search {
    overflow: visible!important;
    position: relative;
    padding:30px;
    margin-bottom: 0;
    background: #FFF;
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
  .date-search-box {
    margin-top: 20px;
    margin-bottom: 20px;
    padding-top:30px;
    padding-bottom:30px;
    font-size: 28px;
    color:#000;
    text-align: center;
    background: #fff;
    span{
      color:#9E9E9D;
    }
    i {
      width: 14px;
      height: 9px;
      background-size: 100% 100%;
      display: inline-block;
      vertical-align: middle;
      margin:0 15px;
    }
    span.datepicker-item{
      margin-left: 15px;
    }
    span.dateIcon{
      width: 14px;
      height: 9px;
      background-size: 100% 100%;
      display: inline-block;
      vertical-align: middle;
      margin:0 15px;
    }
  }
  /deep/ .van-tabs__line{
    bottom:45px!important;
  }
  .yh-blank {
    padding-top: 200px !important;
  }
</style>
