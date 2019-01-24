'use strict'

const request = require('request')

const scrape = async url => new Promise((resolve, reject) => {
  request(url, (error, response, body) => {
    if (error) return reject(error)
    if (response.statusCode !== 200) return reject(response.statusCode)
    resolve(body)
  })
})

module.exports = {
  scrape: scrape
}
