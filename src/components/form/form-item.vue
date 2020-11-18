<template>
  <div v-if="!fieldValue.hidden" ref="formItem" :class="itemClass" class="fd-form-item border-bottom-1px">
    <template v-if="!isBtnField">
      <slot name="label">
        <div v-show="fieldValue.label" class="fd-form-label"><span>{{ fieldValue.label }}</span></div>
      </slot>
      <div :style="{'width':componentName==='fd-tree' || componentName==='fd-textarea' || componentName==='fd-upload' ? '100%' : ''}" class="is-link-content">
        <slot>
          <component
            ref="inputs"
            :is="componentName"
            v-model="modelValue"
            v-bind="fieldValue.props"
            class="componentValue"
            @focus="textareaFocus"
            @blur="textareaBlur"
            v-on="fieldValue.events"/>
        </slot>
        <van-icon v-show="fieldValue.isLink" name="arrow"/>
      </div>
    </template>
  </div>
</template>

<script>
import { processField } from './fields/index'
import { debounce } from '../../common/helpers/util'
import mixin from './mixin'
import components from './components'

const COMPONENT_NAME = 'fd-form-item'
const EVENT_FOCUSIN = 'focusin'
const EVENT_FOCUSOUT = 'focusout'

export default {
  name: COMPONENT_NAME,
  components,
  mixins: [mixin],
  props: {
    field: {
      type: Object,
      default() {
        /* istanbul ignore next */
        return {}
      }
    }
  },
  data() {
    const validatorModelKey = 'value'
    const modelKey = this.field.modelKey
    const modelValue = modelKey ? this.form.model[modelKey] : null
    return {
      validatorDisabled: false,
      validatorModelKey,
      modelValue: modelValue,
      validatorModel: {
        [validatorModelKey]: modelValue
      },
      sumHeight: 0
    }
  },
  computed: {
    fieldValue() {
      return processField(this.field)
    },
    hasRules() {
      return Object.keys(this.fieldValue.rules || {}).length > 0
    },
    isBtnField() {
      return this.fieldValue.type === 'button'
    },
    itemClass() {
      const rules = this.fieldValue.rules
      return {
        // only handle required rule for now
        'fd-form-item_required': rules && rules.required,
        'fd-form-item_btn': this.isBtnField,
        'fd-form-item_validating': this.validating,
        'fd-form-item_pending': this.pending,
        'fd-form-item_valid': this.valid,
        'fd-form-item_invalid': this.invalid
      }
    },
    modelVal() {
      return this.form.model[this.fieldValue.modelKey]
    },
    componentName() {
      const fieldValue = this.fieldValue
      const component = fieldValue.component
      if (component) {
        return component
      }
      const type = fieldValue.type
      const fdType = `fd-${type}`
      if (components[fdType]) {
        return fdType
      }
      return type
    }
  },
  watch: {
    modelVal(newModel) {
      if (this.modelValue !== newModel) {
        this.modelValue = newModel
      }
    },
    modelValue: {
      handler(newModel) {
        // update form model
        this.form.model[this.fieldValue.modelKey] = newModel
        // this.updateValidatorModel()
      },
      sync: true
    },
    originValid(newVal) {
      this.lastOriginValid = newVal
    }
  },
  beforeCreate() {
    this.form = this.$parent.form
  },
  created() {
    this.form.addField(this)
    this.getValidatorModel = (modelValue) => {
      this.pending = false
      return modelValue
    }
  },
  mounted() {
    this.initDebounce()
    this.initFocusEvents()
  },
  beforeDestroy() {
    this.removeFocusEvents()
    this.form.destroyField(this)
    this.form = null
  },
  methods: {
    textareaFocus() {
      if (this.fieldValue.type === 'textarea' || this.fieldValue.type === 'input') {
        this.$parent.form.$data.heightFlag = true
        if (this.fieldValue.input) {
          this.sumHeight = 0
          const u = navigator.userAgent
          const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
          const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
          if (isAndroid) {
            this.$parent.form.$data.emptyFlagIsAndroid = true
          }
          if (isiOS) {
            this.$parent.form.$data.emptyFlagIsIos = true
          }
          const offsetHeight = this.$parent.form.$refs.form.scrollHeight
          this.sumHeight = offsetHeight
          this.$nextTick(() => {
            setTimeout(() => {
              window.scrollTo({
                top: this.sumHeight + 300,
                behavior: 'smooth'
              })
            })
          })
        }
      }
    },
    textareaBlur() {
      if (this.fieldValue.type === 'textarea' || this.fieldValue.type === 'input') {
        this.$parent.form.$data.heightFlag = false
        if (this.fieldValue.input) {
          const u = navigator.userAgent
          const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
          const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
          if (isAndroid) {
            this.$parent.form.$data.emptyFlagIsAndroid = false
          }
          if (isiOS) {
            this.$parent.form.$data.emptyFlagIsIos = false
          }
          setTimeout(() => {
            window.scrollTo({
              top: this.sumHeight + 300,
              behavior: 'smooth'
            })
          })
        }
      }
    },
    initDebounce() {
      let debounceTime = this.fieldValue.debounce
      if (debounceTime === true) {
        debounceTime = 200
      }
      if ((!debounceTime && debounceTime !== 0) || debounceTime < 0 || this.fieldValue.trigger === 'blur') return
      this.getValidatorModel = debounce((modelValue) => {
        return modelValue
      }, debounceTime, false, this.validatorModel[this.validatorModelKey])
    },
    focusInHandler() {
      this.focused = true
    },
    focusOutHandler() {
      this.focused = false
      this.updateValidatorModel()
    },
    initFocusEvents() {
      if (this.fieldValue.trigger === 'blur') {
        const formItem = this.$refs.formItem
        formItem.addEventListener(EVENT_FOCUSIN, this.focusInHandler, false)
        formItem.addEventListener(EVENT_FOCUSOUT, this.focusOutHandler, false)
        this.getValidatorModel = (modelValue) => {
          if (this.focused) {
            return this.validatorModel[this.validatorModelKey]
          } else {
            this.pending = false
            this.form.updatePending()
            return modelValue
          }
        }
      }
    },
    removeFocusEvents() {
      const formItem = this.$refs.formItem
      formItem.removeEventListener(EVENT_FOCUSIN, this.focusInHandler, false)
      formItem.removeEventListener(EVENT_FOCUSOUT, this.focusOutHandler, false)
    },
    updateValidatorModel() {
      this.pending = true
      this.validatorModel[this.validatorModelKey] = this.getValidatorModel(this.modelValue)
      if (this.pending) {
        this.form.setPending(this.pending)
        this.originValid = undefined
      }
    }
  }
}
</script>

