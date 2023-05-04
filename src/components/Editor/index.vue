<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :default-config="toolbarConfig"
      :mode="mode" />
    <Editor
      v-model="html"
      style="overflow-y: hidden"
      :style="{ height }"
      :default-config="editorConfig"
      :mode="mode"
      @onChange="onChange"
      @onCreated="onCreated" />
  </div>
</template>

<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { message } from 'element-ui'
import commonApi from '@/api/common'

export default Vue.extend({
  components: { Editor, Toolbar },
  props: {
    editorHtml: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '300px',
    },
  },
  data() {
    return {
      editor: null,
      html: '',
      toolbarConfig: {
        excludeKeys: ['emotion', 'todo', 'fullScreen', 'codeBlock', 'group-video'],
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            server: `${process.env.VUE_APP_BASE_URL}/api${commonApi.upload}`,
            fieldName: 'file',
            // headers: {
            //   token: getToken(),
            // },
            async customInsert(res, insertFn) {
              if (res.code === 0) {
                insertFn(res.data)
              } else {
                message.error(res.message)
              }
            },
          },
        },
      },
      mode: 'default',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.html = this.editorHtml
    })
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onChange() {
      this.$emit('update:editorHtml', this.html)
    },
  },
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
