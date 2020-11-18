<template>
  <div class="healthy-detail">
    <headerx cat-title="每日健康上报详情" />
    <div class="comment-content no-comment">
      <div>
        <div class="healthy-detail-group">
          <div class="healthy-detail-item">
            <span class="label">填报人</span>
            <span class="value">{{ model.reportBy || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">填报日期</span>
            <span class="value">{{ model.reportDtStr || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">健康状态</span>
            <span v-if="model.situation=== 0" class="value">正常</span>
            <span v-else-if="model.situation=== 1" class="value">异常</span>
            <span v-else class="value">正常</span>
          </div>
          <div v-if="model.situation=== 1" class="healthy-detail-item">
            <span class="label">具体症状</span>
            <span class="value">{{ model.symptom || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">已采取措施</span>
            <span class="value">{{ model.measures || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">今天上班情况</span>
            <span v-if="model.isPost=== '0'" class="value">公司办公</span>
            <span v-else-if="model.isPost=== '1'" class="value">隔离/在家办公</span>
            <span v-else-if="model.isPost=== '2'" class="value">未返苏</span>
            <span v-else-if="model.isPost=== '3'" class="value">请假</span>
            <span v-else-if="model.isPost=== '4'" class="value">周末/国假日</span>
            <span v-else class="value">--</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">办公地是否在苏州</span>
            <span class="value">{{ model.isSuzhou?model.isSuzhou=== '0'?'否':'是':'是' }}</span>
          </div>
          <!-- 办公地是否在苏州：
               否 下面的内容全部隐藏
          -->
          <div v-if="model.isSuzhou=== '1'" class="healthy-detail-item" >
            <span class="label">1月24日至今是否离开过苏州</span>
            <span class="value">{{ model.inSuzhou?model.inSuzhou=== '0'?'否':'是':'是' }}</span>
          </div>
          <div v-if="model.inSuzhou=== '1'&&model.isSuzhou=== '1'" class="healthy-detail-item">
            <span class="label">离开苏州时间、去往城市</span>
            <span class="value">{{ model.leaveCity || '--' }}</span>
          </div>
          <div v-if="model.isSuzhou=== '1'" class="healthy-detail-item">
            <span class="label">(预计)到达苏州日期</span>
            <span class="value">{{ model.arriveDtStr || '--' }}</span>
          </div>
          <div v-if="model.isSuzhou=== '1'" class="healthy-detail-item">
            <span class="label">同住家人健康状况</span>
            <span v-if="model.check1 ==='0'" class="value">单独居住</span>
            <span v-if="model.check1 ==='1'" class="value">同住家人一切正常，<br>无任何健康异常</span>
            <span v-if="model.check1 ==='2'" class="value">同住家人有健康异常情况</span>
          </div>
          <div v-if="model.check1 ==='2'&&model.isSuzhou=== '1'" class="healthy-detail-item">
            <span class="label">同住家人有健康异常情况</span>
            <span class="value">{{ model.content1 || '--' }}</span>
          </div>
        </div>
        <div v-if="model.isSuzhou=== '1'" class="healthy-detail-group">
          <div class="healthy-detail-item healthy-detail-item-1">
            <h2>过去2周内，是否途径、往返以下疫情重点地区或接触该地区相关人员，
            如有请选择并填写具体日期、行程（车次等）及相关人员信息</h2>
            <div v-for="(item,index) in checkboxList" :key="index" class="healthy-detail-item-check">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ model[item.modelKey2] || '--' }}</span>
            </div>
          </div>
          <div class="healthy-detail-item">
            <span class="label">过去2周内，是否接触上述疫情重点地区相关人员</span>
            <span class="value">{{ model.check15?model.check15=== '0'?'否':'是':'是' }}</span>
          </div>
          <div v-if="model.check15 ==='1'" class="healthy-detail-item">
            <span class="label"/>
            <span class="value">{{ model.content15 || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">是否从上述疫情重点地区以外地区返苏</span>
            <span class="value">{{ model.check2?model.check2=== '0'?'否':'是':'是' }}</span>
          </div>
          <div v-if="model.check2 ==='1'" class="healthy-detail-item">
            <span class="label"/>
            <span class="value">{{ model.content2 || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">是否与疑似或确诊病例人员接触</span>
            <span class="value">{{ model.check3?model.check3=== '0'?'否':'是':'是' }}</span>
          </div>
          <div v-if="model.check3 ==='1'" class="healthy-detail-item">
            <span class="label"/>
            <span class="value">{{ model.content2 || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">是否仍在上述疫情重点地区未返苏</span>
            <span class="value">{{ model.check4?model.check4=== '0'?'否':'是':'是' }}</span>
          </div>
          <div v-if="model.check4 ==='1'" class="healthy-detail-item">
            <span class="label"/>
            <span class="value">{{ model.content4 || '--' }}</span>
          </div>
        </div>
        <div v-if="model.isSuzhou=== '1'" class="healthy-detail-group">
          <div class="healthy-detail-item">
            <span class="label">苏州家庭住址</span>
            <span class="value">{{ model.address || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">所属街道(社工委)社区</span>
            <span class="value">{{ model.street || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">是否已向社区报备</span>
            <span class="value">{{ model.isReport?model.isReport=== '0'?'否':'是':'是' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">解除观察是否经社区确认</span>
            <span class="value">{{ model.isComfirm || '--' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  mixins: [mixins],
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.healthy-detail{
  .healthy-detail-group{
    background-color: #fff;
    &+.healthy-detail-group{
      margin-top: 18px;
    }
    .healthy-detail-item-1{
      display: flex;
      flex-direction: column;
      .healthy-detail-item-check{
        display: flex;
        justify-content: space-between;
        padding: 30px 0;
        &+.healthy-detail-item-check{
          border-top: 1px solid #F0F0F0;
        }
      }
      h2{
        font-size:28px;
        font-weight:500;
        color:rgba(158,158,157,1);
      }
    }
    .healthy-detail-item{
      display: flex;
      justify-content: space-between;
      padding: 30px 40px;
      &+.healthy-detail-item{
        border-top: 1px solid #F0F0F0;
      }
      span{
        font-size:28px;
        font-weight:500;
      }
      .label{
        color:rgba(158,158,157,1);
      }
      .value{
        color:rgba(76,76,76,1);
      }
    }
  }
}
</style>
