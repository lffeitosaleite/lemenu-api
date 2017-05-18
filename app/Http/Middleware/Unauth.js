'use strict'

class Unauth {

  * handle (request, response, next) {
    const isLoggedIn = yield request.auth.check()

    if (isLoggedIn) {
      response.json({
        error: {
          message: 'Allowed only to anonymous users',
          status: 401
        }
      })
      return
    }
    
    yield next
  }

}

module.exports = Unauth
