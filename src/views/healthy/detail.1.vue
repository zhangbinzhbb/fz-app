<template>
  <div class="meeting-apply">
    <headerx cat-title="每日健康上报详情" />
    <basic-form
      :schema="schema"
      :model="model"
    >
      <template>
        <div slot="situation">
          {{ model.situation?model.situation=== 0?'正常':'异常':'正常' }} <!-- 0正常；1异常 -->
        </div>
        <div slot="symptom">
          {{ model.symptom }}
        </div>
      </template>
    </basic-form>
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  components: {
    basicForm: () => import('@/components/basicForm/detail')
  },
  mixins: [mixins],
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
