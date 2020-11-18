<template>
  <div v-if="popupVisible">
    <van-popup
      v-model="popupVisible"
      :overlay="false"
      :class="{'sure-mySchedule-android':isAndroid12, 'oa-ios12':isIos12}"
      :style="{ width: '100%' }"
      position="right"
      class="menu yh-content has-comment common-tree-select-company">
      <headerx :cat-title="catTitle" page-type="back" @closeBack="closeBackHandle">
        <template slot="right">
          <span class="yh-add-more sure-btn yh-tree-header" @click="confirm">
            保存
          </span>
        </template>
      </headerx>
      <div class="comment-content no-comment">
        <div :class="{'tree-mySchedule-ios12':isIos12}" class="tree-page">
          <div :class="{'tree-mySchedule-android':isAndroid12,'sure-mySchedule-ios12':isIos12, 'tree-mySchedule-ios':isIos}" class="sure-content">
            <van-pull-refresh v-model="isLoading" @refresh="onRefreshs">
              <form class="yh-search" action @submit.prevent="search">
                <img src="@/assets/images/icon/search-img.png" class="search-img">
                <input
                  ref="searchInput"
                  v-model.trim="pageInfo.params.keyword"
                  :placeholder="searchTips"
                  type="search"
                >
              </form>
              <div class="empty" @click="changeEmpty">清空选择</div>
              <div class="radio-content">
                <div v-for="(item,index) in companyList" :key="index" class="radio-item" @click="changeRadio(item,index)">
                  <div class="radio-item-left">
                    <div v-if="item.isCheck" class="radio-check-y">
                      <span/>
                    </div>
                    <div v-else class="radio-check-n"/>
                  </div>
                  <div class="radio-item-right van-ellipsis">{{ item.label }}</div>
                </div>
              </div>
            </van-pull-refresh>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    catTitle: {
      type: String,
      default: null
    },
    defaultArray: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchTips: '搜索注册企业名称或输入未注册企业名称',
      popupVisible: false,
      pageInfo: {
        params: {
          IS_PAGE: true,
          currPage: 1,
          pageSize: 100,
          keyword: ''
        },
        list: [],
        postType: 'postJson',
        postUrl: '/entBaseInfo/list'
      },
      isLoading: false,
      companyList: [],
      sureList: []
    }
  },
  created() {
    this.onRefresh()
  },
  methods: {
    closeBackHandle() {
      this.closePopup()
    },
    showPopup() { // 打开弹出层
      this.popupVisible = true
    },
    closePopup(val) { // 关闭弹出层
      this.popupVisible = false
    },
    onRefresh() {
      // const companyList = JSON.parse(localStorage.getItem('company-list'))
      // if (companyList) {
      //   this.companyList = companyList
      //   return
      // }

      // 选择项目 - 选择企业
      this.pageInfo.postType = 'get'
      this.pageInfo.postUrl = '/projectProgress/selectProject'
      this.searchTips = '搜索项目名称或输入项目名称'

      this.getList(true)
    },
    onRefreshs() {
      this.getList(true)
    },
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {
        const data = res.list
        const arr = data.map(item => {
          return {
            label: item.projName,
            value: item.projId,
            groupId: item.groupId + '',
            inveId: item.inveId,
            inveName: item.inveName,
            projObject: item.projObject,
            projObjectName: item.projObjectName,
            projStatus: item.projStatus,
            isCheck: false
          }
        })
        const arr1 = JSON.parse(JSON.stringify(arr))
        this.companyList = arr
        this.storage.set('company-list', arr1)
        this.isLoading = false
      })
    },
    changeRadio(item, index) {
      this.companyList.map((item, index) => {
        this.$set(this.companyList[index], 'isCheck', false)
      })
      const check = !item.isCheck
      this.$set(this.companyList[index], 'isCheck', check)
      this.sureList = []
      this.sureList.push(item)
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    confirm() {
      this.closePopup()
      this.pageInfo.params.keyword = ''
      this.$emit('confirm', this.sureList)
      console.log('this.sureList', this.sureList)
      this.sureList = []
    },
    changeEmpty() {
      this.companyList.map((item, index) => {
        this.$set(this.companyList[index], 'isCheck', false)
      })
    }
  }
}
</script>

<style lang="scss">
.common-tree-select-company{
  .sure-btn{
    font-size:30px;
    font-weight:500;
  }
  .tree-page{
    background:rgba(248,248,248,1) !important;
    height: 100%;
  }
  .empty{
    text-align: right;
    font-size:26px;
    font-weight:400;
    color:rgba(182,0,5,1);
    padding: 20px 30px;
  }
  .radio-content{
    background-color: #fff;
    padding-bottom: 200px;
    .radio-item{
      height: 111px;
      display: flex;
      align-items: center;
      padding-left: 40px;
      &+.radio-item{
        .radio-item-right{
          border-top: 1px solid #F0F0F0;
        }
      }
      .radio-item-left{
        .radio-check-y{
          width:40px;
          height:40px;
          background:rgba(182,0,5,1);
          border-radius:50%;
          display: flex;
          align-items: center;
          justify-content: center;
          span{
            width:26px;
            height:26px;
            border-radius: 50%;
            background:rgba(182,0,5,1);
            border:3px solid rgba(253,241,241,1);
          }
        }
        .radio-check-n{
          width:40px;
          height:40px;
          background:rgba(216,216,216,1);
          border-radius:50%;
        }
      }
      .radio-item-right{
        margin-left: 38px;
        height: 111px;
        line-height: 111px;
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        width: 100%;
      }
    }
  }
}
</style>
