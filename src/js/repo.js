/**
 * 从服务端获取数据工具类
 * TODO: 统一函数命名
 */


const axios = require("axios");
// const dataForge = require("data-forge");

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = 'http://82.156.18.164/api/';
} else {
    axios.defaults.baseURL = 'http://127.0.0.1:5000';
}

const DURATION = 500

const trade_date_url = `/trade_calendar_item?max_results=${DURATION}&sort=-cal_date&&where={"exchange":"SSE","cal_date":{"$lte":${Date.now()}}}`


function getLatestMetadata() {
  return axios.get(`/meta_data_item?max_results=1&sort=-update_date&where={"data_set":"momentum_daily_rank_jf"}`)
}

function add0(m) {
    return m < 10 ? '0' + m: m
}

function ms2YYYYmmdd(ms) {
  var date = new Date(ms)
  return `${date.getFullYear()}${add0(date.getMonth() + 1)}${add0(date.getDate())}`
}

/*
function today_in_YYYYmmdd(){
    var now = new Date()
    return '' + now.getFullYear()  + add0(now.getMonth() + 1) + add0(now.getDate())
}
*/

function momentum_daily_rank_jf(receive) {
  axios.get(trade_date_url).then((data) => {
    //console.log(data.data._items)
    const len = data.data._items.length
    const end_date = data.data._items[0].cal_date
    const start_date = data.data._items[len - 1].cal_date
    // console.log(start_date)
    // console.log(end_date)
    const momentum_daily_rank_jf_url = `/momentum_daily_rank_jf_item?max_results=9999999&sort=trade_date_ms&where={"trade_date_ms":{"$lte":${end_date}}, "trade_date_ms":{"$gte":${start_date}}}`
    axios.get(momentum_daily_rank_jf_url).then((data) => {
      // console.log(today_in_YYYYmmdd())
      receive(data)
    })
  })
}


/**
 * 获取某一天的个股的分数
 * @param {*} date 毫秒级日期
 * @param {*} receive 收取数据的回调
 */
function momentum_daily_score_jf(date, receive) {
  const score_url = `/momentum_daily_rank_pick_jf_item?where={"trade_date":"${ms2YYYYmmdd(date)}"}`
    axios.get(score_url).then(data => {
      receive(data.data._items)
  })
}

/**
 * 获取最新的分数数据
 * @param {*} receive 
 */
function latest_momentum_daily_score_jf(receive) {
  getLatestMetadata().then((data) => {
    console.log(ms2YYYYmmdd(data.data._items[0].update_date))
    const score_url = `/momentum_daily_rank_pick_jf_item?where={"trade_date":"${ms2YYYYmmdd(data.data._items[0].update_date)}"}`
    axios.get(score_url).then((data) => {
      receive(data.data._items)
    })
  })
}


const repo = {
  rank: momentum_daily_rank_jf,
  score: momentum_daily_score_jf,
  latestScore: latest_momentum_daily_score_jf,  
}

export default repo 
