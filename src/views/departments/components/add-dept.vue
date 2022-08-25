<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="title" :visible="showDialog" @close="close">
    <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="form.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="form.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="form.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="form.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" size="small" @click="pub">确定</el-button>
      <el-button size="small" @click="$emit('update:showDialog', false)">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    curNode: {
      type: Object,
      default () {
        return {}
      }
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const validateCode = (rule, value, callback) => {
      // 编辑情况下排除自身
      let flag
      if (this.form.id) {
        // 编辑
        flag = this.treeData.some(item => {
          // value !== this.curNode.code 编辑时排除自身
          return item.code === value && value !== this.curNode.code
        })
      } else {
        // 新增
        flag = this.treeData.some(item => {
          // eslint-disable-next-line eqeqeq
          return item.code == value
        })
      }
      // 遍历所有部门数据匹配
      if (flag) {
        callback(new Error('当前code码重复'))
      } else {
        callback()
      }
    }
    return {
      peoples: [],
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validateCode, trigger: ['blur', 'change'] }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    title () {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  created () {
    this.hGetEmployeeSimple()
  },
  methods: {
    // submit
    pub () {
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          // form和传下来的id汇总成一个完整的参数对象
          if (this.form.id) {
            // 调用更新接口
            await updateDepartments(this.form)
          } else {
            // 调用新增接口
            await addDepartments({ ...this.form, pid: this.curNode.id || '' })
          }

          this.close()
          //  更新列表
          this.$emit('update-dept')
        }
      })
    },
    close () {
      this.$emit('update:showDialog', false)
      // 重置
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 清除校验残留
      this.$refs.deptForm.resetFields()
    },
    // 获取编辑节点详情数据
    async hGetDepartDetail (id) {
      const data = await getDepartDetail(id)
      this.form = data
    },
    // 获取员工简单列表数据
    async hGetEmployeeSimple () {
      const data = await getEmployeeSimple()
      this.peoples = data
    }
  }
}
</script>
