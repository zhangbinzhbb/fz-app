<template>
  <div class="fd-input">
    <van-field
      v-model="selectedText"
      :placeholder="placeholder"
      :readonly="true"
      :autosize="autosize"
      class="popup-radio"
      @click="rightPopupOpen"
    />
    <popup-select
      ref="select"
      :value="value"
      :options="options"
      :title="title"
      @select-change="selectChange"

    />
  </div>
</template>

<script type="text/ecmascript-6">
const COMPONENT_NAME = 'fd-popupRadio'
const EVENT_INPUT = 'input'

import popupSelect from './select'
export default {
  name: COMPONENT_NAME,
  components: {
    popupSelect
  },
  props: {
    value: [String, Number],
    options: {
      type: Array,
      default: () => {}
    },
    placeholder: {
      type: 'String',
      default: '请选择'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    title: [String]

  },
  data() {
    return {}
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
    }
  },
  watch: {},
  created() {
  },
  methods: {
    findIndex(arr, value) {
      let index = -1
      arr.forEach((item, i) => {
        if (value && item.value === value) index = i
      })
      return index
    },
    rightPopupOpen() {
      if (this.readonly) return false
      this.$refs.select.showPopup()
    },
    selectChange(v) {
      this.$emit(EVENT_INPUT, v)
    }
  }
}
</script>
<style lang="scss">
.popup-radio{
  &.van-cell:not(:last-child)::after{
    border: none;
  }
}
</style>

