<template>
  <el-dialog :visible="showDialog" title="新增员工" @close="closeDialog">
    <!-- 表单 -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="showTree = true"
        />
        <!-- 选择部门 -->
        <el-dep-select
          :is-show-tree.sync="showTree"
          @current-selected="formData.departmentName = $event.name"
        />
        <!-- <el-row
          v-show="showTree"
          type="flex"
          justify="start"
          style="width: 280px; margin-top: 10px; border: 1px solid #dcdfe6"
        >
          <el-tree
            :data="treeData"
            :props="{ label: 'name' }"
            @node-click="selectNode"
          />
        </el-row> -->
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-button @click="$emit('close-dialog', false)">取消</el-button>
        <el-button type="primary" @click="pub">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import Employees from '@/api/constant/employees'
// 引入api方法
// import { getDepartments } from '@/api/departments'
// 引入树形结构转换方法
import { parseTime } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showTree: false,
      // treeData: [], // 定义数组接收树形数据
      hireType: [...Employees.hireType],
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    // this.hGetDepartments()
  },
  methods: {
    closeDialog () {
      this.$emit('close-dialog', false)
      // 重置校验结果
      this.$refs.addForm.resetFields()
    },
    // 选择部门
    // selectNode (node) {
    //   console.log(node)
    //   this.formData.departmentName = node.name
    //   this.showTree = false
    // },
    // async hGetDepartments () {
    //   const data = await getDepartments()
    //   // depts是数组 但不是树形, 需要转换成属性结构, 才能被 el-tree 展示
    //   this.treeData = tranListToTreeData(data.depts)
    // },
    async pub () {
      try {
        await this.$refs.addForm.validate()
        // 格式化时间格式
        this.formData.correctionTime = parseTime(this.formData.correctionTime, '{y}-{m}-{d}')
        this.formData.timeOfEntry = parseTime(this.formData.timeOfEntry, '{y}-{m}-{d}')

        await addEmployee(this.formData)
        this.$message.success('添加成功')
        this.closeDialog()
        this.$parent.getEmployeeList()
      } catch (error) {
        // console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
