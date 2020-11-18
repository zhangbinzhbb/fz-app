<template>
  <div class="has-comment">
    <headerx cat-title="投资信息">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment yh-new-list">
      <div v-if="typeList.length > 1" class="tabs-con-globle tabs-con">
        <span
          v-for="(item,index) in typeList"
          :class="{'active':selectTab==index}"
          :key="index"
          class="tab-item"
          @click="selectTab=index"
        >{{ item }}</span>
      </div>
      <template v-if="typeList.indexOf('投资项目') > -1">
        <div v-show="selectTab===0">
          <funds-p />
        </div>
      </template>
      <template v-if="typeList.indexOf('投资子基金') > -1">
        <div v-show="selectTab===1">
          <funds-c />
        </div>
      </template>
      <blank v-if="isNull" style="height: calc(100vh - 60px)"/>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    'funds-c': () => import('./fundsInv_c.vue'),
    'funds-p': () => import('./fundsInv_p.vue')
  },
  filters: {
    formatAmount(v) {
      return ((parseFloat(v)) / 10000).toFixed(2)
    }
  },
  data() {
    return {
      typeList: [],
      selectTab: 1,
      funId: this.$route.query.id,
      isNull: false
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.$axios.get(`/fundInfoDetail/${this.funId}`,
        null,
        res => {
          if (res.status === '0') {
            const data = res.data
            if (data) {
              if (!data.model.fundInvestType) {
                this.isNull = true
                return
              }
              if (data.model.fundInvestType.indexOf('项目') > -1) {
                this.selectTab = 0
                this.typeList.push('投资项目')
              }
              if (data.model.fundInvestType.indexOf('子基金') > -1) {
                this.typeList.push('投资子基金')
              }
            } else {
              this.isNull = true
            }
          }
        }
      )
    }

  }
}
</script>
