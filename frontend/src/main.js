import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('应用错误:', err)
  console.error('错误信息:', info)
}

// 注册插件
app.use(router)
app.use(pinia)
app.use(naive)

app.mount('#app') 