<template>
  <div class="mttjf-horizontal-container">
    <div class="stock">
      <highcharts class="mmt-rank-jf-chart" :constructor-type="'stockChart'" :options="stockOptions" ref="theChart"></highcharts>
    </div>
    <div class="cur-scores" ref="theScore">
      Stock Scores Loading......
    </div>
  </div>
</template>

<script>

import repo from '../js/repo'
import dataAdapter from '../js/data'
import WebDataRocks from 'webdatarocks'

function onPointClicked(event) {
  console.log(event.point.series.name)
  console.log(event.point.x)
  console.log(event.point.y)
  console.log(event)
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
      stockOptions: stockOptions,
      curScoresPovitTable:null,
    }
  },
  methods: {
    receiveRanks(data) {
      this.stockOptions.series = dataAdapter.mmtRanks2Series(data.data._items)
      this.$refs.theChart.chart.hideLoading();
    },
    receiveScores(data) {
      // console.log('Scores')
      // console.log(data)
      var report = {
        dataSource:{
          data: data, 
          dataSourceType:'json'
        },
        slice: {
          rows: [{
                  uniqueName: "index_name",
              },
              {
                uniqueName: "name"
              }
          ],
          "columns": [
            {
                "uniqueName": "Measures"
            }
          ],
          "measures": [
            {
                "uniqueName": "pct_change_20",
                "aggregation": "calculated",
                "caption": "20 Up",
                "format": "",
            },
          ],
          "expands": {
            expandAll:false,
          }
        },
        options: {
            grid: {
                type: "compact",
                showHeaders:false,
                showTotals: false,
            }
        },
        formats: [
          {
            "name": "",
            "decimalPlaces": 3,
          }
        ]
      }
      // this.curScoresPovitTable.updateData({data:data, dataSourceType: "json"})
      this.curScoresPovitTable.setReport(report)
    }
  },
  mounted() {
    this.$refs.theChart.chart.showLoading();
    repo.rank(this.receiveRanks)
    this.curScoresPovitTable = new WebDataRocks({
      container: this.$refs.theScore,
      width: 512,
      height: '100%',
      // toolbar:true,
      report: {
        slice: {
          rows: [{
                  uniqueName: "index_name",
              },
              {
                  uniqueName: "ts_code",
              }
          ],
          columns: [
            {uniqueName: "name"},
            {uniqueName: "pct_change_20"}
          ],
          "expands": {
            expandAll:true,
          }
        },
        options: {
            grid: {
                type: "compact",
                showHeaders:false,
                showTotals: false,
            }
        }
      }
    });
    repo.latestScore(this.receiveScores)
  },
  /*
  beforeUpdate() {
    return false;
  }*/
}
</script>

<style scoped>

@import '~webdatarocks/theme/dark/webdatarocks.min.css';


.mttjf-horizontal-container {
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
  width: 68%;
  height: 100%;
}

.cur-scores {
  display: inline-block;
  width: 38%;
  height: 100%;
  padding-left: 48px;
  margin-left: 32px;
}
</style>
