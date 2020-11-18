<template>
  <div class="fd-form-contanier">
    <headerx
      v-if="title"
      :style="{'position':heightFlag?'absolute':'fixed'}"
      :cat-title="title"
      :page-type="isBack?'back':''"
      @closeBack="closeBackHandle"
    >
      <template slot="right">
        <div class="header-button">
          <span v-if="btnDel" @click="delHandler">删除</span>
          <span v-if="btnEdit" @click="submitHandler">保存</span>
        </div>
      </template>
    </headerx>
    <div ref="form" :class="formClass" class="fd-form" >
      <slot>
        <fd-form-group v-for="(group, index) in groups" :fields="group.fields" :legend="group.legend" :key="index" />
      </slot>
      <div v-if="isBtn" class="fd-button-group">
        <van-button type="default" @click="submitHandler">提交</van-button>
      </div>
      <div v-if="isSbumitSave" class="fd-button-group" style="padding-top:0">
        <van-button type="default" @click="SbumitSaveHandler">保存并通知</van-button>
      </div>
      <div v-if="emptyFlagIsAndroid" class="empty-b-isAndroid"/>
      <div v-if="emptyFlagIsIos" class="empty-b-isIos"/>
    </div>
  </div>
</template>

<script>
import LAYOUTS from './layouts'
import mixin from './mixin'
import FdFormGroup from './form-group.vue'

const COMPONENT_NAME = 'fd-form'
const EVENT_SUBMIT = 'submit'
const EVENT_SUBMITSAVE = 'submitSave'
const EVENT_DELETE = 'delete'
const EVENT_RESET = 'reset'
const EVENT_BACK = 'back'

