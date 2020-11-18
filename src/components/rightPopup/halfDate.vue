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
          <div v-for="(p,index) in filterList" :key="index" class="filter-classes">
            <div class="tit">{{ p.name }}</div>
            <div class="date-time-input-wrap" >
              <div style="margin:10px;border-bottom: 1px solid #eee;padding: 10px;">
                <van-icon name="notes-o" />
                <van-field
                  v-model="userListForm.begin_Time"
                  placeholder="开始时间"
                  readonly="readonly"
                  style="display:inline-block;width: 80%;vertical-align: bottom;"
                  @click="beginTimePop = true"
                />
                <van-popup v-model="beginTimePop" :overlay="true" label="开始时间" position="bottom">
                  <van-datetime-picker
                    v-model="currentDate_begin"
                    type="datetime"
                    @cancel="beginTimePop = false"
                    @confirm="beginTimePop = false"
                    @change="beginTimeChange"
                  />
                </van-popup>
              </div>
              <div style="margin:10px;border-bottom: 1px solid #eee;padding: 10px;">
                <van-icon name="notes-o" />
                <van-field
                  v-model="userListForm.end_time"
                  placeholder="结束时间"
                  readonly="readonly"
                  style="display:inline-block;display:inline-block;width: 80%;vertical-align: bottom;"
                  @click="endTimePop = true"
                />
                <van-popup v-model="endTimePop" :overlay="true" label="结束时间" position="bottom">
                  <van-datetime-picker
                    v-model="currentDate_end"
                    type="datetime"
                    @cancel="endTimePop = false"
                    @confirm="endTimePop = false"
                    @change="endTimeChange"
                  />
                </van-popup>
              </div>
            </div>
          </div>
        </div>
        <div class="screen-button">
          <button class="screen-reset" @click="reset">重置</button>
          <button class="screen-go" @click="confirm">确定</button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
export default {
  name: 'HalfDate',
  components: {},
  props: {
    filterList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      popupVisible: false,
      closeOnClickModal: true,
      groupIds: [],
      value: '',
      endTimePop: false,
      beginTimePop: false,
      currentDate_begin: '',
      currentDate_end: '',
      userListForm: {
        begin_Time: '',
        end_time: ''
      }
    }
  },
  watch: {},
  created() {},
  activated() {},
  methods: {
    beginTimeChange(e) {
      const beginTimeArr = e.getValues()// ["2019", "03", "22", "17", "28"]
      this.userListForm.begin_Time = `${beginTimeArr[0]}-${beginTimeArr[1]}-${beginTimeArr[2]}  ${beginTimeArr[3]}:${beginTimeArr[4]}`
    },
    endTimeChange(e) {
      const endTimeArr = e.getValues()// ["2019", "03", "22", "17", "28"]
      this.userListForm.end_time = `${endTimeArr[0]}-${endTimeArr[1]}-${endTimeArr[2]}  ${endTimeArr[3]}:${endTimeArr[4]}`
    },
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style lang="scss">
.van-field__control{
  font-size: 30px;
}
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
      background-color: #f0f2f5;
      font-size: 24px;
      line-height: 56px;
      margin: 10px 0px 10px 20px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .active {
      color: #b70007 !important;
      background: rgba(183, 0, 7, 0.1);
    }
  }
  .columnLayout {
    span {
      width: 240px !important;
    }
  }
}

.screen-button {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  .screen-reset {
    color: #000;
    background: rgba(245, 245, 245, 1);
  }
  .screen-go {
    color: #fff !important;
    background-color: #b70007;
  }
  button {
    // font-size: 32px;
    font-size: 28px;
    border: none;
    float: left;
    width: 50%;
    height: 94px;
  }
}
</style>
