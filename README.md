# 项目名称

## 启动

```bash
# 克隆项目
git clone 项目地址

# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:8888](http://localhost:8888)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果（浏览器访问 [http://localhost:8887](http://localhost:8887)）
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint --fix
```
