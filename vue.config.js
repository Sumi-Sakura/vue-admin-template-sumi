'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 页面标题
const name = defaultSettings.title

// 如果你的端口设置为 80，使用管理员权限执行命令行，例如，Mac：sudo npm run
// 您可以通过以下方法更改端口：port = 8888 npm run dev 或 npm run dev --port = 8888
const port = process.env.port || process.env.npm_config_port || 8888

// 所有的配置项都可以在https://cli.vuejs.org/config/中找到
module.exports = {
  /**
   * 如果您计划将站点部署在子路径下，则需要设置 publicPath，例如 GitHub 页面
   * 如果您打算将站点部署到 https://foo.github.io/bar/，那么 publicPath 应该设置为“/bar/”。
   * 在大多数情况下请使用 '/' !!!
   * 详情：https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量scss文件
        // sass-loader将文件引用写入每个组件，适合全局引入变量，但不适合在单页面应用中添加样式，如果是全局样式（非变量），建议在main.js里引入
        // v10以下老版本 用的是prependData，不是additionalData
        prependData: '@import "@/styles/variables.scss";',
      },
    },
  },
  configureWebpack: {
    // 在 webpack 的名称字段中提供应用程序的标题，以便它可以在 index.html 中注入正确的标题
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  },
  chainWebpack(config) {
    // 可以提高首屏加载速度，建议开启 preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // 忽略 runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial',
      },
    ])

    // 当页面较多时，会造成过多无意义的请求
    config.plugins.delete('prefetch')

    // 设置 svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    // 设置 preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // runtime 必须与 runtimeChunk 名称相同。默认为 runtime
            inline: /runtime\..*\.js$/,
          },
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            // 只打包最初依赖的第三方
            chunks: 'initial',
          },
          elementUI: {
            // 将 elementUI 单独拆分为一个包
            name: 'chunk-elementUI',
            // 权重需要大于 libs 和 app，否则会被打包进 libs 或 app
            priority: 20,
            // 适配 cnpm
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          commons: {
            name: 'chunk-commons',
            // 将公共组件单独打包
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  },
}
