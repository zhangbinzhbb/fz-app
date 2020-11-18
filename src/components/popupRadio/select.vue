<template>
  <div class="oa-page">
    <mt-popup v-model="popupVisible" :overlay="false" :class="{'android-class':isAndroid12, 'oa-ios12':isIos12}" :style="{ width: '100%' }" position="right" class="menu yh-content has-comment common-tree-select">
      <headerx :cat-title="title" page-type="back" @closeBack="closePopup">
        <template slot="right">
          <span class="yh-add-more sure-btn yh-tree-header" @click="submitHandle">
            确认
            <!-- {{ sureList.length>0? '('+sureList.length + ')':'' }} -->
          </span>
        </template>
      </headerx>
      <div class="comment-content">
        <form class="yh-search" action @submit.prevent="search">
          <img src="@/assets/images/icon/search-img.png" class="search-img">
          <input
            ref="searchInput"
            v-model.trim="pageInfo.params.keyword"
            type="search"
            placeholder="搜索"
          >
        </form>
        <div class="empty" >
          <p @click="check=null">清空选择</p
        ></div>
        <van-radio-group v-model="check" class="company-radio">
          <van-radio
            v-for="(item,index) in getList"
            :name="item.value"
            :key="index"
          >
            {{ item.label }}
            <img
              slot="icon"
              slot-scope="props"
              :src="props.checked ? activeIcon : inactiveIcon"
              class="radio-icon"
            >
          </van-radio>
        </van-radio-group>
      </div>
    </mt-popup>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    value: [String, Number],
    options: {
      type: Array,
      default: () => { return [] }
    },
    title: [String]
  },
  data() {
    return {
      popupVisible: false,
      isLoading: false,
      pageInfo: {
        params: {
          keyword: ''
        }
      },
      check: '',
      activeIcon: require('./images/active.png'),
      inactiveIcon: require('./images/default.png')
    }
  },
  computed: {
    oaListTotal() {
      return this.options
    },
    getList() {
      return this.oaListTotal.filter(item => {
        return item.label && item.label.indexOf(this.pageInfo.params.keyword) > -1
      })
    }
  },
  watch: {
    value(v) {
      this.check = v
    }
  },
  created() {},
  mounted() {},
  methods: {
    showPopup() { // 打开弹出层
      this.popupVisible = true
    },
    closePopup(val) { // 关闭弹出层
      this.popupVisible = false
    },
    submitHandle() {
      this.$emit('select-change', this.check)
      this.closePopup()
    },
    search() {

    }
  }
}
</script>

<style lang="scss" scoped>
.oa-page {
  .company-radio {
    text-align: left;
    .van-radio {
      border-bottom: 2px solid #f8f8f8;
      padding: 30px 40px;
    }
    .van-radio__input {
      font-size: 36px;
    }
    .van-icon-checked {
      color: #b70007;
    }
    .van-radio__label {
      font-size: 28px;
      color: #333;
      width: 90%;
      line-height: 120%;
      padding-left: 10px;
    }
    .radio-icon{
      width: 40px;
      height: 40px;
    }
  }
  .yh-search{
    background: #f8f8f8;
    input{
      background-color: #efeff0;
    }
  }
  .empty {
    display: flex;
    justify-content: flex-end;
    background: #f8f8f8;
    p{
      font-size: 28px;
      color: #B60005;
      text-align: right;
      padding: 0px 30px 20px 30px;
    }
  }
}
</style>
