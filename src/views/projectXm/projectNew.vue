<template>
  <div class="has-comment project-home-new">
    <headerx cat-title="新增项目"/>
    <div class="comment-content no-comment">
      <fd-form :model="model">
        <fd-form-group>
          <fd-form-item :field="fields[0]">
            <span class="field-first" @click="toSelect">{{ model.projObjectName || '请选择' }}<van-icon name="arrow"/></span>
          </fd-form-item>
          <fd-form-item :field="fields[1]"/>
          <fd-form-item :field="fields[2]"/>
          <fd-form-item :field="fields[3]"/>
        </fd-form-group>
        <div class="pro-button-box">
          <span>提交</span>
          <span>重置</span>
        </div>
      </fd-form>
    </div>
    <right-popup ref="rightPopup" cat-title="企业名称"/>
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    fdFormGroup: () => import('@/components/form/form-group'),
    fdFormItem: () => import('@/components/form/form-item'),
    rightPopup: () => import('@/components/rightPopup/halfCompany')
  },
  mixins: [mixins],
  data() {
    return {}
  },
  methods: {
    toSelect() {
      this.$refs.rightPopup.showPopup()
    }
  }
}
</script>

<style lang="scss" scoped>
.project-home-new{
  .field-first{
    display: flex;
    align-items: center;
  }
  .pro-button-box{
    display: flex;
    flex-direction: column;
    padding: 30px 40px;
    span{
      height:76px;
      line-height: 76px;
      text-align: center;
      background:rgba(182,0,5,1);
      border-radius:4px;
      font-size:28px;
      font-weight:500;
      color:rgba(255,255,255,1);
      &+span{
        margin-top: 20px;
      }
    }
  }
}
</style>
