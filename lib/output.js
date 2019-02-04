/**
 * Output module.
 * @module ./lib/output.js
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

/**
 * Matches movie names and times with available dinner times and outputs to console.
 *
 * @param {Object} movies Object with movie names and times
 * @param {Object} tables Object with table times
 */
module.exports.logResults = (movies, tables) => {
  const fixName = (str) => str.charAt(0).toUpperCase() + str.slice(1)
  tables.forEach(table => {
    movies.filter(movie => movie.dinnerTime <= table.from && movie.day === table.day)
      .forEach(movie => {
        console.log(`\n** On ${fixName(movie.day)} there is a free table between ${table.from}:00 to ${table.to}:00,
after you have seen "${movie.movieTitle}" which starts at ${movie.movieStarts}:00.`)
      })
  })
}
