<template>
  <div class="">
    <headerx :cat-title="detail.VISIT_COMPANY || '来访接待详情'" page-type="back" @closeBack="$router.push({path: '/visitList', query: $route.query})">
      <template slot="right">
        <span class="yh-add-more" @click="updateDetail">编辑</span>
      </template>
    </headerx>
    <basic-form
      :schema="schema"
      :model="detail"
      @viewFile="viewFile"
    >
      <div slot="VISIT_NUMBER">
        {{ detail.VISIT_NUMBER }} 人
      </div>
      <div slot="SERVICE_LIST_NAME">
        {{ detail.SERVICE_LIST_NAME }}
      </div>
      <div slot="MEETING_SERVICE_LIST_NAME">
        {{ detail.MEETING_SERVICE_LIST_NAME }}
      </div>
      <div slot="VISIT_EXHIBITION_NUM">
        {{ detail.VISIT_EXHIBITION_NUM }} 人
      </div>
      <div slot="VISITOR_IMPORTANT">
        {{ detail.VISITOR_IMPORTANT === '0' ? '普通来宾' : '重要来宾' }}
      </div>
    </basic-form>
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
      APPLY_NO: this.$route.query.APPLY_NO
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    updateDetail() {
      if (this.detail.STATUS === '3' && this.storage.get('yh-user').userId !== this.detail.MANAGER_ID) {
        this.Toast('您没有编辑权限')
      } else {
        this.$router.push({
          path: '/visitAdd',
          query: { APPLY_NO: this.APPLY_NO }
        })
      }
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
