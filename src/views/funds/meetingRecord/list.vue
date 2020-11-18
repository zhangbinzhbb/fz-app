<template>
  <div class="">
    <headerx cat-title="会议记录"> <!-- page-type="back" @closeBack="backFunc" -->
      <template slot="right">
        <span
          class="yh-add-more"
          style="position:relative;top: -2px;"
          @click="$router.push({path:'fundsMeetingRecordAdd',query: $route.query})">
          <img
            src="@/assets/images/icon/add.png"
            alt="新增"
            class="classify-search"
          >
        </span>
      </template>
    </headerx>
    <div class="comment-content">
      <van-pull-refresh v-model="isloading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
          class="refresh-box"
        >
          <form action class="yh-search yh-mb-16" @submit.prevent="search">
            <img src="@/assets/images/icon/search-img.png" class="search-img">
            <input
              ref="searchInput"
              v-model="pageInfo.params.searchId"
              type="search"
              placeholder="搜索"
              @search="search"
            >
          </form>
          <div class="timeFilter">
            <p
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :class="item.checked?'active':''"
              @click="selected(item)"
            >{{ item.label }}</p>
          </div>
          <list-item :list="list" :setting="listSetting" right-arrow @to="goDetail">
            <template slot="tit-right" slot-scope="scope">
              <ul class="filterTags">
                <li v-if="activeArr.includes('currWeek')" class="currWeek">本周</li>
                <li v-if="activeArr.includes('currMonth')" class="currMonth">本月</li>
                <li v-if="activeArr.includes('currYear')" class="currYear">当年</li>
                <!-- <li v-if="scope.item.IS_START=='start'" class="start">进行中</li>
                <li v-if="scope.item.IS_START=='finish'" class="finish">已结束</li>
                <li v-if="scope.item.IS_START=='noStart'" class="noStart">未开始</li> -->
              </ul>
            </template>
          </list-item>

          <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0" style="height: calc(100vh - 180px)"/>
          <bottom v-if="!pageInfo.isLoading&&isLoadAll&&list.length>4"/>

        </div>
      </van-pull-refresh>

    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {
    'list-item': () => import('@/components/listItem/index')
  },
  props: {},
  data() {
    return {
      isloading: false,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          searchId: '',
          searchType: '',
          enteId: this.$route.query.enteId || ''
        },
        postType: 'postJson',
        list: [],
        postUrl: '/meetingRecordAction/search.do'
      },
      options: [
        {
          value: 'currWeek',
          label: '本周',
          checked: false
        }, {
          value: 'currMonth',
          label: '本月',
          checked: false
        }, {
          value: 'currYear',
          label: '当年',
          checked: false
        }
        // {
        //   value: 'start',
        //   label: '进行中',
        //   checked: false
        // }, {
        //   value: 'finish',
        //   label: '已结束',
        //   checked: false
        // }, {
        //   value: 'noStart',
        //   label: '未开始',
        //   checked: false
        // }
      ],
      activeArr: [], // 存储选择的时间
      list: [],
      listSetting: {
        title: { name: 'MEETING_TITLE' },
        form: [
          {
            label: '会议地点',
            name: 'MEETING_ROOM_NAME'
          },
          {
            label: '开始时间',
            name: 'MEETING_BEGIN_DATETIME'
          },
          {
            label: '结束时间',
            name: 'MEETING_END_DATETIME'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  activated() {
    this.getList(true)
  },
  created() {
    this.$axios.postJson('/meetingRecordAction/addBeforeShow.do', {}, res => {
      this.storage.set('mettingRecordBefShow', res.dataContent) // 该数据列表不需要，用于表单
    })
  },
  mounted() {

  },
  methods: {
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.list = res.list.map(i => {
            return Object.assign({}, i, { MEETING_BEGIN_DATETIME: i.MEETING_DATE + ' ' + i.MEETING_BEGIN_TIME, MEETING_END_DATETIME: i.MEETING_DATE + ' ' + i.MEETING_END_TIME })
          })
          this.isloading = false
        }
      )
    },
    selected(item) {
      item.checked = !item.checked
      if (item.checked) {
        this.activeArr.push(item.value)
      } else {
        const index = this.activeArr.indexOf(item.value)
        this.activeArr.splice(index, 1)
      }
      this.pageInfo.params.searchType = this.activeArr.join(',')
      this.search()
    },
    onRefresh() {
      this.search()
    },
    loadMore() {
      this.getList(false)
    },
    search() {
      this.getList(true)
    },
    goDetail(item) {
      this.$router.push({ path: 'fundsMeetingRecordDetail', query: { MEETING_ID: item.MEETING_ID, enteId: this.$route.query.enteId }})
    }
  }
}
</script>
<style lang="scss" scoped>
.refresh-box{
  min-height: calc(100vh - 140px)
}
.classify-search {
    width: 44px;
}
.timeFilter {
  overflow: hidden;
  background: #fff;
  white-space: nowrap;
  overflow-x: auto;
  padding: 17px 40px;
  p {
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border:1px solid rgba(225,225,225,1);
    display: inline-block;
    padding: 13px 20px;
    line-height: 37px;
    margin-right: 15px;
    font-size: 26px;
    color:rgba(51,51,51,1);
  }
  .active {
    color: #b80008;
    border-color: #b80008;
    background: rgba(183, 0, 7, 0.1);
    font-weight: 600;
  }
}
.filterTags li{
  width: 85px;
  height:37px;
  line-height: 37px;
  padding:5px;
  font-size:26px;
  text-align: center;
  font-weight: normal;
  display: inline-block;
}
.currWeek,.currMonth,.currYear{
  background:rgba(248,141,38,0.14);
  color:rgba(237,125,17,1);
}
.start{
  background:rgba(58,204,120,0.14);
  color:#03AA4A;
}
.finish{
  background:rgba(74,178,226,0.14);
  color: #4AB2E2
}
.noStart{
  background:rgba(158,181,194,0.14);
  color: #ACB5C3
}
// @import "../../common/styles/variable.scss";
// @import "../../common/styles/mixin.scss";
</style>
