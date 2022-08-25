<template>
  <div>
    <el-switch
      v-model="cg"
      active-text="开启数据切换"
      inactive-text="关闭数据切换"
      :active-value="true"
      :inactive-value="false"
      @change="loop"
    >
    </el-switch>

    <div ref="myDiv" class="radar-echart" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      cg: false,
      opt: {
        // title: {
        //   text: '基础雷达图'
        // },
        tooltip: {},
        // legend: {
        //   data: ['张三', '李四']
        // },
        radar: {
          // shape: 'circle',
          axisName: {
            // textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
            // }
          },
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [
          {
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [

            ]
          }
        ]
      }
    }
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = this.echarts.init(this.$refs.myDiv)
    // 绘制图表
    this.opt.series[0].data = [
      {
        value: [10, 20, 100, 30, 100, 0],
        name: '张三'
      },
      {
        value: [50, 50, 50, 50, 50, 10],
        name: '李四'
      }
    ]

    this.myChart.setOption(this.opt)
    // 默认开启loop
    // this.cg = true
    // this.loop()
  },
  beforeDestroy () {
    clearInterval(this.st)
  },
  methods: {
    // 切换
    loop (f) {
      console.log(f)
      if (this.st) {
        clearInterval(this.st)
        this.st = null
        return
      }
      this.st = setInterval(this.change, 1000)
    },
    change () {
      const data = []
      for (let index = 0; index < 3; index++) {
        const per = { value: [], name: `李${index}` }
        for (let j = 0; j < 6; j++) {
          per.value.push(Math.floor(Math.random() * 100 + 1))
        }
        data.push(per)
      }
      // 绘制图表
      this.opt.series[0].data = data

      this.myChart.setOption(this.opt)
    }
  }
}
</script>

<style lang="scss" scoped>
.radar-echart {
  width: 100%;
  height: 400px;
}
</style>
