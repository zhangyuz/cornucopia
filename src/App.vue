<template>
  <div id="app">
    <div>
      <momentumJf />
    </div>
    <!--div class="logos">
      <img class="logo-hc" src="./assets/highcharts_logo.png" alt="Highcharts Logo">
      <img class="logo-vue" src="./assets/vue_logo.png" alt="Vue Logo">
    </div>
    <h2>Welcome in Vue 3 Highcharts Wrapper Demo</h2>
    <hr style="width: 200px; margin: 60px auto;">
    <h3>Select chart constructor:</h3>
    <div class="button-grp">
      <button @click="select('chart')" :class="{btnActive: selected === 'chart'}">Chart</button>
      <button @click="select('stockChart')" :class="{btnActive: selected === 'stockChart'}">Stock Chart</button>
      <button @click="select('mapChart')" :class="{btnActive: selected === 'mapChart'}">Map Chart</button>
    </div>
    <keep-alive>
      <component :is="currentView"></component>
    </keep-alive-->
  </div>
</template>

<script>
// import Chart from './components/Chart.vue'
// import StockChart from './components/StockChart'
// import MapChart from './components/MapChart'
import MomentumJf from './components/MomentumJf'


export default {
  name: 'App',
  data () {
    return {
      // selected: 'chart',
      // currentView: 'chart'
    }
  },
  components: {
    /*chart: Chart,
    stockChart: StockChart,
    mapChart: MapChart,*/
    momentumJf: MomentumJf
  },
  methods: {
    activate (elem) {
      this.selected = elem
    },
    handler () {
      var args = arguments
      for (var arg of args) {
        if (arg instanceof Function) {
          arg()
        }
      }
    },
    select (elem) {
      this.currentView = elem
      this.activate(elem)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  width: 100vw;
  height: 100vh;
  position:absolute;
}
</style>
