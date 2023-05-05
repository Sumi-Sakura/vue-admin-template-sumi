<template>
  <div
    ref="scrollbarWrap"
    class="component-scrollbar"
    :class="{ 'scroll-y': scrollX > 0 && scrollX < maxScrollX }"
    data-simplebar>
    <simplebar ref="scrollbar" @scroll="scroll">
      <slot></slot>
    </simplebar>
  </div>
</template>

<script>
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
export default {
  components: {
    simplebar,
  },
  data() {
    return {
      // X轴滚动距离
      scrollX: 0,
      // Y轴滚动距离
      scrollY: 0,
      // X轴最大滚动距离
      maxScrollX: 0,
      // Y轴最大滚动距离
      maxScrollY: 0,
    }
  },
  methods: {
    // 监听滚动
    scroll(e) {
      window.requestAnimationFrame(() => {
        this.maxScrollX = e.target.scrollWidth - this.$refs.scrollbarWrap.scrollWidth
        this.maxScrollY = e.target.scrollHeight - this.$refs.scrollbarWrap.scrollHeight
        this.scrollX = e.target.scrollLeft
        this.scrollY = e.target.scrollTop
        // console.log('滚动')
      })
    },
    // 滚动条滚动到最左
    scrollLeft() {
      this.$refs.scrollbar.SimpleBar.getScrollElement().scrollLeft = 0
    },
  },
}
</script>
