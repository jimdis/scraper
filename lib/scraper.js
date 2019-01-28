/**
 * Scraper module.
 * @module ./lib/scraper.js
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const request = require('request')
const cheerio = require('cheerio')

/**
 * Fetches a URL and returns its body.
 *
 * @param {string} url URL
 * @returns {Promise} Promise object representing the body of the URL request
 */
const fetch = (url) => new Promise((resolve, reject) => {
  request(url, (error, response, body) => {
    if (error) return reject(error)
    if (response.statusCode !== 200) return reject(new Error(`Your request for ${url} gave response code ${response.statusCode}`))
    resolve(body)
  })
})
/**
 * Requests a URL using POST and uses session cookie to login to the redirected URL.
 *
 * @param {string} url URL
 * @param {Object} post Object {
 * path: {string} The path to the query relative to the URL
 * query: {Object} {username: {string}, password: {string}}
 * }
 * @returns {Promise} Promise object representing the body of the logged in URL.
 */
const getLogin = (url, post) => new Promise((resolve, reject) => {
  let arg = url
  request.post(`${url}/${post.path}`, { form: post.query }, (error, response, body) => {
    if (error) return reject(error)
    if (response.statusCode !== 302) return reject(response.statusCode)
    let cookie = response.headers['set-cookie'].toString()
    cookie = cookie.slice(0, cookie.indexOf(';'))
    let j = request.jar()
    let cookieString = request.cookie(cookie)
    j.setCookie(cookieString, url)
    url = `${url}/${response.headers['location']}`
    arg = { url: url, jar: j }
    resolve(fetch(arg))
  })
})
/**
 * Crawls the web page, extracts and returns the unique absolute links.
 *
 * @param {string} url URL to crawl
 * @returns {Promise} Promise object represents an array of links found.
 */
const getLinks = async (url) => {
  let html = await fetch(url)
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
  fetch: fetch,
  getLogin: getLogin,
  getLinks: getLinks
}
