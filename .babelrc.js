module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset',
  ],
  env: {
    development: {
      // babel-plugin-dynamic-import-node 只做一件事就是将所有的import()替换为require()
      // 当你有大量页面时，该插件可以显著提高热更新速度
      plugins: ['dynamic-import-node'],
    },
  },
}
