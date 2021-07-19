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
      mmtRanks:null,
      theScoreTabulator:null,
      theScoreTabulatorData:[],
    }
  },
  methods: {
    receiveMmtRanks(data) {
      this.mmtRanks = data.data._items
      this.stockOptions.series = dataAdapter.mmtRanks2Series(data.data._items)
      this.$refs.theRanks.chart.hideLoading();
    },
    receiveMmtScores(data) {
      // TODO data to tabulator datas
      this.theScoreTabulatorData=data
    },
    updateScoresPivotTable() {
      if (this.mmtRanks != null && this.theScoreTabulatorData.length > 0) {
        this.theScoreTabulator.replaceData(
          dataAdapter.mmtScrores2Pivot(this.theScoreTabulatorData, this.mmtRanks))
      } else {
        console.log('Skip updating scores pivot table cause of invalid data')
      }
    }
  },
  mounted() {
    // 显示载入中状态
    this.$refs.theRanks.chart.showLoading();
    // 载入行业评分数据
    repo.rank(this.receiveMmtRanks)
    // 初始化行业股票分数数据表
    this.theScoreTabulator = new Tabulator(this.$refs.theScores,
      {reactiveData:true,
        autoColumns:true,
        data:this.theScoreTabulatorData,
        layout:'fitColumns',
        columns:[{title:'Section', field:'index_name', sorter:'string'},
          {title:'SC', field:'score', sorter:'number'},
          {title:'RK', field:'rank', sorter:'number'},
          {title:'SD', field:'score_diff', sorter:'number'},
          {title:'RD', field:'rank_diff', sorter:'number'}],
        rowFormatter:function(row){
        //create and style holder elements
          var holderEl = document.createElement("div");
          var tableEl = document.createElement("div");
          holderEl.style.boxSizing = "border-box";
          holderEl.style.padding = "1px 1px 1px 1px";
          holderEl.style.borderTop = "1px solid #F33";
          holderEl.style.borderBotom = "1px solid #F33";
          holderEl.style.background = "#Fdd";
          tableEl.style.border = "1px solid #F33";
          holderEl.appendChild(tableEl);
          row.getElement().appendChild(holderEl);
          new Tabulator(tableEl, {
            layout:"fitColumns",
            data:row.getData().members,
            columns:[
              {title:"Name", field:"name"},
              {title:"C20", field:"pct_change_20", sorter:'number'},
            ]
       })
    },
        })
    repo.latestScore(this.receiveMmtScores)
  },
  watch: {
    theScoreTabulatorData(newData) {
      // oldData = oldData
      if (newData != null){
        console.log('Score table data changed')
      }
      // console.log(newData)
      this.updateScoresPivotTable()
    },
    mmtRanks(newData) {
      if (newData != null) {
        console.log('Ranks data arrived')
      }
      // console.log(newData)
      this.updateScoresPivotTable()
    }
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
  width: 70%;
  height: 100%;
}
.mmt-rank-chart {
  position: absolute;
  width: 70%;
  height: 100%;
}

.cur-mmt-scores-table{
  display: inline-block;
  width: 30%;
  height: 100%;
}
</style>
