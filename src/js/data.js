/**
 * 数据处理, data adapter, 将原始数据转换为highcharts使用的序列
 */

const dataFroge = require('data-forge')

/**
 * 将动量评分数组转换为图表需要的序列
 * @param {*} ranks,从服务器获取的分数数组
 */
function convertMomentumRankToSeries(ranks) {
  const ranksDf = new dataFroge.DataFrame(ranks)
  console.log(ranksDf)
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

const dataAdapter = {
  mmtRanks2Series:convertMomentumRankToSeries
}

export default dataAdapter