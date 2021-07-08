/**
 * 从服务端获取数据工具类
 */


const axios = require("axios");
// const dataForge = require("data-forge");

axios.defaults.baseURL = 'http://127.0.0.1:5000';

const DURATION = 750

const trade_date_url = `/trade_calendar_item?max_results=${DURATION}&sort=-cal_date&&where={"exchange":"SSE","cal_date":{"$lte":${Date.now()}}}`


function add0(m) {
    return m < 10 ? '0' + m: m
}

function today_in_YYYYmmdd(){
    var now = new Date()
    return '' + now.getFullYear()  + add0(now.getMonth() + 1) + add0(now.getDate())
}

function momentum_daily_rank_jf(receive) {
  axios.get(trade_date_url).then((data) => {
    //console.log(data.data._items)
    const len = data.data._items.length
    const end_date = data.data._items[0].cal_date
    const start_date = data.data._items[len - 1].cal_date
    console.log(start_date)
    console.log(end_date)
    const momentum_daily_rank_jf_url = `/momentum_daily_rank_jf_item?max_results=9999999&sort=trade_date_ms&where={"trade_date_ms":{"$lte":${end_date}}, "trade_date_ms":{"$gte":${start_date}}}`
    axios.get(momentum_daily_rank_jf_url).then((data) => {
      console.log(today_in_YYYYmmdd())
      receive(data)
    })
  })

}


const repo = {
    rank: momentum_daily_rank_jf
}

export default repo 