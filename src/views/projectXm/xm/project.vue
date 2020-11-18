<template>
  <div class="has-comment project-home">
    <headerx cat-title="项目(项目维度)">
      <template slot="right">
        <span class="yh-add-more" @click="handleClick">
          <img
            src="@/assets/images/icon/filter.png"
            alt="分类搜索"
            class="classify-search"
          >
        </span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false">
          <form class="yh-search" action @submit.prevent="search">
            <img src="@/assets/images/icon/search-img.png" class="search-img">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyword"
              type="search"
              placeholder="请输入项目名称/企业名称/项目经理"
            >
          </form>
          <div class="project-container">
            <project-list v-for="(item,index) in pageInfo.list" :key="index" :field="item" @click.native="toDetail(item)"/>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0&&pageInfo.list.length>3"/>
    </div>
    <search-filter
      ref="rightPopup"
      :flag-arr="flagArr"
      :filter-list="filterList"
      :column-ajax="true"
      :location-index="2"
      class="filter-list"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
    <short-cut/>
    <loading-box v-model="showLoading"/>
  </div>
</template>

<script>
export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half'),
    'short-cut': () => import('@/components/shortcut/index'),
    'project-list': () => import('../components/xmList')
  },
  data() {
    // 项目状态、管理平台、出资主体
    return {
      pageInfo: {
        params: {
          currPage: 1,
          pageSize: 10,
          groupId: '',
          inveId: '',
          keyword: '',
          myOrAll: 'all',
          projDateStatus: '',
          projStatus: '',
          projStartTime: '',
          projEndTime: ''
        },
        list: [],
        postType: 'postJson',
        postUrl: '/projectPC/listViewIdMy'
      },
      filterList: [
        {
          name: '项目状态',
          subList: [
            { label: '储备项目', value: '2' },
            { label: '立项中', value: '3' },
            { label: '已立项', value: '4' },
            { label: '决策中', value: '15' },
            { label: '已决策', value: '5' },
            { label: '协议已签署', value: '6' },
            { label: '已出资', value: '11' },
            { label: '已部分退出', value: '13' },
            { label: '已退出', value: '14' },
            { label: '已中止', value: '9' },
            { label: '已废弃', value: '8' }
          ],
          labelName: 'label',
          labelId: 'value'
        },
        {
          name: '管理平台',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        },
        {
          name: '出资主体',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        }
      ],
      flagArr: [],
      isLoading: false,
      showLoading: true
    }
  },
  created() {
    this.getCodeByParentId(266, '管理平台', 'subList')
    this.getList(true)
  },
  methods: {
    onRefresh() {
      this.getList(true)
    },
    loadMore() {
      this.getList(false)
    },
    setFilterInit(label, valueLabel, value) {
      this.filterList.map((item, index) => {
        if (item.name === label) {
          this.$set(this.filterList[index], valueLabel, value)
        }
      })
    },
    // search-filter 分类筛选
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
      this.pageInfo.params.projStatus = this.filterList[0].checkIds // 项目状态
      this.pageInfo.params.groupId = this.filterList[1].checkIds // 管理平台
      this.pageInfo.params.inveId = this.filterList[2].checkIds // 出资主体
      this.getList(true)
    },
    searchReset() {
      this.pageInfo.params.projStatus = ''
      this.pageInfo.params.groupId = ''
      this.pageInfo.params.inveId = ''
      this.getList(true)
    },
    getCodeByParentId(parentId, label, value) {
      // 266 - 管理平台
      const URL = '/commonTCode/getCodeByParentId'
      return new Promise((resolve, reject) => {
        this.$axios.get(
          URL,
          {
            parentId
          },
          res => {
            const options = res.data.options
            this.setFilterInit(label, value, options)
            resolve(res.data.options)
          }
        )
      })
    },
    handleClick() {
      this.$refs.rightPopup.showPopup()
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          this.showLoading = false
        }
      )
    },
    toDetail(item) {
      const dataObj = JSON.parse(JSON.stringify(item))
      this.storage.set('groupObj', dataObj)
      this.$router.push({ path: '/projectXmDetail' })
    }
  }
}
</script>

<style lang="scss">
.project-home{
  .yh-search{
    background:rgba(248,248,248,1);
  }
  .comment-content{
    position: relative;
  }
}
</style>

