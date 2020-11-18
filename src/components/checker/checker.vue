<template>
  <ul :class="{'fd-checker-round':round}" class="fd-checker">
    <slot>
      <fd-checker-item
        v-for="(option, index) in options"
        :option="option"
        :key="index" />
    </slot>
  </ul>
</template>
<script type="text/ecmascript-6">
import FdCheckerItem from './checker-item.vue'
const COMPONENT_NAME = 'fd-checker'
const EVENT_INPUT = 'input'

export default {
  name: COMPONENT_NAME,
  components: {
    FdCheckerItem
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: [String, Number, Array],
    options: {
      type: Array,
      default() {
        /* istanbul ignore next */
        return []
      }
    },
    type: {
      type: String,
      default: 'checkbox'
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default() {
        return this.options.length
      }
    },
    round: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  computed: {
    isRadio() {
      return this.type === 'radio'
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    },
    currentValue(val) {
      this.$emit(EVENT_INPUT, val)
    }
  },
  mounted() {},
  methods: {
    check(option) {
      if (this.isRadio) {
        this.checkRadio(option)
      } else {
        this.checkCheckbox(option)
      }
    },
    checkRadio(option) {
      this.currentValue = option.value
    },
    checkCheckbox(option) {
      const value = option.value
      const currentValue = this.currentValue
      const valueLen = currentValue.length
      const min = this.min
      const max = this.max
      const index = currentValue.indexOf(value)
      if (index > -1) {
        (valueLen > min) && currentValue.splice(index, 1)
      } else {
        (valueLen < max) && currentValue.push(value)
      }
    }
  }
}
</script>

<style lang="scss">
.fd-checker-round{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-end;
  .fd-checker-item {
    border-radius: 50%;
    height: 64px;
    width: 64px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
