'use strict'

const Lucid = use('Lucid')
const Hash = use('Hash')

class User extends Lucid {

  static get messages () {
    return {
      'username.required': 'Nome de usuário é necessário',
      'username.alpha_numeric': 'Nome de usuário deve conter apenas letras e números',
      'username.unique': 'O nome de usuário já está em uso',

      'email.required': 'Email é necessário',
      'email.email': 'Email inválido',
      'email.unique': 'Email já está em uso',

      'password.required': 'Senha é necessária',
      'password.confirmed': 'Confirmação de senha incorreta',
      'password.min': 'Senha deve ter no mínimo 6 caractéres',
      'password.max': 'Senha deve ter no máximo 30 caractéres'
    }
  }

  static get rules () {
    return {
      username: 'required|alpha_numeric|unique:users',
      email: 'required|email|unique:users',
      password: 'required|confirmed|min:6|max:30'
    }
  }

  static get hidden () {
    return ['password']
  }

  static boot () {
    super.boot()

    /**
    * Hashing password before storing to the
    * database.
    */
    this.addHook('beforeCreate', function * (next) {
      this.password = yield Hash.make(this.password)
      yield next
    })

    this.addHook('beforeUpdate', function * (next) {
      this.password = yield Hash.make(this.password)
      yield next
    })
  }

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

}

module.exports = User
