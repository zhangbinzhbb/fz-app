<template>
  <div class="other-radio">
    <div id="inputContent" class="remind-div">
      <div
        v-for="(option,optIdx) in item.options"
        :key="optIdx"
        class="input-add-item"
        style="padding-left:0"
      >
        <span @click="delInput(index,optIdx)">—</span>
<!--        <input v-model="option" type="text" class="add-name" maxlength="10">-->
      </div>
      <span @click="addInput(index)">+</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">

export default {
  name: 'AddInput',
  data() {
    return {
      options: []
    }
  },
  watch: {
  },
  methods: {
    // 添加标签
    addInput (index) {
      if (this.options.length >= 5) {
        return
      }
      this.options.push({})
    },
    // 删除标签
    delInput (index, optIdx) {
      this.options.splice(optIdx, 1)
    }
  }
}
</script>
