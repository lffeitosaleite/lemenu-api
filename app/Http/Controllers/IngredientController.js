'use strict'

const Validator = use('Validator')
const Ingredient = use('App/Model/Ingredient')

class IngredientController {

  *getByName (request, response) {
    try{ 
      const ingredient = yield Ingredient.findByOrFail('name', request.param('name'))
      response.json(ingredient)
    } catch(e) {
      response.json({'message': 'Ingrediente não encontrado'})  
      return
    }
  }

  *get (request, response) {
    try {
      const ingredient = yield Ingredient.findOrFail(request.param('id'))
      response.json(ingredient)
    } catch(e) {
      response.json({'message': 'Ingrediente não encontrado'})  
      return
    }
  }

  * getAll (request, response) {
    const ingredients = yield Ingredient.query()
    .with('recipes').fetch()
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
