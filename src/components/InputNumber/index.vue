<template>
  <el-input v-model="inputValue" @input="onInput" />
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      inputValue: null,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.inputValue = this.value
      },
    },
  },
  methods: {
    onInput() {
      this.inputValue = this.inputValue.replace(/[^0-9.]/g, '')
      this.$emit('update:value', this.inputValue)
    },
  },
}
</script>

<style lang="scss" scoped></style>
