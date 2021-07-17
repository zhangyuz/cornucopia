<template>
  <div class="horizontal-container">
    <div class="stock-rank-chart">
      <highcharts class="mmt-rank-chart" :constructor-type="'stockChart'" :options="stockOptions" ref="theRanks"></highcharts>
    </div>
    <div class="cur-mmt-scores-table" ref="theScores">
      sldjkfaldk
    </div>
  </div>
</template>

<script>

import repo from '../js/repo'
import dataAdapter from '../js/data'

function onPointClicked(event) {
  console.log(event.point.series.name)
  console.log(event.point.x)
  console.log(event.point.y)
}

const stockOptions = {
  plotOptions:{
    series:{
      events:{
        click:onPointClicked,
      }
    }
  },
  rangeSelector: {
    selected: 1,
    floating: true,
    enabled: false
  },
  chart: {
    scrollablePlotArea:true,
    type:'spline',
    spacingTop:0
  },
  tooltip: {
    outside:true,
    split:true,
    padding:0,
    shared:false
  },
  time: {
    timezoneOffset:-480
  },
  navigator:{
    height:20,
    margin:8
  },
  scrollBar: {
    enabled:false
  },
  credits: {
    enabled: false
  }
}

export default {
  data () {
    return {
      stockOptions: stockOptions
    }
  },
  methods: {
    receive(data) {
      this.stockOptions.series = dataAdapter.mmtRanks2Series(data.data._items)
      this.$refs.theRanks.chart.hideLoading();
    }
  },
  mounted() {
    this.$refs.theRanks.chart.showLoading();
    repo.rank(this.receive)
  }
}
</script>

<style scoped>

.horizontal-container {
    display: flex;
    width:100%;
    height: 100vh;
}

.stock-rank-chart {
  display: inline-block;
  width: 62%;
  height: 100%;
}
.mmt-rank-chart {
  position: absolute;
  width: 62%;
  height: 100%;
}

.cur-mmt-scores-table{
  display: inline-block;
  width: 38%;
  height: 100%;
}
</style>
