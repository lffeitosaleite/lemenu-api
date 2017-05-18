'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')
const Hash = use('Hash')

class UserController {

  //  TODO:
  //    email verification
  //      1 - create and send email to user with url to Active/token
  //      2 - with valid token Active the account
  //      3 - while count not active, dont allow user to login
  //    password reset


  * updatePassword (request, response) {
    const user = yield User.findBy('id', request.authUser.id)
    const basicAuth = request.auth.authenticator('basic')
    try{
      yield basicAuth.validate(user.email, request.input('old_password'))

      const validation = yield Validator.validate(request.all(), {
        'new_password': 'required|confirmed|min:6|max:30'
      }, {
        'new_password.required': 'Senha é necessária',
        'new_password.confirmed': 'Confirmação de senha incorreta',
        'new_password.min': 'Senha deve ter no mínimo 6 caractéres',
        'new_password.max': 'Senha deve ter no máximo 30 caractéres'
      })

      if (validation.fails()) {
        response.json(validation.messages())
        return
      }

      user.password = request.input('new_password')
      yield user.save()

      response.json({message: 'Senha de usuário atualizada com sucesso'})
      return
    } catch (e) {
      response.unauthorized('Senha incorreta')
    }
  }

  * signup (request, response) {
    const userData = request.all()
    const validation = yield Validator.validate(userData, User.rules, User.messages)

    if (validation.fails()) {
      response.json(validation.messages())
      return
    }

    delete(userData.password_confirmation)
    const user = new User()
    user.fill(userData)
    yield user.save()

    response.json({message: 'Usuário criado com sucesso'})
  }

  * logoutOthers (request, response){
    const token = request.header('Authorization').replace('Bearer ', '')
    yield request.auth.revokeExcept(request.authUser, [token])
    response.json({message: 'Outros dispositivos desconectados'})
  }

  * logout (request, response){
    const token = request.header('Authorization').replace('Bearer ', '')
    yield request.auth.revoke(request.authUser, [token])
    response.json({message: 'Logout efetuado com sucesso'})
  }

  * login (request, response){
    const email = request.input('email')
    const password = request.input('password')

    const basicAuth = request.auth.authenticator('basic')
    const api = request.auth.authenticator('api')

    try{
      yield basicAuth.validate(email, password)
      const user = yield User.findBy('email', email)

      const apiToken = yield api.generate(user)

      response.json({meessage: 'Login efetuado com sucesso', token: apiToken})

      return
    } catch (e) {
      response.unauthorized('Credenciais inválidas')
    }
  }
}

module.exports = UserController
