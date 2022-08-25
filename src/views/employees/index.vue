<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <PageTools>
            <!-- 插入到left插槽位置 -->
            <template #left>
              <span>总记录数：{{ total }}条</span>
            </template>
            <!-- 插入到right插槽位置 -->
            <template #right>
              <el-button
                type="warning"
                size="small"
                @click="$router.push('/import')"
              >
                导入excel
              </el-button>
              <el-button type="danger" size="small" @click="exportTd">
                导出excel
              </el-button>
              <el-button
                v-if="checkPoints('p-em-add')"
                type="primary"
                size="small"
                @click="showDialog = true"
              >
                新增员工
              </el-button>
            </template>
          </PageTools>
        </div>
        <div>
          <!-- table列表 -->
          <el-table border :data="list" :default-sort="{ prop: 'workNumber' }">
            <el-table-column type="index" label="序号" />
            <el-table-column prop="username" label="姓名" />
            <el-table-column prop="staffPhoto" label="头像">
              <template #default="{ row }">
                <el-image
                  class="rd"
                  :src="row.staffPhoto"
                  fit="fill"
                  @click="showQr(row.staffPhoto)"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="workNumber" label="工号" />
            <el-table-column prop="formOfEmployment" label="聘用形式">
              <template #default="{ row }">
                {{ formatEntry(row.formOfEmployment) }}
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="部门" />
            <el-table-column sortable prop="timeOfEntry" label="入职时间" />
            <el-table-column label="账户状态">
              <el-switch v-model="qy" />
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <template #default="{ row }">
                <el-button
                  v-if="checkPoints('p-em-look')"
                  type="text"
                  size="small"
                  @click="$router.push(`/employees/detail/${row.id}`)"
                >
                  查看
                </el-button>
                <el-button type="text" size="small" @click="assignRole(row.id)">
                  分配角色
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="delEmployee(row.id)"
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
            <el-pagination
              :total="total"
              :current-page="params.page"
              :page-size="params.size"
              :page-sizes="[2, 5, 10]"
              layout="prev, pager, next, sizes"
              @current-change="changePage"
              @size-change="sizeChange"
            />
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 新增员工 -->
    <AddEmployee :show-dialog="showDialog" @close-dialog="closeDialog" />
    <!-- 分配角色 -->
    <AssignRole ref="arole" :show-role-dialog.sync="showRoleDialog" />
    <!-- 显示二维码 -->
    <!-- <el-dialog title="头像二维码" :visible.sync="showQrcode" width="30%">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog> -->
    <Qrcode :show-qrcode.sync="showQrcode" :data="url" />
  </div>
</template>

<script>
// import PageTools from '@/components/PageTools'
import { getEmployeeList, delEmployee } from '@/api/employees'
import Employees from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'
// import QrCode from 'qrcode'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data () {
    return {
      test: 360,
      url: '',
      showDialog: false,
      showQrcode: false,
      showRoleDialog: false,
      list: [],
      params: {
        page: 1, // 当前页
        size: 10 // 每页条数
      },
      qy: true,
      total: 0 // 总数
    }
  },
  created () {
    console.log('em1')
    this.getEmployeeList()
  },
  methods: {
    // 条数切换
    sizeChange (size) {
      console.log(size)
      this.params.size = size
      this.params.page = 1
      this.getEmployeeList()
    },
    closeDialog (val) {
      this.showDialog = val
    },
    // 分配角色
    assignRole (id) {
      this.showRoleDialog = true
      // 通过ref调用子组件方法获取当前用户已授权角色回显
      this.$refs.arole.hGetUserDetailById(id)
    },
    // 展示用户头像二维码
    async showQr (img) {
      this.url = img
      this.showQrcode = true

      // await this.$nextTick()
      // console.log(this.$refs.myCanvas)
      // QrCode.toCanvas(this.$refs.myCanvas, img)
    },
    // 导出当前页数据
    async exportTd () {
      const excel = await import('@/vendor/Export2Excel')
      // excel表示导入的模块对象
      // console.log(excel)
      // 导出数据key对应关系
      const headerShips = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '工号': 'workNumber',
        '转正日期': 'correctionTime',
        '部门': 'departmentName'
      }
      // 表头
      const header = Object.keys(headerShips)
      const exportHeader = Object.values(headerShips)
      // 表头对应数据（二维数组）
      const data = this.transformTdata(this.list, exportHeader)
      // 导出方法
      excel.export_json_to_excel({
        // 表头 必填
        header,
        data,
        // 表头对应的具体数据 必填
        // data: [
        //   ['刘备', 100],
        //   ['关羽', 500]
        // ],
        filename: 'excel-list', // 导出下载的文件名称
        autoWidth: true, // 导出excel列宽度是否自适应
        bookType: 'xlsx' // 导出生成的文件类型
      })
    },
    // 转换表格数据为二维数组
    transformTdata (list, exportHeader) {
      const secondArray = []
      list.forEach(item => {
        // 当前行item数据存储的数组
        const item_array = []
        // 遍历当前行item数据对象过滤需要导出的key
        for (const enKey in item) {
          // console.log(enKey)
          if (exportHeader.includes(enKey)) {
            // 处理聘用关系=>转换数字
            if (enKey === 'formOfEmployment') {
              item_array.push(this.formatEntry(item[enKey]))
            } else {
              item_array.push(item[enKey])
            }
          }
        }
        // 过滤完加入二维数组存储
        secondArray.push(item_array)
      })
      console.log('导出转换结果：', secondArray)
      return secondArray
    },
    // 获取员工列表
    async getEmployeeList () {
      const data = await getEmployeeList(this.params)
      const { total, rows } = data
      console.log('人员：', rows)
      this.total = total
      this.list = rows
    },
    // 删除员工
    async delEmployee (id) {
      try {
        await this.$confirm('确认删除吗？', '提示')
        await delEmployee(id)
        // // 解决删除最后一页数据页码正确，数据显示错误问题 =》 Math.ceil上舍入 | Math.floor 下舍入
        const newTotal = Math.ceil((this.total - 1) / this.params.size) // 总页数
        // 排除只剩一页情况（页码默认是1）
        console.log('curr:', newTotal, this.params.page)
        if (newTotal > 0) {
          this.params.page = newTotal
        }
        this.$message.success('删除成功！')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    changePage (page) {
      this.params.page = page
      this.getEmployeeList()
    },
    // 格式化聘用形式
    // formatEntry (value) {
    //   const types = Employees.hireType
    //   let type
    //   // forEach循环可以通过throw 错误终止
    //   types.forEach(item => {
    //     if (parseInt(value) === item.id) {
    //       type = item.value
    //     }
    //   })
    //   return type
    // }
    // 格式化聘用形式函数
    formatEntry (type) {
      // 经过对源数据处理之后 返回处理之后的数据
      // 格式化逻辑
      const hireType = Employees.hireType
      // type 1/2
      // {1:'正式', 2:'非正式'}
      // 枚举静态数据 尽量定义成对象  因为对象天生具有一一对应的属性
      const map = {}
      hireType.forEach(item => {
        map[item.id] = item.value
      })
      return map[type]
    }

  }
}
</script>

<style lang="scss" scoped>
.rd {
  width: 80px;
  height: 80px;
  border-radius: 100%;
}
</style>
