<template>
  <div>
    <h2>{{ title }}</h2>
    <ul class="content">
      <li v-for="(item,index) in list" :key="index" @click="selectChange(item,index)">
        <div class="v-select-left">
          <div v-if="item.src" class="img">
            <img :src="item.src">
          </div>
          <div v-else class="icon-img">
            {{ item.label | formatName }}
          </div>
        </div>
        <div class="v-select-right">
          <span class="name">{{ item.label }}</span>
          <div class="input-box">
            <img v-if="item.check" src="@/assets/images/check.png">
            <span v-else/>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    },
    title: String
  },
  data() {
    return {}
  },
  methods: {
    selectChange(item, index) {
      this.$emit('select-change', item, index)
    }
  }
}
</script>
