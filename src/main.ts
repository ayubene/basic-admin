import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import BasicComponents from 'srit-basic-components'
import App from './App.vue'
import router from './router'
import './styles/index.css'
import './utils/request' // 配置全局请求拦截器（包括 token）
// import './mock' // 使用真实接口时注释掉 mock

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VXETable)
app.use(BasicComponents)

app.mount('#app')
