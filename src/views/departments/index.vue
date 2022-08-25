<template>
  <!-- <div class="department-container"> -->
  <div class="app-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <!-- card title -->
      <div slot="header">
        <!-- 用一个行列布局 -->
        <el-row>
          <el-col :span="20">
            <span>{{ company.name }}</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>{{ company.manager || '负责人' }}</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span> 操作<i class="el-icon-arrow-down" /> </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addDept()">
                      添加子部门
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- card body -->
      <!-- 组织架构 -->
      <div>
        <el-tree
          icon-class="el-icon-s-tools"
          :data="treeData"
          :props="defaultProps"
          default-expand-all
        >
          <template #default="{ data }">
            <el-row style="width: 100%">
              <el-col :span="20">
                <i v-if="!data.children" class="el-icon-user"></i>
                {{ data.name }}
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <el-col>{{ data.manager }}</el-col>
                  <el-col>
                    <el-dropdown>
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addDept(data, 1)">
                          添加子部门
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addDept(data, 2)">
                          编辑部门
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="delPart(data)">
                          删除部门
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </div>
    </el-card>
    <!-- 新增|编辑 -->
    <add-dept
      ref="addDepart"
      :show-dialog.sync="showDialog"
      :cur-node="curNode"
      :tree-data="allData"
      @update-dept="hGetDepartments"
    />
  </div>

  <!-- </div> -->
</template>

<script>
import { getDepartments, delDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept'
export default {
  components: {
    AddDept
  },
  data () {
    return {
      showDialog: false,
      // 原始数据
      allData: [],
      // tree结构数据
      treeData: [],
      // 公司信息
      company: { name: '', manager: '' },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      curNode: null
    }
  },
  created () {
    this.hGetDepartments()
  },
  methods: {
    // 新增 | 编辑子部门
    addDept (node, type) {
      this.showDialog = true
      this.curNode = node
      if (type === 2) {
        // 编辑
        this.$refs.addDepart.hGetDepartDetail(node.id)
      }
      // console.log(node)
    },
    // 关闭新增弹出
    closeDialog (val) {
      this.showDialog = val
    },
    // 获取组织架构数据
    async hGetDepartments () {
      const { depts } = await getDepartments()
      this.company = depts[0]
      console.table(depts)
      this.allData = depts
      this.treeData = tranListToTreeData(depts)
    },
    // 删除部门
    delPart (data) {
      // console.log(id)
      this.$confirm('你确认要进行删除么?', '温馨提示').then(async () => {
        if (data.children && data.children.length) {
          return this.$message.error('不能删除父节点！')
        }
        // 删除操作成功
        await delDepartments(data.id)
        // 添加提示
        this.$message.success('删除操作成功')
        // 更新数据
        this.hGetDepartments()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  margin: 3px 0;
  font-size: 14px;
}
::v-deep .el-tree-node__expand-icon {
  font-size: 14px;
}
</style>
