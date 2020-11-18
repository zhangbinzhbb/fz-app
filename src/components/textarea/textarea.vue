<template>
  <div class="fd-textarea">
    <p class="title">{{ title }} <span v-if="required" class="required">*</span> </p>
    <div class="fd-textarea-inner">
      <van-field
        v-model="inputValue"
        :type="_type"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :readonly="readonly"
        :disabled="disabled"
        :autosize="autosize"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="changeHander"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import inputMixin from '../../common/mixins/input'
const COMPONENT_NAME = 'fd-textarea'
const EVENT_INPUT = 'input'
const EVENT_BLUR = 'blur'
const EVENT_FOCUS = 'focus'

export default {
  name: COMPONENT_NAME,
  mixins: [inputMixin],
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: 'textarea'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    readonly: {
      type: Boolean,
      default: false
    },
    maxlength: Number,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    title: String,
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: this.value,
      isFocus: false,
      formatedClearable: {
        visible: false,
        blurHidden: true
      },
      formatedEye: {
        open: false,
        reverse: false
      }
    }
  },
  computed: {
    _type() {
      const type = this.type
      return type
    }
  },
  watch: {
    value(newValue) {
      this.inputValue = newValue
    },
    inputValue(newValue) {
      this.$emit(EVENT_INPUT, newValue)
    }
  },
  methods: {
    handleFocus(e) {
      this.$emit(EVENT_FOCUS, e)
      this.isFocus = true
    },
    handleBlur(e) {
      this.$emit(EVENT_BLUR, e)
      this.isFocus = false
    }
  }
}
</script>

<style lang="scss">
.fd-textarea{
  .fd-textarea-inner{
    border-radius:4px;
    border:2px solid rgba(240,240,240,1);
  }
  .title{
    font-size:28px;
    font-weight:500;
    color:rgba(158,158,157,1);
    padding-bottom: 20px;
    text-align: left;
    .required{
      color: #b60005;
    }
  }
  background-color: #fff;
}
</style>
