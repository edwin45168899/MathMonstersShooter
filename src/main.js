import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n'

// 啟動 Vue 應用程式，並註冊 i18n 多國語言支援
createApp(App).use(i18n).mount('#app')

