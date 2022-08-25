<template>
  <el-dialog
    title="二维码"
    :visible="showQrcode"
    width="30%"
    @open="draw"
    @close="close"
  >
    <el-row type="flex" justify="center">
      <canvas ref="myCanvas" />
    </el-row>
  </el-dialog>
</template>

<script>
import QrCode from 'qrcode'
export default {
  name: 'Qrcode',
  props: {
    showQrcode: {
      type: Boolean,
      default: false
    },
    data: {
      type: String,
      default: ''
    }
  },
  mounted () {
    console.log('qr')
  },
  methods: {
    draw () {
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, this.data)
      })
    },
    close () {
      this.$emit('update:showQrcode', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
