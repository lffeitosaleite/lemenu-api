'use strict'

const Recipe = use('App/Model/Recipe')
const Tag = use('App/Model/Tag')
const Ingredient = use('App/Model/Ingredient')
const Measure = use('App/Model/Measure')
const RecipeIngredientMeasure = use('App/Model/RecipeIngredientMeasure')
const Validator = use('Validator')
const UserRecipe = use('App/Model/UserRecipe')
const Comment = use('App/Model/Comment')
const Review = use('App/Model/Review')

class RecipeController {

  * review (request, response) {
    const recipe = yield findOrFail(request.param('id'))
    const rate = parseInt(request.input('rate'))
    const validation = yield Validator.validate(rate, Review.rules, Review.messages)

    if(validation.fails()) {
      response.status(400)
      .json({data:validation.messages()})
      return
    }

    const review = yield Review.findOrCreate({
      user_id: request.authUser.id,
      recipe_id: recipe.id
    }, {
      user_id: request.authUser.id,
      recipe_id: recipe.id,
      'rate': rate
    })

    response.status(200)
    .json({message: 'avaliação adicioanada', data: review})
  }

  * comment (request, response) {
    const recipe = yield findOrFail(request.param('id'))
    const validation = yield Validator.validate({comment: request.input('comment')}, Comment.rules, Comment.messages)

    if(validation.fails()) {
      response.status(400)
      .json({data:validation.messages()})
      return
    }

    const comment = new Comment()
    comment.comment = request.input('comment')
    comment.recipe_id = request.param('id')
    comment.user_id = request.authUser.id

    yield commet.save()

    response.status(201)
    .json({message:'comentário adicionado'})
  }

  * view (request, response) {
      const recipe = yield Recipe.findOrFail(request.param('id'))
      recipe.views = recipe.views+1
      yield recipe.save()

      response.status(200)
      .json({message: 'receita atualizada'})
  }

  * search (request, response) {
    let queryString = decodeURIComponent(request.param(0))
    const recipes = yield Recipe.query().where('title', 'like', '%'+queryString+'%').where('public', true)
    .with('ingredientsMeasures', 'tags').scope('ingredientsMeasures', (builder)=>{builder.with('ingredient', 'measure')}).orderBy('views', 'desc').fetch()
    response.status(200)
    .json({message: 'receitas resgatadas', data: recipes})
  }

  * searchByTags (request, response) {

    let queryStrings = decodeURIComponent(request.param(0)).replace(',', '').split(" ")

    var recipesIds = new Array()
    var first = false
    var aux
    for(var i=0; i<queryStrings.length; i++){
      aux = yield Recipe.query().where('public', true)
      .whereHas('tags', (builder)=>{
        builder.where('name', 'like', '%'+queryStrings[i]+'%')
      }).pluck('id')

      aux = Array.from(aux)

      if(aux.length > 0){
        if(!first){
          recipesIds = aux
          first = true
        } else {
          recipesIds = aux.filter(x=>recipesIds.indexOf(x)>=0)
        }
      }
    }

    const recipes = yield Recipe.query().whereIn('id', recipesIds)
    .with('ingredientsMeasures', 'tags')
    .scope('ingredientsMeasures', (builder)=>{builder.with('ingredient', 'measure')})
    .orderBy('views', 'desc').fetch()

    response.status(200)
    .json({message: 'receitas resgatadas', data:recipes})
  }

  * searchByIngredients (request, response) {

    let queryStrings = decodeURIComponent(request.param(0)).replace(',', '').split(" ")

    var recipesIds = new Array()
    var first = false
    var aux
    for(var i=0; i<queryStrings.length; i++){
      aux = yield Recipe.query().where('public', true)
      .whereHas('ingredients', (builder)=>{
        builder.where('name', 'like', '%'+queryStrings[i]+'%')
      }).pluck('id')

      aux = Array.from(aux)

      if(aux.length > 0){
        if(!first){
          recipesIds = aux
          first = true
        } else {
          recipesIds = aux.filter(x=>recipesIds.indexOf(x)>=0)
        }
      }
    }

    const recipes = yield Recipe.query().whereIn('id', recipesIds)
    .with('ingredientsMeasures', 'tags')
    .scope('ingredientsMeasures', (builder)=>{builder.with('ingredient', 'measure')})
    .orderBy('views', 'desc').fetch()

    response.status(200)
    .json({message: 'receitas resgatadas', data:recipes})
  }

  * remove (request, response) {
    const recipe = yield Recipe.findOrFail(request.param('id'))
    if(recipe.user_id != request.authUser.id) {
      response.status(401)
      .json({message: 'credenciais inválidas'})
      return
    }

    yield recipe.delete()
    response.status(200)
    .json({message: 'receita removida'})
    return
  }

  * removeFromUser (request, response) {
      const userRecipe = yield UserRecipe.query().where('user_id', request.authUser.id)
      .where('recipe_id', request.param('id')).first()
      if(userRecipe !== null) {
        yield userRecipe.delete()
      }
      response.status(200)
      .json({message: 'receita removida'})
  }

