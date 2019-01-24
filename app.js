'use strict'

const CalendarMatcher = require('./lib/CalendarMatcher')

const url = 'http://vhost3.lnu.se:20080/weekend'

const matcher = new CalendarMatcher(url)

const matchCalendars = async () => {
  try {
    matcher.baseLinks = await matcher.getLinks(matcher.baseURL)
    matcher.calendars = await matcher.getLinks(matcher.baseLinks[0])
    let freeDays = []
    for (let calendar of matcher.calendars) {
      let days = await matcher.getDays(calendar)
      freeDays.push(days)
    }
    matcher.availableDays = matcher.matchDays(freeDays)
    matcher.getMovies()
  } catch (e) { console.error(e) }
}

matchCalendars()

// const getMatch = async (url) => {
//   let html = await scraper.scrape(url)
//   const mainLinks = await query.getLinks(html)
//   html = await scraper.scrape(mainLinks[0])
//   // let calendarLinks = await query.getLinks(html)
//   console.log(html)
// }

// getMatch(url)

// scraper.scrape('http://vhost3.lnu.se:20080/weekend')
//   .then(res => query.getLinks(res))
//   .then(res => {
//     sites = res
//   })
//   .then(res => console.log(res))
//   .catch(e => console.error(e))
