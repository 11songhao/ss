<template>
  <div class="department-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <el-button type="primary" @click="addPerssion(1, '0')">
              添加权限
            </el-button>
          </el-row>
        </div>
        <!-- card body -->
        <el-table :data="list" border default-expand-all row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                v-if="row.type === 1"
                type="text"
                @click="addPerssion(2, row.id)"
              >
                添加
              </el-button>
              <el-button type="text" @click="editPermission(row.id)">
                编辑
              </el-button>
              <el-button type="text" @click="delPermission(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 权限点编辑 -->
    <el-dialog
      :visible.sync="showDialog"
      :title="formData.id ? '编辑权限' : '新增权限'"
      @close="resetForm"
    >
      <!-- 表单内容 -->
      <el-form ref="fm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用" prop="enVisible">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="禁用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="clickSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Permission',
  data () {
    return {
      list: [],
      showDialog: false,
      formData: {
        enVisible: '1', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      rules: {
        name: [{ required: true, message: '权限点名称不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.hGetPermissionList()
  },
  methods: {
    // 获取所有权限点
    async hGetPermissionList () {
      const data = await getPermissionList()
      console.log('权限点：')
      console.table(data)
      this.list = tranListToTreeData(data)
    },
    // 打开权限点弹出
    /**
     * type 权限点类型 1 页面 2 功能
     * id 父节点ID '0' 页面权限   'id' 功能权限点的页面权限点ID
     */
    addPerssion (type, id) {
      this.showDialog = true
      // 记录当前添加的关键信息
      this.formData.type = type
      this.formData.pid = id
    },
    // 点击确认添加权限点
    async clickSubmit () {
      // await addPermission(this.formData)
      // this.$message.success('操作成功')
      // this.hGetPermissionList()
      // this.showDialog = false
      if (this.formData.id) {
        // 编辑操作
        await updatePermission(this.formData)
      } else {
        // 添加操作
        await addPermission(this.formData)
      }
      this.hGetPermissionList()
      this.showDialog = false
      this.$message.success('操作成功')
    },
    // 删除权限
    delPermission (row) {
      this.$confirm('确定删除吗？', '提示').then(async () => {
        // 校验 =》 不能直接删除父节点
        if (row.children && row.children.length) {
          // 提示不能删
          return this.$message.error('不能直接删除权限点的父节点！')
        }
        // 没有子可以直接删除
        // 确定进到这里
        await delPermission(row.id)
        this.$message.success('删除成功')
        this.hGetPermissionList()
      }).catch(console.log)
    },
    // 编辑
    async editPermission (id) {
      const data = await getPermissionDetail(id)
      this.formData = data
      this.showDialog = true
    },
    // 关闭重置表单
    resetForm () {
      this.formData = {
        enVisible: '1', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
      this.$refs.fm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
