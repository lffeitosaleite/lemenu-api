'use strict'
const Recipe = use('App/Model/Recipe')
const Ingredient = use('App/Model/Ingredient')
const Measure = use('App/Model/Measure')
const RecipeIngredient = use('App/Model/RecipeIngredient')
const Validator = use('Validator')

class RecipeIngredientController {
  * create (request, response) {
    const recipe = yield Recipe.find(request.param('id'))
    if (!recipe) {
      response.json({'message': 'Receita não existe'})
      return
    }
    if (recipe.user_id !== request.authUser.id) {
      response.json({'message': 'Apenas o autor da receita pode adicionar ingredientes'})
      return
    }

    var ingredient = yield Ingredient.findBy('name', request.input('ingredient'))
    if (!ingredient) {
      const ingredientData = {'name': request.input('ingredient')}
      const ingredientValidation = yield Validator.validate(ingredientData, Ingredient.rules, Ingredient.messages)

      if (ingredientValidation.fails()) {
        response.json({'message': 'Falha ao criar ingrediente', 'error': ingredientValidation.messages()})
        return
      }

      ingredient = new Ingredient()
      ingredient.name = request.input('ingredient')
      yield ingredient.save()
    }

    var measure = yield Measure.findBy('name', request.input('measure'))

    if (!measure) {
      const measureData = {'name': request.input('measure')}
      const measureValidation = yield Validator.validate(measureData, Measure.rules, Measure.messages)

      if (measureValidation.fails()) {
        response.json({'message': 'Falha ao criar medida', 'error': measureValidation.messages()})
        return
      }

      measure = new Measure()
      measure.name = request.input('measure')
      yield measure.save()
    }

    const qty = request.input('qty')
    const validation = yield Validator.validate({'qty': parseInt(qty)}, RecipeIngredient.rules, RecipeIngredient.messages)

    if (validation.fails()) {
      response.json(validation.messages())
      return
    }

    const recipeIngredient = new RecipeIngredient()
    recipeIngredient.recipe_id = recipe.id
    recipeIngredient.ingredient_id = ingredient.id
    recipeIngredient.measure_id = measure.id
    recipeIngredient.qty = qty

    yield recipeIngredient.save()


    response.json({'message': 'Adicionado à receita'})
    return
  }
}

module.exports = RecipeIngredientController
