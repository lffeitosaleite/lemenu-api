'use strict'

const Validator = use('Validator')
const Recipe = use('App/Model/Recipe')
const IngredientController = use('App/Http/Controllers/IngredientController')
class RecipeController {

  * create (request, response) {
    const recipeData = yield request.all()
    const validation = yield Validator.validate(recipeData, Recipe.rules, Recipe.messages)

    if (validation.fails()) {
      response.json(validation.messages())
      return
    }

    const recipe = new Recipe()
    recipe.fill(recipeData)
    yield recipe.save()

    response.json({message: 'Receita criada com sucesso'})
  }
}

module.exports = RecipeController
