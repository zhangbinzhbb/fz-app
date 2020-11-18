<template>
  <div class="order has-comment">
    <headerx cat-title="每日订餐" page-type="back" @closeBack="closeBackHanler"/>
    <div class="comment-content no-comment">
      <div>
        <fd-form :model="model">
          <fd-form-group>
            <fd-form-item :field="fields[0]"/>
            <fd-form-item :field="fields[1]">
              <span class="field-first">{{ model.deptName }}</span>
            </fd-form-item>
            <fd-form-item :field="fields[2]"/>
            <fd-form-item :field="fields[3]"/>
            <!-- 0未提交 1预定 2未预定 -->
            <fd-form-item v-if="orderStatue!=='0'" :field="fields[4]">
              <span v-if="orderStatue==='0'">未提交</span>
              <span v-if="orderStatue==='1'">已预订</span>
              <span v-if="orderStatue==='2'">未预订</span>
            </fd-form-item>
          </fd-form-group>
          <div v-if="orderStatue==='0'" class="pro-button-box">
            <span @click="orderHandler('1')">预订</span>
            <span @click="orderHandler('2')">不预订</span>
          </div>
        </fd-form>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from './mixins/index'
import { getUrlKey } from '@/utils/common.js'
export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    fdFormGroup: () => import('@/components/form/form-group'),
    fdFormItem: () => import('@/components/form/form-item'),
    more: () => import('@/components/more/index')
  },
  mixins: [mixins],
  data() {
    return {
      moreBtns: [
        {
          name: '列表',
          url: 'healthList',
          imgSrc: 'static/images/icon13.png'
        },
        {
          name: '人员',
          url: 'allHealthList',
          imgSrc: 'static/images/icon14.png'
        },
        {
          name: '统计',
          url: 'healthStatistics',
          imgSrc: 'static/images/icon14.png'
        }
      ]
    }
  },
  methods: {
    moreToggle() {
      this.$refs.more.showToggle()
    },
    closeBackHanler() {
      const windowType = getUrlKey('windowType')
      if (windowType) {
        window.close()
        return
      }
      this.$router.push({ path: '/process' })
    },
    orderHandler(type) {
      // 0未提交 1预定 2未预定
      const params = {
        statue: type,
        orderId: this.orderId
      }
      const postUrl = '/orderAction/save.do'
      const update = () => {
        this.$axios.post(
          postUrl,
          params,
          res => {
            if (res.statue === '0') {
              const windowType = getUrlKey('windowType')
              if (windowType) {
                window.close()
                return
              }
              this.$router.push({ path: '/process' })
            }
          },
          error => {
            this.Toast(`${error.msg}`)
          }
        )
      }
      const message = type === '1' ? '确定进行预订操作' : '确定进行取消预订操作'
      this.$dialog.confirm({
        title: '温馨提示',
        message: message
      }).then(() => {
        update()
      }).catch(() => {
        // on cancel
      })
    }
  }
}
</script>

<style lang="scss">
.order{
  .pro-button-box{
    display: flex;
    justify-content: center;
    padding-top: 50px;
    span{
      width:320px;
      height:76px;
      line-height: 76px;
      background:rgba(182,0,5,1);
      border-radius:4px;
      font-size:28px;
      font-weight:500;
      color:rgba(255,255,255,1);
      text-align: center;
      &+span{
        margin-left: 20px;
      }
    }
  }
}
</style>
