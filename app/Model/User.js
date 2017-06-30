'use strict'

const Lucid = use('Lucid')
const Hash = use('Hash')
const Antl = use('Antl')

class User extends Lucid {

	static get hidden () {
		return ['password']
	}

	static get deleteTimestamp () {
		return 'deleted_at'
	}
	static get messages () {
		return {}
	}

	static get messages () {
		return {
			'username.required': 'nome de usuário necessário',
			'username.alpha_numeric': 'nome de usuário deve conter apenas letras e números',
			'username.unique':  'nome de usuário deve ser único',
			'username.max': 'nome de usuário deve ter no máximo 64 caracteres',
			'username.min': 'nome de usuário deve ter no mínimo 2 caracteres',

			'first_name.required': 'nome necessário',
			'first_name.max': 'nome deve ter no máximo 64 caracteres',
			'first_name.min': 'nome deve ter no mínimo 2 caracteres',

			'last_name.required': 'sobrenome necessário',
			'last_name.max': 'sobrenome deve ter no máximo 64 caracteres',
			'last_name.min': 'sobrenome deve ter no mínimo 2 caracteres',

			'email.required': 'email necessário',
			'email.email': 'email deve ser válido',
			'email.unique': 'email deve ser único',
			'email.max': 'email deve ter no máximo 128 caracteres',

			'password.required': 'senha necessária',
			'password.confirmed': 'senha deve ser confimarda corretamente',
			'password.min': 'senha deve ter no mínimo 6 caracteres',
			'password.max': 'senha deve ter no máximo 128 caracteres'
		}
	}

	static get rules () {
		return {
			username: 'required|alpha_numeric|unique:users|min:2|max:64',
			first_name: 'required|min:2|max:64',
			last_name: 'required|min:2|max:64',
			email: 'required|email|unique:users|max:254',
			password: 'required|confirmed|min:6|max:128',
		}
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
  }

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

	emailTokens () {
		return this.hasMany('App/Model/EmailToken')
	}

	myRecipes () {
		return this.hasMany('App/Model/Recipe')
	}

	comments () {
		return this.hasMany('App/Model/Comment')
	}

	reviews () {
		return this.hasMany('App/Model/Review')
	}

	ingredients () {
		return this.hasManyThrough('App/Model/Ingredient', 'App/Model/UserIngredient', 'id', 'user_id', 'ingredient_id', 'id')
	}

	recipes () {
		return this.hasManyThrough('App/Model/Recipe', 'App/Model/UserRecipe', 'id', 'user_id', 'recipe_id', 'id')
	}

	menus () {
		return this.hasMany('App/Model/Menu')
	}
}

module.exports = User