  * addToUser (request, response) {
    const recipe = yield Recipe.findOrFail(request.param('id'))

    if(recipe.public != true) {
      response.status(404)
      .json({message: 'recurso não encontrado'})
      return
    }
    if(recipe.user_id == request.authUser.id) {
      response.status(200)
      .json({message: 'receita já pertence ao usuário'})
      return
    }

    const userRecipe = yield UserRecipe.findOrCreate({
      user_id: request.authUser.id,
      recipe_id: recipe.id
    }, {
      user_id: request.authUser.id,
      recipe_id: recipe.id
    })

    response.status(201)
    .json({message: 'receita adicionada'})
  }

  * edit (request, response) {
      const recipe = yield Recipe.findOrFail(request.param('id'))
      if(recipe.user_id !== request.authUser.id) {
        response.status(401)
        .json({message: 'credenciais inválidas'})
        return
      }

      let recipeData = request.all()
      recipeData.duration = parseInt(recipeData.duration)
      recipeData.portions = parseInt(recipeData.portions)
  		const validation = yield Validator.validate(recipeData, Recipe.rules, Recipe.messages)

      if(validation.fails()) {
  			response.status(400)
  			.json({data:validation.messages()})
  			return
  		}

      recipe.title = recipeData.title
      recipe.description = recipeData.description
      recipe.duration = recipeData.duration
      recipe.portions = recipeData.portions
      recipe.public = recipeData.public

      yield recipe.save()
      //remove from cookbooks
      if(recipe.public == false) {
          const userIngredients = yield UserIngredient.query().where('recipe_id', recipe.id).delete()
      }

      response.status(200)
      .json({message: 'receita atualizada', data: recipe})

  }

  * removeIngredient (request, response) {
    const recipeIngredientMeasure = yield RecipeIngredientMeasure.findOrFail(request.param('id'))
    const recipe = yield Recipe.findOrFail(recipeIngredientMeasure.recipe_id)
    if(recipe.user_id !== request.authUser.id) {
      response.status(401)
      .json({message: 'credenciais inválidas'})
      return
    }

    yield recipeIngredientMeasure.delete()
    response.status(200)
    .json({message: 'ingrediente removido de receita'})
  }

  * addIngredient (request, response) {
      const recipe = yield Recipe.findOrFail(request.param('id'))

      if(recipe.user_id !== request.authUser.id) {
        response.status(401)
        .json({message: 'credenciais inválidas'})
        return
      }

      const ingredientData = request.all()
      ingredientData.qty = parseInt(ingredientData.qty)

      const validation = yield Validator.validate(ingredientData, RecipeIngredientMeasure.rules, RecipeIngredientMeasure.messages)
  		if(validation.fails()) {
  			response.status(400)
  			.json({data:validation.messages()})
  			return
  		}

      const ingredient = yield Ingredient.findOrCreate({
        name: ingredientData.ingredient_name
      }, {
        name: ingredientData.ingredient_name
      })

      const measure = yield Measure.findOrCreate({
        name: ingredientData.measure_name
      }, {
        name: ingredientData.measure_name
      })

      const recipeIngredientMeasure = yield RecipeIngredientMeasure.findOrCreate({
        recipe_id: recipe.id,
        ingredient_id: ingredient.id,
        measure_id: measure.id,
        qty: ingredientData.qty
      }, {
        recipe_id: recipe.id,
        ingredient_id: ingredient.id,
        measure_id: measure.id,
        qty: ingredientData.qty
      })

      response.status(200)
      .json({message: 'ingrediente adicionado', data:recipeIngredientMeasure})
  }

  * getAll (request, response) {
    const recipes = yield Recipe.query().where('public', true).with('ingredientsMeasures', 'tags')
    .scope('ingredientsMeasures', (builder)=>{builder.with('ingredient', 'measure')}).fetch()
    response.status(200)
    .json({message: 'receitas resgatadas', data: recipes})
  }

  * get (request, response) {
    const recipe = yield Recipe.query().where('id', request.param('id')).with('ingredientsMeasures', 'tags', 'comments')
    .scope('ingredientsMeasures', (builder)=>{builder.with('ingredient', 'measure')}).first()
    if(recipe == null) {
      yield response.status(404).json({message: 'recurso não encontrado'})
      return
    }

    if(recipe.public) {
      response.status(200)
      .json({message: 'receita resgatada', data: recipe})
    }

    if(recipe.user_id == request.currentUser.id){
      response.status(200)
      .json({message: 'receita resgatada', data: recipe})
    }

    response.status(401)
    .json({message: 'usuário não permitido'})
  }
  * create (request, response) {
    let recipeData = request.all()
    recipeData.duration = parseInt(recipeData.duration)
    recipeData.portions = parseInt(recipeData.portions)
		const validation = yield Validator.validate(recipeData, Recipe.rules, Recipe.messages)

    if(validation.fails()) {
			response.status(400)
			.json({data:validation.messages()})
			return
		}

    const recipe = yield request.authUser.myRecipes().create({
      title: recipeData.title,
      description: recipeData.description,
      portions: recipeData.portions,
      duration: recipeData.duration,
      public: recipeData.public
    })

    response.status(201)
    .json({message: 'receita criada', data: recipe})
  }
}

module.exports = RecipeController
