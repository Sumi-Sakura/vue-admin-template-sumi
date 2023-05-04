import Vue from 'vue'
// svg 组件
import SvgIcon from '@/components/SvgIcon'

// 全局注册 SvgIcon 组件
Vue.component('SvgIcon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)
