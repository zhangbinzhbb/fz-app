<template>
  <div class="meeting-apply">
    <headerx cat-title="会议申请详情" page-type="back" @closeBack="$router.push({path: '/meetingList'})">
      <template slot="right">
        <span class="yh-add-more" @click="updateDetail">编辑</span>
      </template>
    </headerx>
    <basic-form
      :schema="schema"
      :model="detail"
    >
      <template>
        <div slot="meetingNumber">
          {{ detail.meetingNumber }} 人
        </div>
        <div slot="remindMode">
          {{ detail.meetingNumber }} 人
        </div>
      </template>
    </basic-form>
  </div>
</template>

<script>
import mixins from './mixins/index'
import { getDayDiff } from '@/utils/filter.js'
export default {
  components: {
    basicForm: () => import('@/components/basicForm/detail')
  },
  mixins: [mixins],
  data() {
    return {
      APPLY_NO: this.$route.query.APPLY_NO
    }
  },
  created() {},
  methods: {
    updateDetail() {
      const endTime = this.detail.meetingEndTime
      const current = new Date()
      const diff = getDayDiff(endTime, current)
      if (diff >= 0) {
        this.Toast(`会议已经结束!`)
        return
      }
      this.$router.push({
        path: '/meetingNew',
        query: { APPLY_NO: this.APPLY_NO }
      })
    }
  }
}
</script>
