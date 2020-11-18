<template>
  <div class="org-chart-container">
    <div class="org-chart-node-children">
      <OrgChartNode
        v-for="(node,index) in treeData"
        :key="index"
        :node="node"
        @goUpClick="goUpClick"
        @goDeleteClick="goDeleteClick"
        @goUpDrop="goUpDrop"
      />
    </div>
  </div>
</template>

<script>
import OrgChartNode from './OrgChartNode'
export default {
  name: 'OrgChart',
  components: {
    OrgChartNode
  },
  props: {
    dataObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      treeData: [this.dataObj]
    }
  },
  watch: {
    dataObj: {
      handler(newName, oldName) {
        this.$nextTick(() => {
          this.$set(this.treeData, 0, newName)
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    goUpClick: function(event) {
      this.$emit('onClick', event)
    },
    goDeleteClick(event) {
      this.$emit('deleteClick', event)
    },
    goUpDrop: function(event) {
      this.$emit('onDrop', event)
    },
    getChildren: function(nodes, parentId) {
      let result = []
      for (const i in nodes) {
        const node = nodes[i]
        result.push({
          id: node.id,
          parentId: parentId,
          label: node.label
        })
        result = result.concat(this.getChildren(node.children, node.id))
      }
      return result
    }
  }
}

</script>
<style lang="scss">
  .org-chart-container {
    text-align: center;
    display: flex;
    width: auto;
    margin: 40px 0;
    /* padding-top: 10px; */
    padding-left: 0;
    padding-left: 0;
    .org-chart-node-children{
      padding-right: 0;
    }
  }

  .org-chart-node-children .org-chart-node-children::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    border-left: 1px solid #ccc;
    width: 0;
    height: 20px;
  }
</style>
