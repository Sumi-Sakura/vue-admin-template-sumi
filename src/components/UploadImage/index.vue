<template>
  <div class="components-upload-image">
    <el-upload
      class="image-uploader"
      :action="uploadApi"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :before-upload="validateUpload">
      <img v-if="imageUrl" :src="imageUrl" class="image" />
      <div v-else>
        <i class="el-icon-plus image-uploader-icon"></i>
      </div>
    </el-upload>
    <div v-if="proportion.length > 0">
      请上传比例为{{ proportion[0] }}:{{ proportion[1] }}的图片
    </div>
  </div>
</template>

<script>
import commonApi from '@/api/common'

export default {
  props: {
    // 上传api
    uploadApi: {
      type: String,
      default: `/api${commonApi.upload}`,
    },
    // 默认图片url
    defaultImageUrl: {
      type: String,
      default: '',
    },
    // 图片固定比例
    proportion: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      imageUrl: this.defaultImageUrl,
    }
  },
  watch: {
    defaultImageUrl(newImageUrl) {
      this.imageUrl = newImageUrl
    },
  },
  methods: {
    uploadSuccess(res, file) {
      const { data } = res
      this.imageUrl = data
      this.$emit('uploadSuccess', data)
    },
    validateUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        return false
      }

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }

      if (this.proportion.length > 0) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const image = new Image()
            image.src = reader.result
            image.onload = () => {
              if (
                image.naturalWidth / image.naturalHeight !==
                this.proportion[0] / this.proportion[1]
              ) {
                this.$message.error('请上传正确比例的图片')
                return reject(false)
              } else {
                return resolve(true)
              }
            }
          }
        })
      }

      return true
    },
  },
}
</script>

<style lang="scss" scoped>
.components-upload-image {
  .image-uploader {
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }
    }
    .image-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .image {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>