export default {
  name: COMPONENT_NAME,
  components: {
    FdFormGroup
  },
  mixins: [mixin],
  props: {
    action: {
      type: String,
      default: null
    },
    model: {
      type: Object,
      default() {
        /* istanbul ignore next */
        return {}
      }
    },
    schema: {
      type: Object,
      default() {
        /* istanbul ignore next */
        return {}
      }
    },
    options: {
      type: Object,
      default() {
        return {
          scrollToInvalidField: false,
          layout: LAYOUTS.STANDARD
        }
      }
    },
    immediateValidate: {
      type: Boolean,
      default: false
    },
    title: String,
    isBtn: {
      type: Boolean,
      default: false
    },
    isSbumitSave: {
      type: Boolean,
      default: false
    },
    btnEdit: {
      type: Boolean,
      default: false
    },
    btnDel: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      validatedCount: 0,
      dirty: false,
      firstInvalidField: null,
      firstInvalidFieldIndex: -1,
      heightFlag: false,
      emptyFlagIsAndroid: false,
      emptyFlagIsIos: false
    }
  },
  computed: {
    fieldsModel() {
      const model = {}
      this.fields.forEach((fieldComponent) => {
        if (!fieldComponent.isBtnField) {
          model[fieldComponent.fieldValue.modelKey] = fieldComponent.modelValue
        }
      })
      return model
    },
    groups() {
      const schema = this.schema
      const groups = schema.groups || []
      if (schema.fields) {
        groups.unshift({
          fields: schema.fields
        })
      }
      return groups
    },
    layout() {
      const options = this.options
      const layout = (options && options.layout) || LAYOUTS.STANDARD
      return layout
    },
    formClass() {
      const invalid = this.invalid
      const valid = this.valid
      const layout = this.layout
      return {
        'fd-form_standard': layout === LAYOUTS.STANDARD,
        'fd-form_groups': this.groups.length > 1,
        'fd-form_validating': this.validating,
        'fd-form_pending': this.pending,
        'fd-form_valid': valid,
        'fd-form_invalid': invalid,
        'fd-form_classic': layout === LAYOUTS.CLASSIC,
        'fd-form_fresh': layout === LAYOUTS.FRESH
      }
    }
  },
  watch: {},
  beforeCreate() {
    this.form = this
    this.fields = []
    this.validity = {}
  },
  mounted() {},
  beforeDestroy() {
    this.form = null
    this.firstInvalidField = null
  },
  methods: {
    closeBackHandle() {
      this.$emit(EVENT_BACK, this.model, this.fieldsModel)
    },
    reset() {
      dispatchEvent(this.$refs.form, 'reset')
    },
    submitHandler() {
      const formVerify = (data, basicForm) => {
        let result = true
        basicForm.map(fieldComponent => {
          const modelKey = fieldComponent.fieldValue.modelKey
          const rules = fieldComponent.field.rules
          if (typeof rules === 'object' && rules.required) {
            if ((data[modelKey] === null || data[modelKey] === undefined || data[modelKey] === '')) {
              this.Toast('请输入必填项')
              result = false
            }
          }
        })
        return result
      }
      if (formVerify(this.model, this.fields)) {
        this.$emit(EVENT_SUBMIT, this.model, this.fieldsModel)
      }
    },
    SbumitSaveHandler() {
      const formVerify = (data, basicForm) => {
        let result = true
        basicForm.map(fieldComponent => {
          const modelKey = fieldComponent.fieldValue.modelKey
          const rules = fieldComponent.field.rules
          if (typeof rules === 'object' && Object.keys(rules).length > 0) {
            if ((data[modelKey] === null || data[modelKey] === undefined || data[modelKey] === '')) {
              this.Toast('请输入必填项')
              result = false
            }
          }
        })
        return result
      }
      if (formVerify(this.model, this.fields)) {
        this.$emit(EVENT_SUBMITSAVE, this.model, this.fieldsModel)
      }
    },
    delHandler() {
      this.$emit(EVENT_DELETE, this.model, this.fieldsModel)
    },
    resetHandler(e) {
      this._reset()
      this.$emit(EVENT_RESET, e)
    },
    addField(fieldComponent) {
      let isRepeat = false
      this.fields.forEach(i => {
        if (i.field.modelKey === fieldComponent.field.modelKey) {
          isRepeat = true
        }
      })
      if (!isRepeat) {
        this.fields.push(fieldComponent)
        this.setValidity(fieldComponent.fieldValue.modelKey)
      }
    },
    destroyField(fieldComponent) {
      const i = this.fields.indexOf(fieldComponent)
      this.fields.splice(i, 1)
      this.setValidity(fieldComponent.fieldValue.modelKey)
    },
    setValidity(key, val) {
      const validity = {}
      if (key) {
        Object.assign(validity, this.validity)
        if (val === undefined) {
          delete validity[key]
        } else {
          validity[key] = val
        }
      }

      let dirty = false
      let invalid = false
      let valid = true
      let firstInvalidFieldKey = ''
      this.fields.forEach((fieldComponent) => {
        const modelKey = fieldComponent.fieldValue.modelKey
        if (modelKey) {
          const retVal = validity[modelKey]
          if (retVal) {
            if (retVal.dirty) {
              dirty = true
            }
            if (retVal.valid === false) {
              valid = false
            } else if (valid && !retVal.valid) {
              valid = retVal.valid
            }

            if (!invalid && retVal.valid === false) {
              // invalid
              invalid = true
              firstInvalidFieldKey = modelKey
            }
          } else if (fieldComponent.hasRules) {
            if (valid) {
              valid = undefined
            }
            validity[modelKey] = {
              valid: undefined,
              result: {},
              dirty: false
            }
          }
        }
      })
      this.validity = validity
      this.dirty = dirty
      this.originValid = valid
      this.setFirstInvalid(firstInvalidFieldKey)
      this.validatedCount++
    },
    setFirstInvalid(key) {
      if (!key) {
        this.firstInvalidField = null
        this.firstInvalidFieldIndex = -1
        return
      }
      this.fields.some((fieldComponent, index) => {
        if (fieldComponent.fieldValue.modelKey === key) {
          this.firstInvalidField = fieldComponent
          this.firstInvalidFieldIndex = index
          return true
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "../../common/styles/variable.scss";
  @import "../../common/styles/mixin.scss";
  .empty-b-isAndroid{
    height: 240PX;
    width: 100%;
  }
  .empty-b-isIos{
    height: 300PX;
    width: 100%;
  }

  .fd-form-fixedHeaderTop{
    position: fixed!important;
    transform: none;
    top: 0px;
  }
  .fd-form-fixedHeader{
    position: fixed!important;
    transform: none;
    top: 0px;
  }
  .fd-form-fixfixed {
    position: absolute!important;
  }

  .fd-form-contanier{
    // box-sizing: border-box;
    // overflow: hidden;
    height: 100%;
    .title{
      width: 340px !important;
    }
  }
  .header-button{
    font-size:30px;
    font-weight:500;
    color:rgba(255,255,255,1);
    margin-top: 4px;
    span:first-child{
      padding-right: 24px;
    }
  }
  .fd-form{
    // position: relative;
    // position: absolute;
    // top: 125px;
    // bottom: 10px;
    // left: 0px;
    // width: 100%;
    // margin-bottom: 50px;
    /* 使之可以滚动 */
    height: 100%;
    // overflow-y: scroll !important;
    // -webkit-overflow-scrolling: touch; /* 增加该属性，可以增加弹性，是滑动更加顺畅 */
    font-size:$fontsize-28;
    color: $form-color;
  }
  .fd-button-group{
    padding:30px 40px 40px;
    display: flex;
    .van-button {
      height:76px;
      line-height: 76px;
      font-size:28px;
      border-radius:4px;
      font-weight:500;
      color:rgba(255,255,255,1);
      background:rgba(182,0,5,1);
      flex: 1;
    }
  }
  .fd-form_groups{
    .fd-form-group-legend{
      padding: 0 40px 17px 40px;
      &:empty{
      padding-top: 5px;
        padding-bottom: 5px;
      }
    }
  }

  .fd-form_standard{
    .fd-form-field{
      flex: 1;
      font-size: $fontsize-medium;
    }
    .fd-validator{
      display: flex;
      align-items: center;
      position: relative;
    }
    .fd-validator_invalid{
      color: $form-invalid-color;
    }
    .fd-validator-content{
      flex: 1;
    }
    .fd-validator-msg-def{
      font-size: 0
    }
    .fd-validator_invalid{
      .cube-validator-msg{
        &::before{
          content: "\e614";
          padding-left: 5px;
          font-family: "cube-icon"!important;
          font-size: $fontsize-large-xx;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -webkit-text-stroke-width: 0.2px;
          -moz-osx-font-smoothing: grayscale;
        }
      }
    }
    .fd-form-label{
      min-width: 120px;
      max-width: 250px;
      padding-right: 10px;
    }
    .fd-checkbox-group, .fd-radio-group{
      &::before, &::after{
        display: none;
      }
    }
    .fd-input{
      input{
        background-color: transparent;
      }
      &::after{
        display: none;
      }
    }
    .fd-textarea-wrapper{
      padding: 13px 0;
      height: 20px;
      &.fd-textarea_expanded{
        height: 60px;
        padding-bottom: 20px;
        .fd-textarea-indicator{
          bottom: 2px;
        }
      }
      .cube-textarea{
        padding: 0;
        background-color: transparent;
      }
      &::after{
        display: none;
      }
    }
    .fd-select{
      padding-left: 0;
      background-color: transparent;
      &::after{
        display: none;
      }
    }
    .fd-upload-def{
      padding: 5px 0;
      .fd-upload-btn, .fd-upload-file{
        margin: 5px 10px 5px 0;
      }
    }
  }

  .fd-form_classic{
    .fd-form-item{
      display: block;
      padding: 15px;
      &:last-child{
        padding-bottom: 30px;
      }
      &::after{
        display: none;
      }
      .fd-validator-msg{
        position: absolute;
        margin-top: 3px;
        &::before{
          display: none;
        }
      }
      .fd-validator-msg-def{
        font-size: $fontsize-small;
      }
    }
    .fd-form-item_btn{
      padding-top: 0;
      padding-bottom: 0;
      &:last-child{
        padding-bottom: 0;
      }
    }
    .fd-form-label{
      padding-bottom: 15px;
    }
  }

  .fd-form_fresh{
    .fd-form-item{
      display: block;
      padding: 2em 15px 10px;
      &::after{
        display: none;
      }
      .fd-validator-msg{
        position: absolute;
        top: 1em;
        right: 15px;
        bottom: auto;
        margin-top: -.4em;
        font-size: $fontsize-small;
        &::before{
          display: none;
        }
      }
      .fd-validator-msg-def{
        font-size: 100%;
      }
    }
    .fd-form-item_btn{
      padding-top: 0;
      padding-bottom: 0;
      &:last-child{
        padding-bottom: 0;
      }
    }
    .fd-form-label{
      position: absolute;
      top: 1em;
      margin-top: -.4em;
      font-size: $fontsize-small;
    }
  }
</style>

