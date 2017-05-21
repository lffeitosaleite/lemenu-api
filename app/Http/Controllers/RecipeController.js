'use strict'

const Validator = use('Validator')
const Recipe = use('App/Model/Recipe')
const RecipeIngredient = use('App/Model/RecipeIngredient')

class RecipeController {

  * get (request, response) {
    const recipe = yield Recipe.query().where('id', request.param('id'))
    .with('user', 'ingredients').scope('ingredients', (builder)=>{builder.with('ingredient', 'measure')}).fetch()
    response.json(recipe)
  }

  * getAll (request, response) {
    const recipe = yield Recipe.query()
    .with('user', 'ingredients').scope('ingredients', (builder)=>{builder.with('ingredient', 'measure')}).fetch()
    response.json(recipe)
  }

  * remove  (request, response) {
    const recipe = yield Recipe.find(request.param('id'))
    if (!recipe) {
      response.json({'message': 'Receita não existe'})
      return
    }
    if (recipe.user_id !== request.authUser.id) {
      response.json({'message': 'Apenas o autor pode remover a receita'})
      return
    }

    var recipeIngredients = yield RecipeIngredient.query().where('recipe_id', recipe.id).first()
    while(recipeIngredients) {
      yield recipeIngredients.delete()
      recipeIngredients = yield RecipeIngredient.query().where('recipe_id', recipe.id).first()
    }

    yield recipe.delete()

    response.json({'message': 'Receita removida com sucesso'})

  }
  * update (request, response) {
    const recipe = yield Recipe.find(request.param('id'))

    if (!recipe) {
      response.json({'message': 'Receita não existe'})
      return
    }

    if (recipe.user_id !== request.authUser.id) {
      response.json({'message': 'Apenas o autor da receita pode fazer edições'})
      return
    }

    const recipeData = yield request.all()
    const validation = yield Validator.validate(recipeData, Recipe.rules, Recipe.messages)
    if (validation.fails()) {
      response.json(validation.messages())
      return
    }

    recipe.fill(recipeData)
    yield recipe.save()

    response.json({'message': 'Receita atualizada com sucesso'})
  }

  * create (request, response) {
    const recipeData = yield request.all()
    const validation = yield Validator.validate(recipeData, Recipe.rules, Recipe.messages)


    if (validation.fails()) {
      response.json(validation.messages())
      return
    }


    const recipe = new Recipe()
    recipe.fill(recipeData)
    recipe.user_id = request.authUser.id
    yield recipe.save()

    response.json({message: 'Receita criada com sucesso'})
  }
}

module.exports = RecipeController
