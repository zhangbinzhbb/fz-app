<template>
  <div class="healthy-list has-comment">
    <headerx cat-title="我的订餐"/>
    <div class="comment-content no-comment">
      <div class="tab-header">
        <span
          v-for="(item,index) in headerTab"
          :class="{ activeColor:active === item.value }"
          :key="index"
          @click="tabAcive(item,index)"
        >{{ item.label }}</span>
      </div>
      <div style="height:100%;">
        <div v-if="List.length" class="table-content">
          <div class="healthy-card">
            <div v-for="(td,key) in List" :key="key" class="healthy-card-item">
              <p class="t1">
                <span class="time">{{ td.orderDate || '--' }}</span>
                <span v-if="td.statue==='未提交'" class="status">{{ td.statue }}</span>
                <span v-if="td.statue==='不预订'" class="status1">{{ td.statue }}</span>
                <span v-if="td.statue==='已预订'" class="status2">{{ td.statue }}</span>
              </p>
              <p v-if="td.statue!=='未提交'" class="t2">
                <span class="name">操作人：{{ td.orderBy }}</span>
                <span class="time">操作时间：{{ td.operateDate }}</span>
              </p>
              <p v-if="td.statue==='已预订'" class="t3">
                <span v-if="td.orderButton==='-'">--</span>
                <span
                  v-if="td.orderButton==='cancel'"
                  class="tag"
                  @click="orderHandler(td.orderId)"
                >取消预订</span>
              </p>
            </div>
          </div>
        </div>
        <blank v-else/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeader: ['日期', '状态', '操作时间', '操作'],
      headerTab: [
        {
          label: '全部',
          value: '3',
          active: false
        },
        {
          label: '已预订',
          value: '1',
          active: false
        },
        {
          label: '不预订',
          value: '2',
          active: false
        },
        {
          label: '未提交',
          value: '0',
          active: false
        }
      ],
      List: [],
      active: '3'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    tabAcive(item, index) {
      // item.active = !item.active
      // this.$set(this.headerTab[index], 'active', item.active)
      // const arr = []
      // this.headerTab.map(item => {
      //   if (item.active) {
      //     arr.push(item.value)
      //   }
      // })
      // console.log('arr:', arr)
      // const status = arr.join(',')
      this.active = item.value
      let value = item.value
      if (this.active === '3') {
        value = ''
      }
      this.getList(value)
    },
    getList(statue = '') {
      const URL = '/orderAction/list.do'
      this.$axios.get(
        URL,
        {
          pageSize: 100,
          curPage: 1,
          statue
        },
        res => {
          this.List = res.dataContent
        }
      )
    },
    orderHandler(id) {
      // 0未提交 1预定 2未预定
      const params = {
        statue: '2',
        orderId: id
      }
      const postUrl = '/orderAction/save.do'
      const update = () => {
        this.$axios.post(
          postUrl,
          params,
          res => {
            if (res.statue === '0') {
              this.getList(this.active)
            }
          },
          error => {
            this.Toast(`${error.msg}`)
          }
        )
      }
      this.$dialog
        .confirm({
          title: '温馨提示',
          message: '确定进行不预订操作'
        })
        .then(() => {
          update()
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.healthy-list {
  .activeColor {
    background: rgba(182, 0, 5, 0.1);
    border: 1px solid rgba(182, 0, 5, 1) !important;
    color: rgba(182, 0, 5, 1) !important;
  }
  .tab-header {
    padding: 18px 40px;
    background-color: #fff;
    display: flex;
    span {
      height: 64px;
      line-height: 64px;
      border-radius: 4px;
      border: 1px solid rgba(225, 225, 225, 1);
      padding: 0 20px;
      font-size: 26px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      & + span {
        margin-left: 16px;
      }
    }
  }
  .table-content {
    .healthy-card {
      .healthy-card-item {
        margin-top: 20px;
        background-color: #fff;
        font-size: 28px;
        font-weight: 400;
        color: rgba(76, 76, 76, 1);
        padding: 20px;
        .t1 {
          display: flex;
          justify-content: space-between;
          span {
            height: 40px;
            line-height: 40px;
            font-size: 28px;
            font-weight: 400;
            padding: 0 10px;
          }
          .status {
            background: #d9f1e3;
            color: #6bb17b;
          }
          .status1 {
            background: rgba(182, 0, 5, 1);
            color: #fff;
          }
          .status2 {
            background: #fff3d8;
            color: #d59d3e;
          }
        }
        .t2 {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 22px;
        }
        .t3 {
          display: flex;
          justify-content: flex-end;
          .tag {
            width: 145px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            border-radius: 4px;
            border: 1px solid rgba(182, 0, 5, 1);
          }
        }
      }
    }
  }
}
</style>
