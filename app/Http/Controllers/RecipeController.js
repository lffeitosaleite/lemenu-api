'use strict'

const Validator = use('Validator')
const Recipe = use('App/Model/Recipe')

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
