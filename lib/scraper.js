'use strict'

const request = require('request')
const cheerio = require('cheerio')

const scrape = (url, cookie) => new Promise((resolve, reject) => {
  let arg = url
  // Handles cookie if passed
  if (cookie) {
    let j = request.jar()
    let cookieString = request.cookie(cookie)
    j.setCookie(cookieString, url)
    arg = { url: url, jar: j }
  }
  request(arg, (error, response, body) => {
    if (error) return reject(error)
    if (response.statusCode !== 200) return reject(response.statusCode)
    resolve(body)
  })
})

const getLogin = (url, post) => new Promise((resolve, reject) => {
  request.post(url, { form: post }, (error, response, body) => {
    if (error) return reject(error)
    // if (response.statusCode !== 200) return reject(response.statusCode)
    let cookie = response.headers['set-cookie'].toString()
    cookie = cookie.slice(0, cookie.indexOf(';'))
    url = response.headers['location']
    resolve({
      url: url,
      cookie: cookie
    })
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
  getLogin: getLogin,
  getLinks: getLinks
}
