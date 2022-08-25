<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    @close="closeDialog"
  >
    <!-- 这里准备复选框 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="role in list" :key="role.id" :label="role.id">{{
        role.name
      }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="clickSubmit">
        确定
      </el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 角色列表
      list: [],
      // 选择的角色ids
      roleIds: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    closeDialog () {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    },
    // 获取角色列表
    async getRoleList () {
      const { rows } = await getRoleList({ page: 1, pagesize: 100 })
      console.log('角色列表：', rows)
      console.table(rows)
      this.list = rows
    },
    // 获取某个用户已授权角色列表=》回显
    async hGetUserDetailById (id) {
      const res = await getUserDetailById(id)
      // 存储当前点击的用户ID
      this.userId = id
      this.roleIds = res.roleIds
    },
    // 给用户分配角色
    async clickSubmit () {
      await assignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      this.$message.success('分配角色成功')
      // 关闭弹框
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.assign-role {
  ::v-deep {
    .el-checkbox {
      margin-bottom: 20px;
    }
  }
}
</style>
