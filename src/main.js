import { createApp } from 'vue'
import App from './App.vue'

import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import DarkUnica from 'highcharts/themes/dark-unica'

stockInit(Highcharts)
DarkUnica(Highcharts)

const app = createApp(App)
app.use(HighchartsVue)
app.mount('#app')
