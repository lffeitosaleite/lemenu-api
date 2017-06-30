'use strict'

const Env = use('Env')
const Youch = use('youch')
const Http = exports = module.exports = {}
const Antl = use('Antl')

//TODO: add error handlers

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {
  const status = error.status || 500

  //if (error.name === 'SyntaxError'){
    //yield response.status(500).json({error: Antl.formatMessage('messages.syntaxerror')})
    //return
  //}


  if (error.name === 'ModelNotFoundException') {
    yield response.status(404).json({message: 'recurso não encontrado'})
    return
  }

  if (error.name === 'InvalidLoginException' || error.name === 'PasswordMisMatchException') {
    yield response.status(401).json({message: 'credenciais inválidas'})
    return
  }

  /**
   * DEVELOPMENT REPORTER
   */
  if (Env.get('NODE_ENV') === 'development') {
    const youch = new Youch(error, request.request)
    const type = request.accepts('json', 'html')
    const formatMethod = type === 'json' ? 'toJSON' : 'toHTML'
    const formattedErrors = yield youch[formatMethod]()
    response.status(status).send(formattedErrors)
    return
  }


  /**
   * PRODUCTION REPORTER
   */
  console.error(error.stack)
  yield response.status(status).sendView('errors/index', {error})
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
}
