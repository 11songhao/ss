<template>
  <!-- 分配权限的弹层 -->
  <el-dialog
    title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)"
    :visible="showAssignDialog"
    @close="closeAssignDialog"
  >
    <!-- 权限点数据展示 -->
    <el-tree
      ref="tree"
      :data="permissionData"
      :props="{ label: 'name' }"
      default-expand-all
      show-checkbox
      :check-strictly="true"
      node-key="id"
    />
    <template #footer>
      <el-button @click="closeAssignDialog">取消</el-button>
      <el-button type="primary" @click="clickAssign">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { assignPerm, getRoleDetailById } from '@/api/setting'
export default {
  props: {
    showAssignDialog: {
      type: Boolean,
      default: false
    },
    currentRoleId: {
      type: String,
      default: ''
    }
    // permissionData: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data () {
    return {
      permissionData: [],
      roleId: '' // 记录正在操作的角色id
    }
  },
  created () {
    this.hGetPermissionList()
  },
  methods: {
    closeAssignDialog () {
      this.$emit('update:showAssignDialog', false)
      // 清空选择
      // this.$refs.tree.setCheckedKeys([])
    },
    // 回显之前选中权限
    async showAssign (id) {
      this.$nextTick(() => {
        console.log('tid:', this.currentRoleId)
      })
      // 存储ID
      this.roleId = id
      const roleDetail = await getRoleDetailById(this.roleId)
      this.$refs.tree.setCheckedKeys(roleDetail.permIds)
    },
    // 分配权限
    async clickAssign () {
      await assignPerm({
        id: this.roleId,
        permIds: this.$refs.tree.getCheckedKeys()
      })
      this.$message.success('分配成功')
      this.closeAssignDialog()
    },
    // 获取权限点
    async hGetPermissionList () {
      // 发送请求, 获取权限列表
      const data = await getPermissionList()
      this.permissionData = tranListToTreeData(data)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
