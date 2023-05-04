<template>
  <div class="components-image-cropper-upload">
    <el-upload
      class="avatar-uploader"
      action=""
      :disabled="disabled"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="chooseImage">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <div v-else>
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <!-- <a-icon :type="imgLoading ? 'loading' : 'plus'" /> -->
        <div>{{ uploadText }}</div>
      </div>
    </el-upload>
    <el-dialog :visible.sync="isCropperDialogShow" title="裁剪图片" append-to-body>
      <div class="cropper-container" style="width: 100%; height: 450px">
        <vue-cropper
          ref="cropper"
          auto-crop
          :img="cropperImg"
          center-box
          :fixed="fixed"
          :can-move="false"
          :fixed-number="cutFixed" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isCropperDialogShow = false">取消</el-button>
        <el-button type="primary" @click="cutImg">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { upload } from '@/api/common'
export default {
  components: {
    VueCropper,
  },
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 上传文字
    uploadText: {
      type: String,
      default: '上传图片',
    },
    // 上传请求
    uploadRequest: {
      type: Function,
      default: upload,
    },
    // 默认图片url
    defaultImageUrl: {
      type: String,
      default: '',
    },
    // 是否固定尺寸
    fixed: {
      type: Boolean,
      default: true,
    },
    // 固定尺寸大小
    cutFixed: {
      type: Array,
      default: () => {
        return [1, 1]
      },
    },
  },
  data() {
    return {
      imgName: '',
      imgLoading: false,
      cropperImg: '',
      isCropperDialogShow: false,
      imageUrl: this.defaultImageUrl,
    }
  },
  watch: {
    defaultImageUrl(newVal) {
      this.imageUrl = newVal
    },
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 获取图片base64
    getBase64(img, callback) {
      this.imgName = img.name
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    // 上传图片校验规则
    uploadImgRules(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('请上传图片类型的文件')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('请上传2MB大小以内的图片')
      }
      return isJpgOrPng && isLt2M
    },
    // 选择裁剪的图片
    chooseImage(obj) {
      this.isCropperDialogShow = true
      this.getBase64(obj.file, (imageUrl) => {
        this.cropperImg = imageUrl
      })
    },
    // 裁剪并上传
    cutImg() {
      this.$refs.cropper.getCropData((data) => {
        const imgBlob = this.convertBase64UrlToBlob(data)
        const submitData = new FormData()
        submitData.append('file', imgBlob, this.imgName)
        this.uploadRequest(submitData).then((res) => {
          this.imageUrl = res.data[0].imgUrl
          this.$emit('uploadSuccess', res)
          this.isCropperDialogShow = false
        })
      })
    },
    // base64转blob
    convertBase64UrlToBlob(urlData) {
      var split = urlData.split(',')
      var bytes = window.atob(split[1])
      var ab = new ArrayBuffer(bytes.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: split[0] })
    },
  },
}
</script>

<style lang="scss" scoped>
.components-image-cropper-upload {
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
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  ::v-deep .cropper-container {
    width: 100px;
    height: 450px;
  }
}
</style>
