<template>
  <section class="app-main" :class="{ 'is-header-fixed': fixedHeader }">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - #{$menuheight});
  width: 100%;
  position: relative;
  overflow: hidden;
  &.is-header-fixed {
    min-height: 100vh;
  }
}
.fixed-header + .app-main {
  padding-top: #{$menuheight};
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
