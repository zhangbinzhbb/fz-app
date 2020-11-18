<template>
  <div class="half">
    <mt-popup
      :style="{width:'90%', height: '100%'}"
      v-model="popupVisible"
      class="menu"
      position="right">
      <div class="yh-right-content">
        <div :class="{'filter-content-ios12':isIos12,'filter-content-android':isAndroid12,'filter-content-ios':isIos}" class="filter-content">
          <div v-if="!signFlag">
            <div v-for="(p,index) in filterList" :key="index" class="filter-classes">
              <div class="tit">{{ p.name }}</div>
              <div class="tabs-content">
                <span
                  v-for="(item,idx) in p.subList"
                  :key="idx"
                  :class="['tab-box-'+item.LINE_NUM ,{'tab-box-select':item.isChecked},{'tab-column':column}]"
                  class="tab-box"
                  @click="checkToggle(index,idx,p.name,p)"
                >{{ item[p.labelName] || item.NAME }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="screen-button">
          <button class="btn-red-outline" @click="reset">重置</button>
          <button class="btn-red" @click="confirm">确定</button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
export default {
  name: 'HalfPopup',
  components: {},
  props: {
    signFlag: {
      type: Boolean,
      default: false
    },
    page: {
      type: String,
      default: () => {
        return null
      }
    },
    filterList: {
      type: Array,
      default: () => {
        return []
      }
    },
    column: {
      // 两列布局
      type: Boolean,
      default: false
    },
    columnAjax: {
      type: Boolean,
      default: false
    },
    flagArr: {
      type: Array,
      default: () => []
    },
    locationIndex: {
      type: Number,
      default: 1
    },
    radio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popupVisible: false,
      closeOnClickModal: true,
      groupIds: [],
      value: ''
    }
  },
  watch: {
    flagArr(val) {
      if (val) {
        const id = ''
        this.getFilterList(id)
      }
    },
    popupVisible(val) {
      if (!val) {
        this.closePopup()
      }
    }
  },
  created() {},
  activated() {},
  methods: {
    showPopup() {
      this.popupVisible = true
      // ios12页面的关系，打开子页面的时候与'has-comment'css样式冲突，打开右侧弹出页面，样式去掉，关闭右侧页面需要恢复（headerx组件中)
      const btmContent = document.getElementsByClassName('comment-content')
      btmContent[0].style.cssText = 'overflow-y:hidden !important'
    },
    closePopup() {
      this.popupVisible = false
      const btmContent = document.getElementsByClassName('comment-content')
      btmContent[0].style.cssText = 'overflow-y:scroll !important'
    },
    reset() {
      this.filterList.map((item, odx) => {
        if (item.subList && item.subList.length) {
          item.subList.map((p, idx) => {
            this.$set(this.filterList[odx].subList[idx], 'isChecked', false)
          })
        }
      })
      this.closePopup()
      this.$emit('reset')
    },
    confirm() {
      if (this.radio) {
        let flag = false
        this.filterList.forEach((item, index) => {
          if (item.radio) {
            item.subList.forEach((sitem, sindex) => {
              if (sitem.isChecked) {
                flag = sitem.isChecked
              }
            })
          }
        })
        if (!flag) {
          this.Toast('请选择年份')
          return
        }

        let flag1 = false
        this.filterList.forEach((item, index) => {
          if (item.name === '季度') {
            item.subList.forEach((sitem, sindex) => {
              if (sitem.isChecked) {
                flag1 = sitem.isChecked
              }
            })
          }
        })
        if (!flag1) {
          this.Toast('请选择季度')
          return
        }
      }

      this.closePopup()
      this.$emit('confirm')
    },
    getFilterList(ids) {
      const URL = '/projectPC/getInveIds'
      this.$axios.get(
        URL,
        {
          groupId: ids
        },
        res => {
          const options = res.data.options
          this.filterList[this.locationIndex].subList = options
        }
      )
    },
    checkToggle(odx, idx, type, obj) {
      if (
        (this.page === 'mail' && odx === 0) ||
        (type === '状态' && odx === 0)
      ) {
        this.filterList[odx].subList.map((item, key) => {
          if (idx !== key) {
            this.$set(this.filterList[odx].subList[key], 'isChecked', false)
          }
        })
        this.$set(this.filterList[odx].subList[idx], 'isChecked', true)
        this.filterList[1].subList = this.filterList[odx].subList[idx].LIST
      } else {
        // 控制单选
        if (obj.radio) {
          const arr = this.filterList[odx].subList
          arr.forEach((element, index) => {
            this.$set(
              this.filterList[odx].subList[index],
              'isChecked',
              false
            )
          })
          this.$set(
            this.filterList[odx].subList[idx],
            'isChecked',
            !this.filterList[odx].subList[idx].isChecked
          )
          return
        }
        // 新增条件
        if (this.columnAjax && type === '管理平台') {
          const isChecked = this.filterList[odx].subList[idx].isChecked
          const id = this.filterList[odx].subList[idx].value
          if (isChecked === undefined || !isChecked) {
            this.groupIds.push(this.filterList[odx].subList[idx].value)
          } else {
            this.groupIds.map((item, key) => {
              if (item === id) {
                this.groupIds.splice(key, 1)
              }
            })
          }
          const ids = this.groupIds.join(',')
          this.getFilterList(ids)
        }
        this.$set(
          this.filterList[odx].subList[idx],
          'isChecked',
          !this.filterList[odx].subList[idx].isChecked
        )
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style lang="scss" scoped>
@import "~@/styles/setting.scss";
.yh-right-content {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 94px;
  padding-top: 0;
  position: fixed;
  overflow: hidden;
  padding-top:60px;
}
.yh-right-content-andriod {
  padding-top: 85px;
}
.v-modal {
  z-index: 99999999;
}
.van-popup--right {
  height: 100%;
  width: 666px;
  overflow-x: hidden;
}
.van-popup {
  z-index: 1000000 !important;
}
.menu .van-cell__right-icon {
  margin-top: 25px;
}
.yh-filter {
  height: 100%;
  width: 100%;
  padding-bottom: 94px;
}
.sign-content {
  .keyword {
    .word {
      font-size: 32px;
    }
    .input {
      width: 60%;
      font-size: 32px;
    }
    display: flex;
  }
}
.filter-content {
  text-align: left;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 80px;
  box-sizing: border-box;
  margin-top:10px!important;
  /*padding-top:50px!important;*/
  .filter-classes{
    margin-top:-20px;
  }
  .tit {
    font-size: $font-size-28;
    padding-left: 30px;
    padding-top: 40px;
    line-height: 200%;
    padding-bottom: 10px;
    /*font-weight: 500;*/
    color:rgba(51,51,51,1);
    /*<!--margin-top:-10px;-->*/
  }

}
.btn-half-285 {
  width: 285px;
  height: 76px;
  line-height: 76px;
  text-align: center;
  font-size: $font-size-28;
  margin: 40px 0;
  display: inline-block;
  &:nth-child(2) {
    margin-left: 18px;
  }
}
.screen-button {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.05);
  padding: 30px;
  background: #fff;
  border-top: 2px solid #e1e1e1;
  display: flex;
  button {
    flex: 1;
    height:76px;
    line-height: 76px;
    box-sizing: border-box;
    text-align: center;
    font-size: 30px;
    color:rgba(255,255,255,1);
    font-weight:400;
    &:first-child{
      color:rgba(182,0,5,1);
    }
    &+button{
      margin-left: 36px;
    }
  }
  // 筛选选项样式
}

.btn-red-outline{
    background: none;
    color: $font-red;
    border: 2px solid $bg-red;
}
.tabs-content{
  padding: 0 30px;
  /*padding-left:30px;*/
}
.tab-column{
  width:276px !important;
  &:nth-child(3n+3){
    margin-right:28px !important;
  }
}
.tab-box{
  display: inline-block;
  text-align: center;
  width:183px;
  height:72px;
  line-height: 72px;
  color: #333333;
  font-size: $font-size-28;
  border: 2px solid $border-color;
  white-space: nowrap; /*强制在一行显示*/
  text-overflow: ellipsis; /*设置超出内容显示...*/
  overflow: hidden; /*一定不能少 .*/
  margin-right: 28px;
  box-sizing: border-box;
  margin-bottom: 10px;
  border-radius: 4px;
}
.tab-box:nth-child(3n+3){
  margin-right:0px;
}
.tab-box-2 {
  width: 248px;
   &:nth-child(2n){
    margin-right: 0;
  }
}

.tab-box-1 {
  padding: 0 30px;
}
.tab-box-3 {
  width: 183px;
  &:nth-child(3n){
    margin-right: 0;
  }
}
.tab-box-select {
  border-color: $bg-red;
  color: $font-red;
  background: $bg-red-10;
}
</style>
