'use strict'

const Validator = use('Validator')
const Ingredient = use('App/Model/Ingredient')

class IngredientController {

  *getByName (request, response) {
    const ingredient = yield Ingredient.findBy('name', request.param('name'))
    response.json(ingredient)
  }

  *get (request, response) {
    const ingredient = yield Ingredient.find(request.param('id'))
    response.json(ingredient)
  }

  * getAll (request, response) {
    const ingredients = yield Ingredient.all()
    response.json(ingredients)
  }

  * create (request, response) {
    const validation = yield Validator.validate(request.all(), Ingredient.rules, Ingredient.messages)

    if (validation.fails()) {
      response.json(validation.messages())
      return
    }

    const ingredient = new Ingredient()
    ingredient.fill(request.all())
    yield ingredient.save()

    response.json({message: 'Ingrediente criado com sucesso'})
  }
}

module.exports = IngredientController
