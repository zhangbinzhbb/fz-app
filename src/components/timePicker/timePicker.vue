<template>
  <div>
    <div class="fd-select-datetime" @click="showPicker">
      <span v-if="selectedText" class="fd-select-text">{{ selectedText }}</span>
      <span v-else class="fd-select-placeholder">{{ _placeholder }}</span>
      <van-icon v-if="isLink" name="arrow"/>
    </div>
    <van-popup v-model="isVisible" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        :type="_type"
        :formatter="formatter"
        :filter="filter"
        class="yh-datePicker"
        @confirm="popupConfirm"
        @cancel="isVisible = false"/>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  formatDate
} from '../../common/lang/date'

const COMPONENT_NAME = 'fd-date'
const EVENT_PICKER_SHOW = 'picker-show'
const EVENT_INPUT = 'input' // only used for v-model

export default {
  name: COMPONENT_NAME,
  props: {
    value: null,
    type: {
      type: String,
      default: 'datetime'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formatter: {
      type: Function,
      default: (type, value) => {
        if (type === 'year') {
          return `${value}`
        } else if (type === 'month') {
          return `${value}`
        }
        return value
      }
    },
    filter: {
      type: Function,
      default: (type, options) => {
        if (type === 'minute') {
          return options.filter(option => option % 5 === 0)
        }
        return options
      }
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD hh:mm'
    },
    isLink: {
      type: Boolean,
      default: false
    },
    defaultTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isVisible: false,
      currentDate: this.format === 'hh:mm' ? '' : new Date()
    }
  },
  computed: {
    _placeholder() {
      return this.placeholder || '请选择'
    },
    selectedText() {
      return this.value
    },
    _type() {
      const type = this.type
      return type
    }
  },
  methods: {
    showPicker() {
      if (this.disabled) {
        return
      }
      this.isVisible = true
      this.$emit(EVENT_PICKER_SHOW)
    },
    popupConfirm(value) {
      this.isVisible = false
      const format = this.format
      const newValue = formatDate(value, format)
      this.$emit(EVENT_INPUT, newValue)
    }
  }
}
</script>

<style lang="scss">
.fd-select-datetime{
  font-size:28px;
  display: flex;
  align-items: center;
  .fd-select-placeholder{
    font-weight:400;
    color: #9e9e9d;
  }
}
</style>
