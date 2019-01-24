'use strict'
const cheerio = require('cheerio')

const getLinks = html => new Promise((resolve, reject) => {
  const $ = cheerio.load(html)
  let links = []
  $('body').find('a').each((i, el) => {
    let link = $(el).attr('href')
    if (link.substr(0, 4) === 'http') links.push(link)
  })
  if (links.length < 1) return reject(new Error('The data passed contains no links'))
  resolve(links)
})

module.exports = {
  getLinks: getLinks
}
