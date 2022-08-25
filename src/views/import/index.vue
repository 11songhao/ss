<template>
  <div class="app-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span>批量导入员工</span>
      </div>
      <!-- card body -->
      <UploadExcel :before-upload="beforeUpload" :on-success="onSuccess" />
    </el-card>
  </div>
</template>

<script>
import { importEmployees } from '@/api/employees'
import { formatExcelDate } from '@/utils'
export default {
  methods: {
    beforeUpload (file) {
      console.log('上传之前校验', file)
      // 必须返回true才会继续执行
      return true
    },
    async onSuccess ({ header, results }) {
      console.log(header, results)
      try {
        // this.transformKeys(results)
        // key中文转英文对应关系
        const maps = {
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        await importEmployees(this.transformKeys(results, maps, ['timeOfEntry', 'correctionTime']))
        this.$router.back()
      } catch (error) { console.log(error) }
    },
    // key中文转英文
    transformKeys (results, maps, times = []) {
      const newArr = []
      results.forEach(item => {
        // 替换为key是英文的新对象，添加进数组
        const _item = {}
        for (const key in item) {
          const enKey = maps[key]
          if (times.includes(enKey)) {
            // 格式化excel时间
            _item[enKey] = formatExcelDate(item[key], '-')
          } else {
            _item[enKey] = item[key]
          }
        }
        newArr.push(_item)
      })
      console.log(newArr)
      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
