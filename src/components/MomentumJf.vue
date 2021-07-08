<template>
  <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
</template>

<script>

import repo from '../js/repo'
import dataAdapter from '../js/data'

const stockOptions = {
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
    padding:0
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
    }
  },
  mounted() {
    repo.rank(this.receive)
  }
}
</script>

<style scoped>
.stock {
  position:absolute;
  width: 98%;
  height: 100%;
  margin: 0 auto
}
</style>
