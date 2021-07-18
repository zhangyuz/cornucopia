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
import Tabulator from 'tabulator-tables'

/**
 * TODO: tabulator rows 是空的
 */

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
      stockOptions: stockOptions,
      theScoreTabulator:null,
      theScoreTabulatorData:[],
    }
  },
  methods: {
    receiveMmtRanks(data) {
      this.stockOptions.series = dataAdapter.mmtRanks2Series(data.data._items)
      this.$refs.theRanks.chart.hideLoading();
    },
    receiveMmtScores(data) {
      // TODO data to tabulator datas
      this.theScoreTabulatorData=data
    }
  },
  mounted() {
    // 显示载入中状态
    this.$refs.theRanks.chart.showLoading();
    // 载入行业评分数据
    repo.rank(this.receiveMmtRanks)
    // 初始化行业股票分数数据表
    this.theScoreTabulator = new Tabulator(this.$refs.theScores,
      {reactiveData:true, autoColumns:true, data:this.theScoreTabulatorData,
      layout:'fitColumns', columns:[{title:'行业', field:'index_name', sorter:'string'},
      {title:'C20', field:'pct_change_20', sorter:'number'},
      {title:'股票', field:'name', sorter:'string'}]})
    repo.latestScore(this.receiveMmtScores)
  },
  watch: {
    theScoreTabulatorData(newData) {
      // oldData = oldData
      console.log('Score table data changed')
      console.log(newData)
      this.theScoreTabulator.replaceData(newData)
      console.log(this.theScoreTabulator)
    },
  }
}
</script>

<style scoped>

@import '~tabulator-tables/dist/css/tabulator_midnight.min.css';

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
