/**
 * 数据处理, data adapter, 将原始数据转换为highcharts使用的序列
 * TOOD: 这里只处理数据，将toRaw放到上游函数来做
 */

const dataForge = require('data-forge')
// 将 reactive Proxy 包装的数据转换为原始数据
import { toRaw } from '@vue/reactivity'

const RANK_NUM = 9

/**
 * 将动量评分数组转换为图表需要的序列
 * @param {*} ranks,从服务器获取的分数数组
 */
function convertMomentumRankToSeries(ranks) {
  var ranksDf = new dataForge.DataFrame(toRaw(ranks))
   // 只选择排名前9的行业
   const dateGroups = ranksDf.groupBy(rank => rank.trade_date)
   const topRanksList = []
   for (var dg of dateGroups) {
     dg = dg.orderByDescending(row => row.score)
     dg = dg.head(RANK_NUM)
     topRanksList.push(dg)
   }
   ranksDf = dataForge.DataFrame.concat(topRanksList)
   ranksDf = ranksDf.orderBy(row => row.trade_date_ms)

  // console.log(ranksDf)
  const groups = ranksDf.groupBy(rank => rank.index_code)
  var serieOptions = []
  for (var group of groups) {
    // groups to series
    group = group.resetIndex()
    var score=[]
    var trade_date_ms = []
    for(var column of group.getColumns().where(colunm => ['score','trade_date_ms'].indexOf(colunm.name) > -1)) {
      // console.log(column.name)
      // console.log(column.series.toArray())
      if (column.name === 'score') {
        score = column.series.toArray()
      }
      if (column.name === 'trade_date_ms') {
        trade_date_ms = column.series.toArray()
      }
    }
    // console.log(trade_date_ms)
    // console.log(score)
    var data = trade_date_ms.map((key, value) => [key, score[value]])
    var serie = {
      name:`${group.at(0).index_name}.${group.at(0).index_code}`,
      data:data
    }
    // console.log(serie)
    serieOptions.push(serie)
  }
  // console.log(serieOptions)
  return serieOptions
}

/**
 * 使用表格嵌套
 * 
 * @param {*} scores, 某一天的行业的成分,json
 * @param {*} rank ，行业评分,json,必须包含scores所在的日期
 */
function convertMomentumScores2PivotTable(scores, ranks) {
  scores = toRaw(scores)
  var curRanks = toRaw(ranks).filter(r => r.trade_date===scores[0].trade_date)
  var curRankDf = new dataForge.DataFrame(curRanks)
  // 只是用分数排名前9的行业
  curRanks = curRankDf.orderByDescending(row => row.score).head(RANK_NUM).toArray()
  for (var rank of curRanks) {
    rank.members = scores.filter(s => s.index_code === rank.index_code)
  }
  // console.log(curRanks)
  return curRanks
}

const dataAdapter = {
  mmtRanks2Series:convertMomentumRankToSeries,
  mmtScrores2Pivot:convertMomentumScores2PivotTable
}

export default dataAdapter
