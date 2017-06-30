'use strict'

const Antl = use('Antl')

class Unauth {

  * handle (request, response, next) {
    const isLoggedIn = yield request.auth.check()

    if (isLoggedIn) {
      response.status(401)
      .json({message: 'apenas permitido usuários visitantes'})

      return
    }

    yield next
  }

}

module.exports = Unauth
