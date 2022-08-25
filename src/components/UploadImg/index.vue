<template>
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="upload"
  >
    <img
      v-if="staffPhoto"
      v-imgerror="require('@/assets/common/bigUserHeader.png')"
      :src="staffPhoto"
      class="avatar"
    />
    <i v-else class="el-icon-plus avatar-uploader-icon" />
    <!-- 进度条 -->
    <el-progress
      v-if="isShowPc"
      type="line"
      :percentage="percentage"
      status="success"
      :stroke-width="6"
    ></el-progress>
  </el-upload>
</template>

<script>
// 导入cos的SDK调用
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDNHyR3QTP7mJhUoJERRGvPh0BB2WP9g6M', // 身份识别ID
  SecretKey: 'HD0znQcaKn5zeplWliS3ZM2RCjAg2BUa' // 身份秘钥
})
export default {
  props: {
    // 上传组件默认显示的头像
    staffPhoto: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imageUrl: '',
      isShowPc: false,
      percentage: 0
    }
  },
  methods: {
    upload ({ file }) {
      // console.log(params)
      this.isShowPc = true
      // 腾讯云SDK上传
      cos.putObject({
        Bucket: 'hrsass-1255477649', /* 必须 */
        Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
        Key: file.name, /* 必须 */
        StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onProgress: (progressData) => {
          console.log(JSON.stringify(progressData), progressData.percent * 100)
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        // 上传成功之后
        if (data.statusCode === 200) {
          setTimeout(() => {
            this.isShowPc = false
            this.percentage = 0
            // this.imageUrl = `https://${data.Location}`
            this.$emit('update:staffPhoto', `https://${data.Location}`)
          }, 800)
        }
      })
    },
    // handleAvatarSuccess (res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

