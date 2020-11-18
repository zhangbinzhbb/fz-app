<template>
  <van-popup v-model="popupVisible" :overlay="false" :class="{'org-mySchedule-ios':isIos,'org-mySchedule-ios12':isIos12}" :style="{ width: '100%',height:'100%' }" position="right" class="menu yh-content has-comment">
    <headerx :cat-title="title" class="common-tree-select" page-type="back" @closeBack="closeBtn">
      <template slot="right">
        <span @click="closeBtn('home')">
          完成
        </span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <div v-if="treeData.length" class="org-chart-container1">
        <div v-for="item in treeData" :key="item.id" :class="{'fd-org-ios12':isIos12, 'fd-org-ios':isIos,'fd-org-android':isAndroid12}" class="org-chart-node-children" @click="toRouter(item)">
          <div class="name">
            <img src="@/assets/images/org.png">{{ item.name }}
          </div>
          <van-icon name="arrow"/>
        </div>
      </div>
      <div v-if="usersList.length" class="org-chart-container1 users-list">
        <div v-for="(item,index) in usersList" :key="item.id" :class="{'fd-org-child-ios12':isIos12, 'fd-org-child-ios':isIos,'fd-org-child-android':isAndroid12}" class="org-chart-node-children" @click="selectHandle(item,index)">
          <div class="org-chart-node-name">
            <img :src="item.facePath"> {{ item.userName }}
          </div>
          <div class="org-chart-node-checkBox">
            <img v-if="item.check" src="@/assets/images/check.png">
            <span v-else/>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      title: '',
      treeData: [],
      usersList: [],
      treeHome: '',
      popupVisible: false,
      uid: '',
      selectArrId: [],
      sureListArray: []
    }
  },
  watch: {
    popupVisible(val) {
      this.uid = this.id
      this.selectArrId.length === 0 ? this.selectArrId.push(this.id) : this.selectArrId = []
      this.init()
    }
  },
  created() {},
  methods: {
    showPopup() { // 打开弹出层
      this.popupVisible = true
    },
    closePopup(val) { // 关闭弹出层
      this.popupVisible = false
      this.$emit('select-change-org')
    },
    init() {
      const id = this.uid
      const treeData = JSON.parse(localStorage.getItem('tree-data'))
      this.treeHome = localStorage.getItem('tree-home')
      this.getObjData(treeData, id)
    },
    toRouter(item) {
      this.uid = item.id
      const id = item.id
      this.selectArrId.push(id)
      this.init()
    },
    toNode(item) {
      const sureList = JSON.parse(localStorage.getItem('sure-list'))
      const userLists = JSON.parse(localStorage.getItem('users-list'))
      const id = item.userId + ''
      const obj = {
        label: item.userName,
        src: item.facePath,
        value: id
      }
      const arrFilter = sureList.filter(item => item.value === id)
      if (arrFilter.length === 0) {
        sureList.push(obj)
      }
      userLists.forEach((item, index) => {
        if (item.value === id) {
          this.$set(userLists[index], 'check', true)
        }
      })
      const arr = JSON.parse(JSON.stringify(sureList))
      const arr1 = JSON.parse(JSON.stringify(userLists))
      this.storage.set('users-list', arr1)
      this.storage.set('sure-list', arr)
      this.closePopup()
    },
    sureData() {
      const sureList = JSON.parse(localStorage.getItem('sure-list'))
      const userLists = JSON.parse(localStorage.getItem('users-list'))

      if (sureList.length) {
        sureList.forEach((a, i) => {
          userLists.forEach((b, j) => {
            if (a.value === b.value) {
              this.$set(userLists[j], 'check', true)
            }
          })
        })

        const arr = JSON.parse(JSON.stringify(sureList))
        const arr1 = JSON.parse(JSON.stringify(userLists))
        this.storage.set('sure-list', arr)
        this.storage.set('users-list', arr1)
      }

      // const newSelectList = []
      // this.usersList.filter(item => {
      //   if (item.check) {
      //     const obj = {
      //       label: item.userName,
      //       src: item.facePath,
      //       value: item.userId + '',
      //       check: item.check
      //     }
      //     newSelectList.push(obj)
      //   }
      // })

      // if (newSelectList.length) {
      //   if (sureList.length === 0) sureList = newSelectList
      //   newSelectList.forEach((a, i) => {
      //     let flag = true
      //     userLists.forEach((b, j) => {
      //       if (a.value === b.value) {
      //         this.$set(userLists[j], 'check', true)
      //       }
      //     })

      //     sureList.forEach((c, k) => {
      //       if (a.value === c.value) {
      //         flag = false
      //       }
      //     })
      //     if (flag) {
      //       sureList.push(a)
      //     }
      //   })
      // }
      // const arr = JSON.parse(JSON.stringify(sureList))
      // const arr1 = JSON.parse(JSON.stringify(userLists))
      // this.storage.set('users-list', arr1)
      // this.storage.set('sure-list', arr)
    },
    closeBtn(value) {
      // selectArrId
      // 判断默认selectArrId数组几就是跳转了几层数据
      const len = this.selectArrId.length
      if (value) {
        this.sureData()
        this.closePopup()
        return
      }
      if (len > 1) {
        this.uid = this.selectArrId[len - 2]
        this.selectArrId.splice(len - 1, 1)
        this.init()
        return
      }
      this.closePopup()
    },
    getObjData(data, id) {
      for (const i in data) {
        if (data[i].id === id) {
          const obj = data[i]
          this.treeData = obj.childTreeDto
          const userListArr = obj.userList
          if (userListArr.length) {
            const sureList = JSON.parse(localStorage.getItem('sure-list'))
            sureList.forEach((item, index) => {
              userListArr.map((sitem, i) => {
                if (item.value === String(sitem.userId)) {
                  this.$set(userListArr[i], 'check', true)
                }
              })
            })
          }
          this.usersList = obj.userList
          this.title = obj.name
          break
        } else {
          this.getObjData(data[i].childTreeDto, id)
        }
      }
    },
    selectHandle(item, index) {
      const check = !item.check
      this.$set(this.usersList[index], 'check', check)

      const obj = {
        label: item.userName,
        src: item.facePath,
        value: item.userId + '',
        check: check
      }
      // 默认选中数据
      const sureList = JSON.parse(localStorage.getItem('sure-list'))
      const userLists = JSON.parse(localStorage.getItem('users-list'))

      userLists.forEach((b, j) => {
        if (obj.value === b.value) {
          this.$set(userLists[j], 'check', check)
        }
      })

      if (check) {
        sureList.push(obj)
      } else {
        sureList.forEach((a, i) => {
          if (a.value === obj.value) {
            sureList.splice(i, 1)
          }
        })
      }

      // 存数据
      const arr = JSON.parse(JSON.stringify(sureList))
      const arr1 = JSON.parse(JSON.stringify(userLists))
      this.storage.set('sure-list', arr)
      this.storage.set('users-list', arr1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .yh-content{
    padding-top:0;
  }
.common-tree-select{
  position: fixed;
  .close-btn{
    position: absolute;
    top: 10px;
    right:5px;
    font-size: 43px;
  }
}
.users-list{
  .org-chart-node-children{
    display: flex;
    justify-content: space-between;
  }
  .org-chart-node-name{
    display: flex;
    align-items: center;
    img{
      width: 65px !important;
      height:65px !important;
      border-radius: 50%;
      margin-right: 14px;
    }
  }
  .org-chart-node-checkBox{
    width:36px;
    height:36px;
    display: flex;
    align-items: center;
    span{
      display: inline-block;
      width:36px;
      height:36px;
      border:2px solid rgba(188,195,210,1);
      box-sizing: border-box;
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.org-chart-container1{
  padding-left: 40px;
  background-color: #fff;
  .org-chart-node-children{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    height: 99px;
    padding-right: 40px;
    .name{
      display: flex;
      align-items: center;
      img{
        width: 45px;
        height:50px;
        padding-right: 10px;
      }
    }
    &+.org-chart-node-children{
      border-top: 2px solid #F0F0F0;
    }
  }
}
</style>
