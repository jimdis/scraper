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
 * @param {string} referURL URL of the referring page.
 * @param {string} postURL URL of the page to POST data to.
 * @param {Object} postQuery Object { username: {string}, password: {string} }
 * }
 * @returns {Promise} Promise object representing the body of the logged in URL.
 */
const getLogin = (referURL, postURL, postQuery) => new Promise((resolve, reject) => {
  console.log(`POST TO: ${postURL}`)
  request.post(postURL, { form: postQuery }, (error, response, body) => {
    if (error) return reject(error)
    if (response.statusCode !== 302) return reject(response.statusCode)
    let cookie = response.headers['set-cookie'].toString().split(';')[0]
    let j = request.jar()
    j.setCookie(request.cookie(cookie), referURL)
    let nextURL = `${referURL}/${response.headers['location']}`
    resolve(fetch({ url: nextURL, jar: j }))
  })
})
/**
 * Crawls the web page, extracts and returns the unique absolute links.
 *
 * @param {string} url URL to crawl
 * @returns {Promise} Promise object represents an array of links found.
 */
const getLinks = async (url) => {
  const $ = cheerio.load(await fetch(url))
  let baseURL = url.slice(0, url.lastIndexOf('/') + 1)
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
