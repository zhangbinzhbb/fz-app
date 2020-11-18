<template>
  <div class="has-comment schedule-details">
    <headerx cat-title="全部人员" />
    <div class="sure-content">
      <ul class="content">
        <li v-for="item in userList" :key="item.value">
          <div class="top">
            <div v-if="item.src" class="img">
              <img :src="item.src">
            </div>
            <div v-else class="icon-img">
              {{ item.label | formatName }}
            </div>
          </div>
          <p class="name van-ellipsis">{{ item.label }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: null,
      userList: []
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getDetail(this.id)
  },
  methods: {
    getDetail(id) {
      if (id > 0) {
        this.$axios.post(
          '/agendaAction/agendaDetail.do',
          { AGENDA_ID: id },
          res => {
            this.model = res.dataContent
            const list = this.model.scheduleuserList
            const newList = list.map(item => {
              return {
                label: item.NAME,
                value: item.ID,
                src: item.FACE_PATH
              }
            })
            this.userList = newList
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sure-content{
  width: 100%;
  background-color: #fff;
  padding:0px 40px 50px;
  .content{
    display: flex;
    flex-wrap: wrap;
    li{
      padding-right:50px;
      padding-top: 50px;
      &:nth-child(5n){
        padding-right:0px;
      }
      .name{
        width: 80px;
        height:30px;
        font-size:22px;
        font-weight:500;
        color:rgba(45,57,56,1);
        line-height:30px;
        text-align: center;
        padding-top: 8px;
      }
      .top{
          position: relative;
        .img{
          width:94px;
          height:94px;
          border-radius:47px;
        }
        img{
          width:100%;
          height:100%;
          border-radius:47px;
        }
        .icon-img{
          width:94px;
          height:94px;
          background:rgba(248,181,38,1);
          border-radius:47px;
          font-size:30px;
          font-weight:500;
          color:rgba(255,255,255,1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
