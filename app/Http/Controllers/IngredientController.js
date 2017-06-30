'use strict'

const Ingredient = use('App/Model/Ingredient')
const UserIngredient = use('App/Model/UserIngredient')
const Validator = use('Validator')

class IngredientController {
  * addToUser (request, response) {
		const validation = yield Validator.validate({name: request.input('name')}, Ingredient.rules, Ingredient.messages)

    if(validation.fails()) {
			response.status(400)
			.json({data:validation.messages()})
			return
		}

    const ingredient = yield Ingredient.findOrCreate({
      'name': request.input('name')
    }, {'name': request.input('name')})

    const userIngredient = yield UserIngredient.findOrCreate({
      'user_id': request.authUser.id,
      'ingredient_id': ingredient.id
    }, {
      'user_id': request.authUser.id,
      'ingredient_id': ingredient.id
    })

    response.status(201)
    .json({message: 'ingrediente adicionado'})
  }

  * removeFromUser (request, response) {
    const userIngredient = yield UserIngredient.query().where('user_id', request.authUser.id).where('ingredient_id', request.param('id')).first()
    if(userIngredient !== null) {
      yield userIngredient.delete()
    }
    response.status(200)
    .json({message: 'ingrediente removido'})
  }
}

module.exports = IngredientController
