<template>
  <el-row v-show="isShowTree" class="treeBox">
    <!-- 关闭 -->
    <i
      class="el-icon-circle-close"
      @click="$emit('update:isShowTree', false)"
    />
    <!-- 部门选择 -->
    <el-tree
      :data="treeData"
      default-expand-all
      :props="{ label: 'name' }"
      @node-click="selectDepts"
    ></el-tree>
  </el-row>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  // 部门选择全局公共组件
  name: 'ElDepSelect',
  props: {
    isShowTree: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      treeData: []
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    // 获取供表单选择的部门数据
    async getTreeData () {
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts)
    },
    // 选择部门
    selectDepts (node) {
      // console.log(node)
      // 1. 显示选择的部门名字到输入框
      // this.formData.departmentName = node.name
      this.$emit('current-selected', node)
      // 2. 隐藏部门树
      // this.isShowTree = false
      this.$emit('update:isShowTree', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.treeBox {
  width: 280px;
  border: 1px solid #eee;
  position: relative;
  .el-icon-circle-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
    cursor: pointer;
    font-size: 18px;
    color: blue;
  }
}
</style>
