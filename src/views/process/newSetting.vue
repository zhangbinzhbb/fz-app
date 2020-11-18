<template>
  <div class="DemandApproval has-comment process-new-setting">
    <headerx cat-title="新增代理"/>
    <div class="setting-item">
      <van-cell-group>
        <van-field
          v-model="detail.SDATE"
          label-align="center"
          required
          label="开始时间"
          placeholder="请选择"
          right-icon="arrow"
          readonly="readonly"
          @click="showDatePicker('termStart')"
        />
        <van-field
          v-model="detail.EDATE"
          required
          label="结束时间"
          placeholder="请选择"
          label-align="left"
          right-icon="arrow"
          readonly="readonly"
          @click="showDatePicker('termEnd')"
        />
        <van-field
          v-model="detail.PROCESS_NAME"
          label="代理流程"
          placeholder="所有流程"
          label-align="left"
          disabled
        />
      </van-cell-group>
      <div :class="{'flex-direction':userList.length>5}" class="van-field person-select" >
        <span class="van-cell__title">代理人 <em>*</em></span>
        <div v-if="userList.length===0">
          <img v-if="needUrl" :src="backgroundImage" class="avator">
          <div v-else :style="{'background-color':backgroundColor}" class="name">{{ personName }}</div>
        </div>
        <div v-else :class="{'user-navs':userList.length>5}" class="user-nav-list">
          <ul class="user-list-content">
            <li v-for="item in userList" :key="item.value" class="user-item" @click="delChange(index)">
              <div class="item-pic">
                <img v-if="item.src" :src="item.src" alt="" srcset="">
                <span v-else>{{ item.label | formatName }}</span>
                <img src="@/assets//images/org-delet.png" class="icon-del">
              </div>
              <span class="item-name van-ellipsis">{{ item.label }}</span>
            </li>
          </ul>
        </div>
        <van-icon name="arrow" @click="rightPopupOpen"/>
      </div>
      <van-popup v-model="isPopShow" position="bottom">
        <!-- 开始时间 -->
        <van-datetime-picker
          v-if="datePicker == 'termStart'"
          v-model="startTime"
          :formatter="formatter"
          type="date"
          @cancel="cancelPicker"
          @confirm="confirmPicker"
        />
        <!-- 结束时间 -->
        <van-datetime-picker
          v-if="datePicker == 'termEnd'"
          v-model="endTime"
          :formatter="formatter"
          type="date"
          @cancel="cancelPicker"
          @confirm="confirmPicker"
        />
      </van-popup>
      <div class="submit-group">
        <van-button class="yh-small-btn" @click="submit">保存</van-button>
      </div>
      <vueTreeSelect ref="rightPopupTreeSelect" :default-array="userList" cat-title="代理人" @select-change="userSelectChange"/>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    vueTreeSelect: () => import('@/components/vueTreeSelect/index')
  },
  data() {
    return {
      catTitle: '代理人',
      backgroundColor: '#fff',
      personName: '',
      backgroundImage: '',
      needUrl: false,
      detail: {
        SDATE: '',
        EDATE: '',
        PROCESS_NAME: '',
        AUSERNAME: '',
        PROCESS_ID: '',
        nameId: 'AUSER',
        options: [],
        optionLabelName: 'NAME',
        optionIdName: 'ID'
      },
      currentTime: new Date(), // 开始时间不能超过当前时间
      startTime: new Date(), // 开始时间
      endTime: new Date(), // 结束时间
      datePicker: '', // 用于判断哪个选择器的显示与隐藏
      isPopShow: false, // 弹出层隐藏与显示
      userList: []
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    userSelectChange(arr) {
      this.userList = arr
    },
    showDatePicker(picker) { // 弹出层并显示时间选择器
      this.isPopShow = true
      this.datePicker = picker
    },
    cancelPicker() { // 选择器取消按钮点击事件
      this.isPopShow = false
      this.datePicker = ''
    },
    confirmPicker(value) { // 确定按钮，时间格式化并显示在页面上
      var date = value
      var m = date.getMonth() + 1
      var d = date.getDate()
      if (m >= 1 && m <= 9) {
        m = '0' + m
      }
      if (d >= 0 && d <= 9) {
        d = '0' + d
      }
      var timer = date.getFullYear() + '-' + m + '-' + d
      if (this.datePicker === 'termStart') {
        this.detail.SDATE = timer
      }
      if (this.datePicker === 'termEnd') {
        this.detail.EDATE = timer
      }
      this.isPopShow = false
      this.datePicker = ''
    },
    formatter(type, value) { // 格式化选择器日期
      if (type === 'year') {
        return `${value}`
      } else if (type === 'month') {
        return `${value}`
      }
      return value
    },
    // 打开右侧页面-选人
    rightPopupOpen() {
      this.$refs.rightPopupTreeSelect.showPopup()
      // ios12页面的关系，打开子页面的时候与'has-comment'css样式冲突，打开右侧弹出页面，样式去掉，关闭右侧页面需要恢复（headerx组件中)
      // const content = document.getElementsByClassName('has-comment')
      // content[0].classList.remove('has-comment')
    },
    delChange(index) {
      this.userList.splice(index, 1)
    },
    goback() {
      window.history.back(-1)
    },
    // 多选
    checkOne(id) {
      var ids = this.Listids.indexOf(id)
      if (ids >= 0) {
        // 如果包含了该ID，则删除（单选按钮由选中变为非选中状态）
        this.Listids.splice(ids, 1)
      } else {
        // 选中该按钮
        this.Listids.push(id)
      }
      // console.log(this.Listids)
    },
    // 单选
    // 提醒方式
    checkDan(id) {
      this.num = id
      // console.log(this.radios[id].value)
    },
    // 关注日程
    checkDan2(id) {
      this.num2 = id
      // console.log(this.richen[id].value)
    },
    // 提供服务
    checkOne2(id) {
      var ids = this.Listids2.indexOf(id)
      if (ids >= 0) {
        // 如果包含了该ID，则删除（单选按钮由选中变为非选中状态）
        this.Listids2.splice(ids, 1)
      } else {
        // 选中该按钮
        this.Listids2.push(id)
      }
      // console.log(this.Listids2[id].value)
    },
    getDetail() {
      this.$axios.post(
        '/PersonalSettingAction/getFixflowAgent.do',
        null,
        res => {
          this.detail.SDATE = res.dataContent.SDATE // 开始时间
          this.detail.EDATE = res.dataContent.EDATE // 结束时间
          this.detail.AUSERNAME = res.dataContent.AUSERNAME // 代理人
          this.detail.PROCESS_ID =
            res.dataContent.PROCESS_ID || '_fix_flow_all_flow' // 代理流程
          this.detail.PROCESS_NAME = res.dataContent.PROCESS_NAME || '所有流程'
          // console.log('this.detail:----')
          // console.log(this.detail)
        }
      )
    },
    submit() {
      const postUrl = '/PersonalSettingAction/addFixflowAgent.do'
      const PROCESS_ID = '_fix_flow_all_flow'
      const PROCESS_NAME = '所有流程'
      const SDATE = this.detail.SDATE
      const EDATE = this.detail.EDATE
      const userList = this.userList
      if (this.detail.SDATE === undefined || this.detail.EDATE === undefined || userList.length === 0) {
        this.Toast('请输入必填项')
      } else if (userList.length > 1) {
        this.Toast('代理人只能选择一个')
      } else {
        const verifing = [
          {
            name: 'compareDate',
            content: this.detail.SDATE + ';' + this.detail.EDATE,
            tip: '结束时间不能早于开始时间'
          }
        ]
        const nameArr = []
        const idArr = []
        userList.forEach(item => {
          nameArr.push(item.label)
          idArr.push(item.value)
        })
        const AUSER = idArr.join(',')
        const AUSERNAME = nameArr.join(',')
        const paramete = {
          PROCESS_ID,
          PROCESS_NAME,
          AUSER,
          AUSERNAME,
          SDATE,
          EDATE
        }
        const update = () => {
          this.$axios.post(postUrl, paramete, res => {
            this.Toast('保存成功！')
            window.history.back(-1)
          })
        }
        if (this.verify.verified(verifing)) {
          update()
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .process-new-setting{
    .mint-popup-right {
      z-index: 2061!important;
    }
  }
  .flex-direction{
    flex-direction: column;
    display: flex;
  }
  .user-navs{
    padding-right:0px !important;
    .user-list-content {
      flex-wrap: wrap;
      justify-content: flex-end;
      .user-item{
        margin-top: 34px;
      }
    }
  }
  .user-nav-list{
    display: flex;
    justify-content: flex-end;
    padding-right: 30px;
    margin-top:60px!important;
    .user-list-content{
      float: left;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 100%;
      margin-left: -20px;
      display: flex;
      .user-item{
        /*display: flex;*/
        /*flex-direction: column;*/
        /*text-align: center;*/
        /*width:68px;*/
        /*height:68px;*/
        /*margin-left: 33px;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90px;
        margin:20px 10px 20px 0px;
        .item-pic{
          width:68px;
          height:68px;
          background:rgba(255,255,255,1);
          border-radius:50%;
          box-shadow: 2px 2px 8px #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          position: relative;
          img{
            width:60px;
            height:60px;
            border-radius:30px;
          }
          img.icon-del{
            width: 34px;
            height: 34px;
            position: absolute;
            top:-10px;
            right:-10px;
          }
          span{
            width:60px;
            height:60px;
            background:rgba(248,181,38,1);
            border-radius:47px;
            font-size:20px;
            font-weight:500;
            color:rgba(255,255,255,1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .item-name{
          height:33px;
          font-size:24px;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:33px;
        }
      }
    }
  }

  .setting-item{
    .person-select{
      overflow: hidden;
      position: relative;
      .van-icon{
        position: absolute;
        top: 30px;
        right:40px;
        font-size: 28px;
      }
      .van-cell__title{
        float: left;
        text-align: left;
        position: relative;
        em{
          position: absolute;
          right: -25px;
          top: 4px;
          font-size: 40px;
          color: #f44;
          font-style: normal;
        }
      }
      .slot-img {
        width: 45px;
        float: right;
      }
      .name{
        // background-color: transparent;
        // border: 0;
        height:60px;
        width: 60px;
        font-size:28px;
        line-height:60px;
        text-align: right;
        float: right;
        margin-right: 20px;
        text-align: center;
        border-radius: 50%;
        font-size: 20px;
        color: #fff;
      }
      .avator{
        height:60px;
        width: 60px;
        float: right;
        border-radius: 50%;
        margin-right: 20px;
      }
    }
    .van-field{
      padding: 30px 40px;
      background: #fff;
    }
    .van-cell__title{
      width:112px;
      height:40px;
      font-size:28px;
      color:rgba(158,158,157,1);
      line-height:40px;
      display: inline-block;
    }
    .van-cell--required:before {
      font-size: 40px;
      left: 160px;
      top: 34px;
    }
    .van-cell__value{
      height:40px;
      font-size:28px;
      color:rgba(76,76,76,1);
      line-height:40px;
      .van-field__body{
        margin-top: 0;
        .van-field__control{
          text-align: right;
        }
      }
      .van-icon{
        font-size: 28px;
      }
    }
  }
  .process-new-setting{
    .van-cell--required::before {
      top:44px;
    }
    .van-cell-group>div:nth-of-type(2){
      margin-bottom: 18px;
    }
    .van-cell-group>div:nth-of-type(1),.van-cell-group>div:nth-of-type(3){
      border-bottom: 2px solid #e8e8e8;
    }
    .submit-group {
      background: white;
      padding: 80px 0;
      text-align: center;
      position: fixed;
      bottom: 0;
      width: 100%;
      background: none;
      padding-bottom: 40px;
      .yh-small-btn{
        display: block;
        width: 670px;
        height: 76px;
        background: rgba(183, 0, 7, 1);
        border-radius: 5px 5px 5px 5px;
        color: white;
        font-size: 36px;
        margin: 20px 40px 0 40px;
      }
    }
    .van-picker__toolbar,
    .picker-toolbar span,
    .picker-toolbar {
      height: 90px;
      line-height: 90px;
    }
    .van-picker__cancel{
      height:90px;
      font-size:30px;
      color:rgba(45,57,56,1);
      line-height:90px;
    }
    .van-picker__confirm{
      height:90px;
      font-size:30px;
      color:rgba(182,0,5,1);
      line-height:90px;
    }
    .van-picker-column__item{
      height:45px;
      font-size:32px;
      color:rgba(45,57,56,1);
      line-height:45px;
    }
  }
  .process-new-setting .van-cell--required:before{
    top:.453333rem;
  }
  .user-nav-list{
    padding-right:0;
    margin-top:80px;
  }
  .setting-item .person-select .van-icon{
    display: inline-block;
    width: .906667rem;
    height: .906667rem;
    background: #efeff0;
    font-size: .373333rem;
    line-height: .906667rem;
    border-radius: .453333rem;
    text-align: center;
    color: #bcc3d2;
  }
  .person-select .van-icon-arrow:before {
    content: "\F0A2";
  }
  .van-cell-group .van-field:nth-of-type(1)>.van-cell__title,
  .van-cell-group .van-field:nth-of-type(2)>.van-cell__title,
  .van-cell-group .van-field:nth-of-type(3)>.van-cell__title{
    width:auto;
    text-align: left;
  }
</style>