<style lang="scss">
  @import "../../common/styles/variable.scss";
  @import "../../common/styles/mixin.scss";

  .fd-form-item{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 40px;
    background-color: #fff;
    &+.fd-form-item{
      border-top: 1px solid #F0F0F0;
    }
    .componentValue{
      text-align: right;
      color:rgba(76,76,76,1);
      width: 100%;
      .van-cell {
        padding:0 !important;
      }
      .van-field__control {
        text-align: right !important;
      }
      .fd-textarea-inner{
        .van-cell {
          padding: 10px 16px !important;
        }
        .van-field__control {
          text-align: left !important;
        }
      }
    }
    .is-link-content{
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    &:last-child{
      &::after{
        display: none;
      }
    }
    .fd-checkbox-group, .fd-radio-group{
      background-color: transparent;
    }
    .fd-checkbox, .fd-radio{
      padding-left: 0;
      padding-right: 0;
    }
  }
  .fd-form-item_btn{
    background-color: #f8f8f8;
    &::after{
      display: none;
    }
  }
  .fd-form-label{
    display: flex;
    align-items: center;
    word-wrap: break-word;
    word-break: break-word;
    font-weight:500;
    color:rgba(158,158,157,1);
  }
  .fd-form-item_required{
    .fd-form-label{
      position: relative;
      &::before{
        content: "*";
        position: absolute;
        right: 0;
        display: block;
        margin-top:4px;
        margin-right: -4px;
        color: $form-label-required-color;
        font-size:$fontsize-28;
      }
    }
  }
</style>
