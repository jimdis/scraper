'use strict'

const request = require('request')
const cheerio = require('cheerio')

const scrape = url => new Promise((resolve, reject) => {
  request(url, (error, response, body) => {
    if (error) return reject(error)
    if (response.statusCode !== 200) return reject(response.statusCode)
    resolve(body)
  })
})

const getLinks = async (url) => {
  let html = await scrape(url)
  let baseURL = url.slice(0, url.lastIndexOf('/') + 1)
  const $ = cheerio.load(html)
  let links = []
  $('body').find('a').each((i, el) => {
    let link = $(el).attr('href')
    if (link.substr(0, 4) === 'http') {
      links.push(link)
    } else { links.push(`${baseURL}${link}`) }
  })
  if (links.length < 1) return (new Error('The data passed contains no links'))
  return links
}
module.exports = {
  scrape: scrape,
  getLinks: getLinks
}
