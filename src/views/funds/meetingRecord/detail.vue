<template>
  <div class="">
    <headerx cat-title="会议记录详情" page-type="back" @closeBack="back">
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
    back() {
      // $router.push({path: '/meetingRecordList', query: $route.query })
      if (this.$route.query.reload) {
        if (this.$route.query.isEdit) {
          this.$router.go(-3)
          return
        }
        this.$router.go(-2)
        return
      }
      this.$router.go(-1)
    },
    updateDetail() {
      this.$router.push({
        path: '/fundsMeetingRecordAdd',
        query: { MEETING_ID: this.MEETING_ID, enteId: this.$route.query.enteId }
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
