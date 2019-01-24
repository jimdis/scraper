'use strict'

const scraper = require('./lib/scraper')

scraper.scrape('http://vhost3.lnu.se:20080/weekend')
  .then(res => console.log(res))
  .catch(e => console.error(e))
