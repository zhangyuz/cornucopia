<template>
  <div class="horizontal-container">
    <div class="stock">
      <highcharts class="mmt-rank-jf-chart" :constructor-type="'stockChart'" :options="stockOptions" ref="theChart"></highcharts>
    </div>
    <div class="cur-ranks">
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
  title: {
    text: 'Quantz Momentum'
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
      this.$refs.theChart.chart.hideLoading();
    }
  },
  mounted() {
    this.$refs.theChart.chart.showLoading();
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

.stock {
  display: inline-block;
  width: 62%;
  height: 100%;
}
.mmt-rank-jf-chart {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cur-ranks {
  display: inline-block;
  width: 38%;
  height: 100%;
}
</style>
