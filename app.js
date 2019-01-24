'use strict'

const scraper = require('./lib/scraper')
const query = require('./lib/query')

scraper.scrape('http://vhost3.lnu.se:20080/weekend')
  .then(res => query.getLinks(res))
  .then(res => console.log(res))
  .catch(e => console.error(e))
