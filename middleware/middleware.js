/**
 * Check if user is logged in.
 *
 * @param {*} req Req.
 * @param {*} res Res.
 * @param {Function} next Next.
 * @returns {Function}Next.
 */
function isUserLoggedIn (req, res, next) {
  if (req.session.user) {
    // res.render('index')
    return next()
  } else {
    // throw new Error('Not authenticated')
    res.status(403)
    res.send('Not authenticated')
  }
}

/**
   * Check if user is already in.
   *
   * @param {*} req Req.
   * @param {*} res Res.
   * @param {Function} next Next.
   * @returns {Function}Next.
   */
function notAlreadyLogged (req, res, next) {
  if (req.session.user === undefined) {
    return next()
  } else {
    // throw new Error('Already signed in')
    res.status(403)
    res.send('Already signed in')
  }
}

module.exports = { isUserLoggedIn, notAlreadyLogged }
