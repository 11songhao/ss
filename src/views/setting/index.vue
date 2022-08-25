<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="padding: 10px 0">
              <el-button
                v-if="checkPoints('p-ro-add')"
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roleList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >
                    分配权限
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">传智播客</el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增弹框 -->
    <el-dialog
      :title="roleForm.id ? '编辑角色' : '新增角色'"
      :visible="showDialog"
      @close="close"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 给角色分配权限点 -->
    <AssignPerm
      ref="aperm"
      :show-assign-dialog.sync="showAssignDialog"
      :current-role-id="currentRoleId"
    />
  </div>
</template>

<script>
import { getRoleList, deleteRole, addRole, getRoleDetail, updateRole } from '@/api/setting'
// import { getPermissionList } from '@/api/permission'
// import { tranListToTreeData } from '@/utils'
import AssignPerm from './components/assign-perm'
export default {
  components: {
    AssignPerm
  },
  data () {
    return {
      showAssignDialog: false, // 控制弹层的显示隐藏
      // permissionData: [], // 存储权限数据
      roleList: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      // 控制新增弹出
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      currentRoleId: ''
    }
  },
  created () {
    this.getRoleList() // 获取角色列表
    // this.hGetPermissionList()
  },
  methods: {
    // 给角色分配权限点
    assignPerm (id) {
      this.currentRoleId = id
      this.showAssignDialog = true
      // 存储点击的角色ID
      // this.$refs.aperm.roleId = id
      // 获取之前上次选中权限点回显
      this.$refs.aperm.showAssign(id)
    },
    // 获取角色列表
    async getRoleList () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.roleList = rows
    },
    async changePage (page) {
      this.page.page = page
      this.getRoleList()
    },
    // 编辑角色
    async editRole (id) {
      const res = await getRoleDetail(id)
      console.log(res)
      this.roleForm = res
      this.showDialog = true
    },
    // 删除角色
    delRole (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示').then(() => {
        // 调用删除接口
        deleteRole(id).then(res => {
          // 解决删除最后一页数据页码正确，数据显示错误问题
          const newTotal = Math.ceil((this.page.total - 1) / this.page.pagesize) // 总页数
          // 排至只剩一页数据为0情况（没有数据默认页数是1）
          if (newTotal > 0) {
            this.page.page = this.page.page > newTotal ? newTotal : this.page.page
          }
          this.getRoleList()
          this.$message.success('删除角色成功')
        })
        // 提示用户删除成功
      }).catch(console.log)
    },
    // 新增
    btnOK () {
      this.$refs.roleForm.validate(validate => {
        if (validate) {
          // 编辑
          if (this.roleForm.id) {
            updateRole(this.roleForm).then(res => {
              // 重新拉取数据
              this.getRoleList()
              this.$message.success('更新角色成功')
              this.showDialog = false
            })
          } else {
            // 新增
            addRole(this.roleForm).then(res => {
              // 重新拉取数据
              this.getRoleList()
              this.$message.success('新增角色成功')
              this.showDialog = false
            })
          }
        }
      })
    },
    close () {
      console.log('close')
      this.showDialog = false
      // 清空表单数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
