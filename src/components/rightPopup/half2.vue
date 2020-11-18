<template>
  <div class="half">
    <mt-popup
      v-model="popupVisible"
      :close-on-click-modal="closeOnClickModal"
      position="right"
      class="menu"
      lock-scroll="true"
    >
      <div class="yh-right-content">
        <div class="filter-content">
          <div v-if="!signFlag">
            <div v-for="(p,index) in filterList" :key="index" class="filter-classes">
              <div class="tit">{{ p.name }}</div>
              <div :class="{'columnLayout':column}" class="box">
                <span
                  v-for="(item,idx) in p.subList"
                  :key="idx"
                  :class="{'active':item.isChecked}"
                  @click="checkToggle(index,idx,p.name)"
                >{{ item[p.labelName] }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="screen-button">
          <button class="screen-reset" @click="reset">重 置</button>
          <button class="screen-go" @click="confirm">确 定</button>
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
    }
  },
  created() {},
  activated() {},
  methods: {
    showPopup() {
      this.popupVisible = true
      // ios12页面的关系，打开子页面的时候与'has-comment'css样式冲突，打开右侧弹出页面，样式去掉，关闭右侧页面需要恢复（headerx组件中)
      // let content = document.getElementsByClassName('has-comment')
      const btmContent = document.getElementsByClassName('comment-content')
      btmContent[0].style.cssText = 'overflow-y:hidden !important'
      // content[0].classList.remove('has-comment')
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
      this.closePopup()
      this.$emit('confirm')
    },
    getFilterList(ids) {
      this.$axios.get(
        '/projectInfo/getInves',
        {
          groupIds: ids
        },
        res => {
          this.filterList[1].subList = res.data.options
        }
      )
    },
    checkToggle(odx, idx, type) {
      if ((this.page === 'mail' && odx === 0) || (type === '状态' && odx === 0)) {
        this.filterList[odx].subList.map((item, key) => {
          if (idx !== key) {
            this.$set(this.filterList[odx].subList[key], 'isChecked', false)
          }
        })
        this.$set(this.filterList[odx].subList[idx], 'isChecked', true)
        this.filterList[1].subList = this.filterList[odx].subList[idx].LIST
      } else {
        // 新增条件
        if (this.columnAjax && type == '管理平台') {
          const isChecked = this.filterList[odx].subList[idx].isChecked
          const id = this.filterList[odx].subList[idx].value
          if (isChecked == undefined || !isChecked) {
            this.groupIds.push(this.filterList[odx].subList[idx].value)
          } else {
            this.groupIds.map((item, key) => {
              if (item == id) {
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
  .yh-right-content {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 94px;
    padding-top: 0;
    position: fixed;
    overflow: hidden;
  }
  .yh-right-content-andriod {
    padding-top: 85px;
  }
  .v-modal {
    z-index: 99999999;
  }
  .mint-popup-right {
    height: 100%;
    width: 559px;
    overflow-x: hidden;
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
    // padding-top: 30px;
    padding-top: 80px;
    box-sizing: border-box;
    .tit {
      font-size: 32px;
      padding-left: 20px;
      // 新加
      padding-top: 10px;
      line-height: 200%;
    }
    .box {
      span {
        border-radius: 8px;
        display: inline-block;
        width: 160px;
        height: 56px;
        font-weight: bold;
        background-color: #fff;
        font-size: 24px;
        color: #333;
        border: #E1E1E1 1px solid;
        line-height: 56px;
        margin: 10px 0px 10px 20px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .active {
        color: #B60005 !important;
        background: rgba(182, 0, 5, 0.1);
        border: #B60005 1px solid;
      }
    }
    .columnLayout {
      span {
        /*width: 240px !important;*/
      }
    }
  }

  .screen-button {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-top: 5px solid #f5f5f5;
    .screen-reset {
      color: rgba(182, 0, 5, 1);
      width: 45%;
      background: #fff;
      margin-left: 3%;
      border-radius: 8px;
      border: rgba(182, 0, 5, 1) 1px solid;
    }
    .screen-go {
      color: #fff !important;
      width: 45%;
      margin-left: 4%;
      border-radius: 8px;
      background-color: #b70007;
    }
    button {
      // font-size: 32px;
      font-size: 28px;
      float: left;
      height: 56px;
    }
  }
</style>
