<template>
  <div class="has-comment">
    <headerx cat-title="来访接待" page-type="back" @closeBack="$router.replace({path: '/'})">
      <template slot="right">
        <div class="right-btn" style="position:relative;top: -2px;">
          <span class="yh-add-more" @click="filterPopup">
            <img
              src="@/assets/images/icon/filter.png"
              alt="分类搜索"
              class="classify-search"
            >
          </span>
          <span class="yh-add-more" @click="$router.push({path: '/visitAdd'})">
            <img
              src="@/assets/images/icon/add.png"
              alt="添加"
              class="classify-search"
            >
          </span>
        </div>
      </template>
    </headerx>
    <div class="comment-content no-comment yh-new-list">
      <van-pull-refresh v-model="isloading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
          class="refresh-box"
        >
          <form action class="yh-search" @submit.prevent="search">
            <img src="@/assets/images/icon/search-img.png" class="search-img">
            <input
              ref="searchInput"
              v-model="pageInfo.params.searchId"
              type="search"
              placeholder="搜索"
              @search="search"
            >
          </form>
          <tags
            :filter-list="filterList"
            :list="selectList"
            key-code="columnName"
            @del-item="searchConfirm"
          />
          <list-item :list="list" :setting="listSetting" right-arrow @to="goDetail">
            <template slot="tit-right" slot-scope="scope">
              <ul class="filterTags">
                <!-- <li v-if="activeArr.includes('currWeek')" class="currWeek">本周</li>
                <li v-if="activeArr.includes('currMonth')" class="currMonth">本月</li>
                <li v-if="activeArr.includes('currYear')" class="currYear">当年</li> -->
                <li v-if="scope.item.IS_START=='start'" class="start">进行中</li>
                <li v-if="scope.item.IS_START=='finish'" class="finish">已结束</li>
                <li v-if="scope.item.IS_START=='noStart'" class="noStart">未开始</li>
              </ul>
            </template>
          </list-item>

          <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0" style="height: calc(100vh - 120px)"/>
          <bottom v-if="!pageInfo.isLoading&&isLoadAll&&list.length>4"/>

        </div>
      </van-pull-refresh>

    </div>
    <search-filter
      ref="rightPopup"
      :filter-list="filterList"
      class="filter-list"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
  </div>
</template>

<script>
// import { filterArr } from '@/utils/common.js'
export default {
  name: '',
  components: {
    'list-item': () => import('@/components/listItem/index'),
    'search-filter': () => import('@/components/rightPopup/half'),
    'Tags': () => import('@/components/tags/index')
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
          selectVisitSource: '',
          selectVisitTime: '',
          selectVisitOrg: ''
        },
        postType: 'post',
        list: [],
        postUrl: '/ReceptionSheetAction/search.do'
      },
      list: [],
      listSetting: {
        title: { name: 'VISIT_COMPANY' },
        form: [
          {
            label: '来访人员',
            name: 'VISIT_PERSON_LIST'
          },
          {
            label: '来源渠道',
            name: 'VISIT_SOURCE_NAME'
          },
          {
            label: '到达时间',
            name: 'VISIT_TIME'
          }
        ]
      },
      filterList: [
        {
          name: '来源渠道',
          subList: [],
          labelName: 'columnName',
          labelId: 'columnId'
        },
        {
          name: '来访时间',
          subList: [],
          labelName: 'columnName',
          labelId: 'columnId'
        },
        {
          name: '接待单位',
          subList: [],
          labelName: 'columnName',
          labelId: 'columnId'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  activated() {
    if (this.$route.query.reload) {
      this.getList(true)
    }
  },
  created() {
    this.getFilterList()
    this.getList(true)
  },
  mounted() {},
  // activated() {
  //   console.log(1)
  // },
  methods: {
    getFilterList() {
      this.$axios.get('/ReceptionSheetAction/getClassifiedSearch.do', {}, res => {
        this.filterList[0].subList = res.dataContent[0].classList
        this.filterList[1].subList = res.dataContent[1].classList
        this.filterList[2].subList = res.dataContent[2].classList
      })
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.list = res.list
          this.isloading = false
        }
      )
    },

    filterPopup() {
      this.$refs.rightPopup.showPopup()
    },
    searchConfirm() {
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
      const arr1 = []
      for (let i = 0; i < this.filterList.length; i++) {
        if (this.filterList[i].checkIds) {
          for (let k = 0; k < this.filterList[i].subList.length; k++) {
            if (this.filterList[i].subList[k].isChecked) {
              this.filterList[i].subList[k].sindex = i
              this.filterList[i].subList[k].index = k
              arr1.push(this.filterList[i].subList[k])
            }
          }
        }
      }
      this.selectList = Array.from(new Set(arr1))
      this.selectList.forEach(element => {
        element.label = element.columnName
        element.value = element.columnId
      })
      this.pageInfo.params.selectVisitSource = this.filterList[0].checkIds
      this.pageInfo.params.selectVisitTime = this.filterList[1].checkIds
      this.pageInfo.params.selectVisitOrg = this.filterList[2].checkIds
      this.search()
    },
    searchReset() {
      this.selectList = []
      this.pageInfo.params.selectVisitSource = ''
      this.pageInfo.params.selectVisitTime = ''
      this.pageInfo.params.selectVisitOrg = ''
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
      // this.$axios.post(
      //   '/ReceptionSheetAction/detail.do',
      //   {
      //     applyNo: item.APPLY_NO
      //   },
      //   res => {
      //     if (
      //       res.dataContent[0].STATUS === '3' &&
      //       this.storage.get('yh-user').userId !== res.dataContent[0].MANAGER_ID
      //     ) {
      //       this.Toast('您没有编辑权限')
      //     } else {
      this.$router.push({ path: 'visitDetail', query: { APPLY_NO: item.APPLY_NO }})
      //     }
      //   }
      // )
    }
  }
}
</script>
<style lang="scss" scoped>
.refresh-box{
  min-height: calc(100vh - 120px)
}
.yh-search{
  background: #f5f5f5 !important;
  padding-bottom: 10px;
}
.classify-search {
  width: 44px;
}
.right-btn{
  span{
    padding: 10px 0 10px 10px;
  }
}
</style>
