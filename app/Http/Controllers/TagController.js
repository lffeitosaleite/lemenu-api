'use strict'

const Tag = use('App/Model/Tag')
const Validator = use('Validator')
const Recipe = use('App/Model/Recipe')
const RecipeTag = use('App/Model/RecipeTag')
class TagController {
  * addToRecipe (request, response) {
    const recipe = yield Recipe.findOrFail(request.param('id'))

    if(recipe.user_id!==request.authUser.id) {
      response.status(401)
      .json({message: 'credenciais inválidas'})
      return
    }

    const validation = yield Validator.validate({name: request.input('name')}, Tag.rules, Tag.messages)
    if(validation.fails()) {
      response.status(400)
      .json({data:validation.messages()})
      return
    }

    const tag = yield Tag.findOrCreate({
      name: request.input('name')
    }, {
      name: request.input('name')
    })

    const recipeTag = yield RecipeTag.findOrCreate({
      recipe_id: recipe.id,
      tag_id: tag.id
    }, {
      recipe_id: recipe.id,
      tag_id: tag.id
    })

    response.status(201)
    .json({message: 'tag adicionada'})
  }

  * removeFromRecipe (request, response) {
    const recipeTag = yield RecipeTag.query().where('recipe_id', request.param('recipe_id'))
    .where('tag_id', request.param('tag_id')).first()
    const recipe = yield Recipe.findOrFail(request.param('recipe_id'))

    if(recipe.user_id !== request.authUser.id) {
      response.status(401)
      .json({message: 'credenciais inválidas'})
      return
    }
    if(recipeTag !== null) {
        yield recipeTag.delete()
    }
    response.status(200)
    .json({message: 'tag removida'})

  }
}

module.exports = TagController
