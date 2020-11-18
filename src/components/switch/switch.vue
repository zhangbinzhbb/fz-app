<template>
  <div class="fd-switch">
    <van-switch
      v-model="checkboxValue"
      :disabled="disabled"
      active-value="1"
      inactive-value="0"
      active-color="#B60005"
      size="0.7rem"/>
  </div>
</template>

<script type="text/ecmascript-6">
const COMPONENT_NAME = 'fd-switch'

const EVENT_INPUT = 'input'

export default {
  name: COMPONENT_NAME,
  props: {
    value: [String, Number, Boolean],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkboxValue: this.value
    }
  },
  watch: {
    value(newVal) {
      this.checkboxValue = newVal
    },
    checkboxValue(newVal) {
      this.$emit(EVENT_INPUT, newVal)
    }
  }
}
</script>

