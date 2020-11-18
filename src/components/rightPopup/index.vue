
<template>
  <div>
    <van-popup
      v-model="popupVisible"
      :close-on-click-modal="true"
      :class="{'android-class':isAndroid12}"
      position="right"
      class="menu yh-content has-comment"
      lock-scroll="true"
    >
      <headerx ref="rightTit" :cat-title="catTitle" back-type="closePopup" @closePopup="closePopup">
        <template slot="right">
          <span class="yh-add-more" @click="confirm()">确定</span>
        </template>
      </headerx>
      <div v-if="catTitle" class="comment-content no-comment">
        <div>
          <company-list :company="company"/>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'RightPopup',
  components: {
    'company-list': () => import('@/components/company/index')
  },
  props: {
    catTitle: {
      type: String,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      popupVisible: false,
      company: {
        name: null,
        checked: null
      },
      paddingTop: 0,
      pageType: 'personSelect',
      checkedArray: [],
      personParams: {
        avatorAttr: 'FILE_PATH',
        needUrl: false,
        nameAttr: 'NAME',
        colorAttr: 'COLOR',
        showRadio: true,
        checkIdAttr: 'ID'
      }
    }
  },
  watch: {
    catTitle(val) {
      console.log('catTitle', val)
      if (val.indexOf('会议室预定') > -1) {
        this.pageType = 'meeting'
        return
      }
      if (val.indexOf('假勤历史记录') > -1) {
        this.pageType = 'leaveHistory'
        return
      }
      if (val.indexOf('企业名称') > -1) {
        this.pageType = 'company'
        return
      }
      if (val.indexOf('OA会议') > -1) {
        this.pageType = 'oa'
        return
      }
      if (val.indexOf('选择项目') > -1) {
        this.pageType = 'project'
        return
      }
      if (val.indexOf('姓名') > -1) {
        this.pageType = 'workflow'
        return
      }
      this.pageType = 'personSelect'
    }
  },
  created() {},
  methods: {
    showPopup() {
      this.popupVisible = true
    },
    closePopup(val) { // 关闭弹出层
      this.popupVisible = false
    },
    confirm() {
      this.popupVisible = false
      // ios12关闭右侧弹框时，需要恢复主页面'has-comment'Class
      const yhPage = document.getElementsByClassName('yh-page')
      yhPage[0].children[0].classList.add('has-comment')
      if (this.pageType === 'company' || this.pageType === 'oa' || this.pageType === 'project' || this.pageType === 'workflow') {
        const company = {}
        if (this.company.checked) {
          const arr = this.company.checked.split('_')
          company.name = arr[1]
          company.checked = arr[0]
        } else {
          company.name = this.company.keyword
          company.checked = ''
        }
        this.$emit('confirm', company)
        return
      }
      this.$emit('confirm', this.checkedArray)
    },
    getCheckedList(item) {
      this.$set(this, 'checkedArray', item.options.slice())
      if (this.$refs.personList) {
        this.$refs.personList.setListChecked(this.checkedArray)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style lang="scss">
.yh-right-content {
  overflow-y: scroll;
  height: 100%;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
.yh-right-content-andriod {
  padding-top: 85px;
}
.mint-popup-right {
  height: 100%;
  width: 100%;
}
.mint-popup {
  z-index: 1000000 !important;
}
.clps-tit {
  font-size: 30px;
  color: #444;
  text-align: left;
  padding: 25px 0;
}
.clps-sub-item {
  font-size: 26px;
  color: #444;
  text-align: left;
  padding: 25px 0;
  padding-left: 40px;
}
.menu .van-cell__right-icon {
  margin-top: 25px;
}
</style>
