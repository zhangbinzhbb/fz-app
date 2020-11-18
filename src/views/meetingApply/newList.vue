<template>
  <div class="has-comment meeting-apply-comment">
    <headerx cat-title="申请记录" page-type="back" @closeBack="$router.push({path: '/meetingRoom'})"/>
    <div class="comment-content no-comment comment-meeting-apply">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          :class="{'infinite-scroll':Datelist.length===0}"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <!--搜索-->
          <form class="yh-search" action @submit.prevent="search">
            <img src="@/assets/images/icon/search-img.png" class="search-img">
            <input
              ref="searchInput"
              v-model="pageInfo.params.searchId"
              type="search"
              placeholder="搜索会议室/会议主题"
            >
          </form>
          <!-- 筛选 -->
          <div class="timeFilter">
            <p
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :class="item.checked?'active':''"
              @click="selected(item)"
            >{{ item.label }}</p>
          </div>
          <!-- 列表 -->
          <list-item :list="Datelist" :setting="listSetting" @to="goDetail">
            <template slot="tit-right" slot-scope="scope">
              <ul class="filterTags">
                <li v-if="activeArr.includes('currWeek')" class="currWeek">本周</li>
                <li v-if="activeArr.includes('currMonth')" class="currMonth">本月</li>
                <li v-if="activeArr.includes('currYear')" class="currYear">当年</li>
                <li v-if="scope.item.IS_START=='start'" class="start">进行中</li>
                <li v-if="scope.item.IS_START=='finish'" class="finish">已结束</li>
                <li v-if="scope.item.IS_START=='noStart'" class="noStart">未开始</li>
              </ul>
            </template>
          </list-item>
          <!-- 数据不能再获取 -->
          <bottom v-if="!pageInfo.isLoading&&isLoadAll&&Datelist.length!=0&&Datelist.length>3"/>
          <blank v-if="Datelist.length===0"/>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MeetingFile',
  components: {
    'list-item': () => import('@/components/listItem/index')
  },
  data() {
    return {
      activeArr: [],
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
        }, {
          value: 'start',
          label: '进行中',
          checked: false
        }, {
          value: 'finish',
          label: '已结束',
          checked: false
        }, {
          value: 'noStart',
          label: '未开始',
          checked: false
        }
      ],
      isLoading: false,
      listSetting: {
        title: { name: 'MEETING_NAME' },
        form: [
          {
            label: '会议室',
            name: 'MEETING_ROOM_NAME'
          },
          {
            label: '开始时间',
            name: 'MEETING_START_TIME'
          },
          {
            label: '结束时间',
            name: 'MEETING_END_TIME'
          },
          {
            label: '参与人员',
            name: 'MEETING_USER'
          }
        ]
      },
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          searchId: this.searchId,
          time: '',
          searchType: ''
        },
        list: [],
        postUrl: '/MyApplyMeetingAction/meetingList.do'
      },
      Datelist: [],
      updete_NO: ''
    }
  },
  created() {
    this.getList()
  },
  activated() {
    if (this.storage.get('refresh-meeting-list')) {
      this.getList(true)
      this.storage.remove('refresh-meeting-list')
    }
  },
  methods: {
    selected(item) {
      item.checked = !item.checked
      if (item.checked) {
        this.activeArr.push(item.value)
      } else {
        const index = this.activeArr.indexOf(item.value)
        this.activeArr.splice(index, 1)
      }
      this.pageInfo.params.searchType = this.activeArr.join(',')
      this.getList(true)
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          this.Datelist = res.list
        }
      )
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    },
    cancel() {
      setTimeout(() => {
        this.isShow = false
      }, 100)
    },
    /* 删除会议 */
    onClickConfirm(item, index) {
      this.$dialog
        .confirm({
          title: '会议删除',
          message: '确定要删除该会议吗?'
        })
        .then(index => {
          this.$axios.post(
            '/MyApplyMeetingAction/removeMeeting.do',
            { APPLY_NO: "'" + item.APPLY_NO + "'" },
            res => {
              this.Toast('删除成功！')
              this.pageInfo.list.splice(index, 1)
            }
          )
        })
        .catch(() => {
          // this.Toast('取消成功！')
        })
    },
    /* 会议详情 */
    goDetail(item) {
      this.$router.push({
        path: '/meetingDetail',
        query: { APPLY_NO: item.APPLY_NO }
      })
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   if (from.name === 'meetingRoom') { // 处理页面缓存后，返回首页再次进入缓存页时数据为更新
  //     next(vm => {
  //       vm.pageInfo.params.searchId = ''
  //       vm.getList(true)
  //     })
  //   }
  //   next(vm => {})
  // }
}
</script>
<style lang="scss">
.meeting-apply-comment{
  .infinite-scroll{
    height: calc(100vh - 50px) !important;
  }
}
</style>

<style scoped lang="scss">

.comment-meeting-apply{
  .yh-search{
    background:rgba(248,248,248,1);
  }
}
.new-add {
  width: 68px;
  margin-top: 10px;
}
.pleaseright {
  padding: 2px 20px 2px 0;
  float: right;
}
.btn-del {
  margin-right: -15px;
}
.yh-search{
  position: relative;
}
.yh-search input{
  text-align: left;
  /*margin: 30px 0;*/
  // line-height: 68px;
  // height: 68px;
}
.yh-search .search-img{
  width: 40px;
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}
.van-picker-column__item{
  font-size: 20px;
}
.timeFilter {
  overflow: hidden;
  background: #fff;
  white-space: nowrap;
  overflow-x: auto;
  padding: 17px 40px;
  margin-bottom: 18px;
  p {
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    display: inline-block;
    padding: 13px 20px;
    line-height: 37px;
    margin-right: 15px;
    font-size: 26px;
    color:rgba(51,51,51,1);
    border-radius:4px;
    border:1px solid rgba(225,225,225,1);
  }
  .active {
    color: #b80008;
    border-color: #b80008;
    background: rgba(183, 0, 7, 0.1);
    font-weight: 600;
  }
}
.filterTags{
  display: flex;
  padding-top: 14px;
  li{
    width: 85px;
    height:37px;
    line-height: 37px;
    padding:5px;
    font-size:26px;
    text-align: center;
    font-weight: normal;
    &+li{
      margin-left: 20px;
    }
  }
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

</style>
