<template>
  <div class="schedule-details">
    <headerx cat-title="日程" page-type="back" @closeBack="$router.push({path: '/mySchedule'})">
      <template slot="right">
        <span class="yh-add-more" @click="updateDetail">编辑</span>
      </template>
    </headerx>

    <basic-form
      :schema="schema"
      :model="detail"
    >
      <!-- <template>
        <div slot="important">
          {{ detail.IMPORTANCE_LEVEL || '--' }}
        </div>
      </template> -->
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
    return {
      id: this.$route.query.id
    }
  },
  created() {
    this.clearReffer()
  },
  methods: {
    updateDetail() {
      this.$router.push({
        path: '/scheduleNew',
        query: { id: this.id }
      })
    }
  }
}
</script>

