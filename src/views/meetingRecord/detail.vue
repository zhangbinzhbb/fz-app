<template>
  <div class="">
    <headerx cat-title="会议记录详情" page-type="back" @closeBack="$router.push({path: '/meetingRecordList', query: $route.query })">
      <template slot="right">
        <span class="yh-add-more" @click="updateDetail">编辑</span>
      </template>
    </headerx>
    <basic-form
      :schema="schema"
      :model="detail"
      @viewFile="viewFile"
    />
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  name: '',
  components: {
    basicForm: () => import('@/components/basicForm/detail')
  },
  mixins: [mixins],
  props: {},
  data() {
    return {
      MEETING_ID: this.$route.query.MEETING_ID
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    updateDetail() {
      this.$router.push({
        path: '/meetingRecordAdd',
        query: { MEETING_ID: this.MEETING_ID }
      })
    },
    viewFile(e) {
      this.$axios.post(`/fileAction/loadFileOA.do?fileId=${e.id}&systemType=OA`,
        {},
        res => {
          if (res.dataContent.url) {
            this.$router.push({ path: '/attachDetail', query: { src: res.dataContent.url }})
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped></style>
