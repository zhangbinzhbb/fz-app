<template>
  <div>
    <div :class="{'fd-select_disabled': disabled }" class="fd-select" @click="showPicker">
      <span v-if="selectedText" class="fd-select-text">{{ selectedText }}</span>
      <span v-else class="fd-select-placeholder">{{ _placeholder }}</span>
      <van-icon v-if="isLink" name="arrow"/>
    </div>
    <van-popup v-model="active" position="bottom">
      <van-picker
        :columns="options"
        :show-toolbar="showToolbar"
        :title="_title"
        :value-key="valueKey"
        :default-index="valueIndex"
        class="yh-datePicker"
        @cancel="active = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
const COMPONENT_NAME = 'fd-select'
const EVENT_CHANGE = 'change'
const EVENT_INPUT = 'input' // only used for v-model
const EVENT_PICKER_SHOW = 'picker-show'
const EVENT_PICKER_HIDE = 'picker-hide'

export default {
  name: COMPONENT_NAME,
  props: {
    options: {
      type: Array,
      default() {
        /* istanbul ignore next */
        return []
      }
    },
    value: null,
    placeholder: {
      type: String,
      default: ''
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    cancelTxt: {
      type: String,
      default: ''
    },
    confirmTxt: {
      type: String,
      default: ''
    },
    valueKey: {
      type: String,
      default: 'label'
    },
    isLink: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    adaptOptions() {
      return this.options
    },
    valueIndex() {
      const val = this.value + ''
      const index = this.findIndex(this.adaptOptions, val)
      return index
    },
    selectedIndex() {
      return this.valueIndex !== -1 ? [this.valueIndex] : [0]
    },
    selectedText() {
      return this.valueIndex !== -1 ? this.adaptOptions[this.valueIndex].label : ''
    },
    _placeholder() {
      return this.placeholder || '请选择'
    },
    _title() {
      return this.title || ''
    },
    _cancelTxt() {
      return this.cancelTxt || this.$t('cancel')
    },
    _confirmTxt() {
      return this.confirmTxt || this.$t('ok')
    }
  },
  created() {},
  methods: {
    findIndex(arr, value) {
      let index = -1
      arr.forEach((item, i) => {
        if (value && item.value === value) index = i
      })
      return index
    },
    onConfirm(selectedVal, selectedIndex) {
      this.hided()
      if (selectedVal.value !== this.value) {
        this.$emit(EVENT_INPUT, selectedVal.value)
        this.$emit(EVENT_CHANGE, selectedVal, selectedIndex)
      }
    },
    showPicker() {
      if (this.disabled) {
        return
      }
      this.active = true
      this.$emit(EVENT_PICKER_SHOW)
    },
    hided() {
      this.active = false
      this.$emit(EVENT_PICKER_HIDE)
    },
    selectHandler(selectedVal, selectedIndex, selectedText) {
      this.hided()
      if (selectedVal[0] !== this.value) {
        this.$emit(EVENT_INPUT, selectedVal[0])
        this.$emit(EVENT_CHANGE, selectedVal[0], selectedIndex[0], selectedText[0])
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../common/styles/variable.scss";
@import "../../common/styles/mixin.scss";
.fd-select{
  font-size:28px;
  display: flex;
  align-items: center;
  .fd-select-placeholder{
    font-weight:400;
    color: #9e9e9d;
  }
}
.fd-select_disabled{
  color: $select-disabled-color;
  background-color: $select-disabled-bgc;
  cursor: not-allowed;
}

.fd-select_active{
  .van-icon{
    transform: translate(0, -4%) rotate(90deg)
  }
}

</style>
