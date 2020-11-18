<template>
  <div class="has-comment project-home">
    <headerx cat-title="项目(企业维度)">
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
              placeholder="请输入项目名称/企业名称"
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
    'project-list': () => import('./components/projectList')
  },
  data() {
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
        postUrl: '/projectPC/listViewIdMyEnterpriaseForApp'
      },
      filterList: [
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
      list: [
        { name: '工商信息', img: 'gongshangxinxi', url: 'projectDetailBusiness' },
        { name: '基本信息', img: 'iconInfo', url: 'projectBasicInfo' },
        { name: '更新记录', img: 'iconRefresh', url: 'projectChangeRecord' },
        { name: '投资信息', img: 'iconInvest', url: 'projectProgress' },
        { name: '项目进展', img: 'iconProgress', url: 'projectXmProgress' },
        { name: '后续融资', img: 'iconRong', url: 'projectFinancing' },
        { name: '定期报告', img: 'iconReport', url: 'projectAssess' },
        { name: '人事财务', img: 'iconMoney', url: 'projectMoney' },
        { name: '合同签署', img: 'iconContract', url: 'projectContract' },
        { name: '重要事项', img: 'zhongyaoshixiang', url: 'projectImportant' },
        { name: '上市公司公告', img: 'iconList', url: 'projectList' },
        { name: '现金流', img: 'iconCash', url: 'projectCash' },
        { name: '邮件往来', img: 'iconEmail', url: 'projectEmail' },
        { name: '文件库', img: 'wenjianku', url: 'projectFile' },
        { name: '关联社群', img: 'iconIm', url: 'projectCommunity' }
      ],
      flagArr: [],
      isLoading: false,
      showLoading: true,
      isLoadingAll: false
    }
  },
  created() {
    this.getCodeByParentId(266, '管理平台', 'subList')
    this.getList(true)
    // 移除
    this.storage.remove('gridList')
  },
  methods: {
    onRefresh() {
      this.getList(true)
    },
    loadMore() {
      if (this.isLoadingAll) return
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
      this.pageInfo.params.groupId = this.filterList[0].checkIds // 管理平台
      this.pageInfo.params.inveId = this.filterList[1].checkIds // 出资主体
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
          this.isLoadingAll = res.isAll
        }
      )
    },
    toDetail(item) {
      const dataObj = JSON.parse(JSON.stringify(item))
      this.storage.set('businessObj', dataObj)
      // 九宫格
      this.list.map((sitem, index) => {
        if (item.groupId !== '4' && sitem.name === '上市公司公告') {
          this.list.splice(index, 1)
        }
      })
      const gridData = JSON.parse(JSON.stringify(this.list))
      this.storage.set('gridData', gridData)
      this.$router.push({ path: '/projectDetail' })
    }
  }
}
</script>

<style lang="scss">
.project-home{
  .van-overlay {
    background-color: rgba(0, 0, 0, 0.4);
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .yh-search{
    background:rgba(248,248,248,1);
  }
  .comment-content{
    position: relative;
  }
}
</style>

