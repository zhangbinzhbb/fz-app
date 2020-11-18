<template>
  <li
    :class="{'fd-checker-item_active': isActive, 'fd-checker-item_disabled': isDisabled}"
    class="fd-checker-item"
    @click="clickHandler"
  >
    <slot>
      <span v-html="option.text"/>
    </slot>
  </li>
</template>
<script type="text/ecmascript-6">
const COMPONENT_NAME = 'fd-checker-item'

export default {
  name: COMPONENT_NAME,
  props: {
    option: {
      type: Object,
      default() {
        /* istanbul ignore next */
        return {}
      }
    }
  },
  computed: {
    isActive() {
      const isRadio = this.$parent.isRadio
      const currentValue = this.$parent.currentValue
      const value = this.option.value
      return isRadio ? currentValue === value : currentValue.indexOf(value) >= 0
    },
    isDisabled() {
      return this.option.disabled
    }
  },
  methods: {
    clickHandler() {
      if (this.isDisabled) {
        return
      }
      this.$parent.check(this.option)
    }
  }
}
</script>
<style lang="scss">
  @import "../../common/styles/variable.scss";
  @import "../../common/styles/mixin.scss";

  .fd-checker-item{
    display: inline-block;
    vertical-align: top;
    text-align: center;
    padding: 14px 20px;
    margin-left: 16px;
    color: $checker-item-color;
    background: $checker-item-bgc;
    border-radius: 4px;
    border: 2px solid $checker-item-bdc;
    font-size:26px;
    margin-top: 10px;
  }
  .fd-checker-item_active{
    color: $checker-item-active-color;
    background: $checker-item-active-bgc;
    border: 2px solid $checker-item-active-bdc;
    &.fd-checker-item_disabled{
      background: $checker-item-disabled-bgc;
      border: 2px solid $checker-item-disabled-bdc;
    }
  }
  .fd-checker-item_disabled{
    color: $checker-item-disabled-color
  }
</style>
