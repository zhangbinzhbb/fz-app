<template>
  <div class="fd-form-group">
    <p v-if="legend" class="fd-form-group-legend">{{ legend }}</p>
    <div class="fd-form-group-content">
      <slot>
        <fd-form-item
          v-for="(field, index) in fields"
          :key="index"
          :field="field"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import FdFormItem from './form-item.vue'

const COMPONENT_NAME = 'fd-form-group'
export default {
  name: COMPONENT_NAME,
  components: {
    FdFormItem
  },
  props: {
    legend: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default() {
        /* istanbul ignore next */
        return []
      }
    }
  },
  beforeCreate() {
    this.form = this.$parent.form
  },
  beforeDestroy() {
    this.form = null
  }
}
</script>

<style lang="scss">
  @import "../../common/styles/variable.scss";
  @import "../../common/styles/mixin.scss";

  .fd-form-group{
    overflow: hidden;
    margin-bottom: 17px;
    background-color: #F8F8F8;
  }
  .fd-form-group-legend{
    font-size: $fontsize-large-xxx;
    color: $form-group-legend-color;
    background-color: $form-group-legend-bgc;
  }
</style>
