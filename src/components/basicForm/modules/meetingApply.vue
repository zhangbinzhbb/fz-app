<template>
  <div :class="{'ios-basic-form':!isAndroid12}" class="yh-basic-form comment-content no-comment yh-basic-form-common">
    <van-cell-group class="yh-vant-form">
      <div class="input-cover-con">
        <div
          class="input-cover"
        >
          <van-field
            v-model="model.loginName"
            :disabled="true"
            label="申请人"
            placeholder="请输入"
            label-align="left"
          />
          <van-field
            v-model="model.meetingName"
            :required="true"
            label="会议名称"
            placeholder="请输入"
            label-align="left"
          />
          <div class="invall-num">
            <span :class="{'van-cell--required':true}" class="van-cell__title">参会人数</span>
            <div class="list">
              <div v-for="num in numOption" :key="num" class="checkList">
                <span
                  :class="{'isChecked':model.meetingNumber===num}"
                  class="check"
                  @click="chooseNum('meetingNumber',num)"
                >{{ num }}</span>
              </div>
            </div>
          </div>
          <van-field
            v-model="model.meetingStartTime"
            :required="true"
            :is-link="true"
            :readonly="true"
            label="开始时间"
            placeholder="请选择"
            label-align="left"

            @click="datePickerChange"
          />
          <!-- <van-field
            v-model="model.meetingEndTime"
            :required="true"
            :is-link="true"
            :readonly="true"
            label="结束时间"
            placeholder="请选择"
            label-align="left"
            @click="datePickerChange"
          /> -->
        </div>
      </div>
    </van-cell-group>

    <van-popup v-model="datePicker.show" position="bottom">
      <van-datetime-picker
        v-model="datePicker.value"
        type="datetime"
        @confirm="popupConfirm('datePicker','')"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    modelData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentDate: '',
      model: null,
      numOption: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datePicker: {
        show: false,
        value: new Date()
      }
    }
  },
  watch: {
    modelData: {
      handler(newValue, oldValue) {
        console.log('newValue:', newValue)
        this.model = JSON.parse(JSON.stringify(newValue))
      },
      deep: true
    }
  },
  mounted() {
    this.model = JSON.parse(JSON.stringify(this.modelData))
  },
  methods: {
    // 人数选择
    chooseNum(name, val) {
      this.$set(this.model, name, val)
    },
    datePickerChange() {
      this.datePicker.show = true
    },
    // 弹出框日期确认按钮
    popupConfirm(type, name) {
      console.log('type:', type)
      console.log('name:', name)
      this.model[name] = type === 'datePicker'
        ? this.formatDateTime(this[type].value, 'yyyy-MM-dd HH:mm')
        : ''

      console.log('meetingStartTime:', this.model)
      this.datePicker.show = false
    }
  }
}
</script>

<style lang="scss">

</style>

